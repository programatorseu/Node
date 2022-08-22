## 2. Command line scripts

in the top `hashbang` symbol to tell interpreter we are dealing with bash scripts 

program called `env` -> we will pass name of program - it will find wherever is in system



- we might need to change mode for our file 

```bash
chmod u+x ex1.js
./ex1.js # it will run the same 
```

```js
#! /usr/bin/env node
"use strict";

console.log("Hello world");
```



### 2.1 Command line arguments

`argv` -list of arguments 

- return array with [node location, file location, passed argument]

```js
./ex1.js --hello=world
[ '--hello=world' ]
```

- minimist - when we require package it is actually function - so we are going to call immediately

```js
var args = require("minimist")(process.argv);
console.log(args);
```

It returns object 

```bash
./ex1.js --hello=s
{
  _: [
    '/usr/local/bin/node',
    '/Users/programators/Desktop/node/console/ex1.js'
  ],
  hello: 's'
}
```



```js
var args = require("minimist")(process.argv.slice(2));
```





>> ./ex1.js --hello=s
>> { _: [], hello: 's' }



`_:[]` ->. overflow for minimist to deal with anything crom commnd line that it does not undersntad 

**configuration**

- we overwrite default guessing what type of value might be passed there

```js
"use strict";
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help"], 
    string: ["file"]
});
console.log(args);
```



```bash
./ex1.js --help=foobar --file
```

>
>
>{_: [], help:true, file: ''}



### 2.2 Argument handling 

```bash
./ex1.js --file="hello"
# hello
```

```js
#! /usr/bin/env node
"use strict";
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help"], 
    string: ["file"]
});
if(args.help) {
    printHelp();
} else if (args.file) {
    console.log(args.file);
}
else {
    error("Incorrect usage.", true);
}

// printHelp();
function error(msg, includeHelp = false) {
    console.error(msg);
    if(includeHelp) {
        console.log("");
        printHelp();
    }
}
function printHelp() {
    console.log("ex1 usage:");
    console.log("   ex1 usage --file={FILENAME}");
    console.log("");
    console.log("--help             print this help");
    console.log("--file={FILENAME   process the file");
    console.log("");

}
```

### 2.3 Reading files with PATH & FS modules

- path built-in node 

`resolve`method 

- hanlde path logic / returns absolute reference to  file location
-  implicitly assume that there is a file and return 

```js
#! /usr/bin/env node
"use strict";
var path = require('path');
var fs = require('fs');

....

 else if (args.file) {
    processFile(path.resolve(args.file));
}

..
function processFile(filepath) {
    // wait around till we get file that readFileSync
    var contents = fs.readFileSync(filepath);
    console.log(contents);
}

```

>  ./ex1.js --file=files/hello.txt
> <Buffer 68 65 6c 6c 6f 0a> 

stringinifation of buffer - console log is trying to process value



we can output in different way 

```js
    process.stdout.write(contents);
```

### 2.4 Asynchronous readFile

- everything that is not a startup should be asynchronous

async form fo readFile expect callback (first param is error param)

-> we will need to catch and chang `toString`



```js
function processFile(filepath) {
    fs.readFile(filepath, function onContents(err, contents) {
        if(err) {
            error(err.toString());
        } else {
            process.stdout.write(contents);
        }
    });
}
```

### 2.5 Processing file contents



standard in - anything inside input stream in buffer that can be passed to other program

1. turn buffer into string 

   

   ```js
   function processFile(filepath) {
       fs.readFile(filepath, function onContents(err, contents) {
           if(err) {
               error(err.toString());
           } else {
               contents = contents.toString().toUpperCase();
               process.stdout.write(contents);
           }
       });
   }
   
   ```

   

it is not efficient - we pull entire data to memory

we need stream of operation !:)

```bash
npm install get-stdin@7.0.0 # specific one
npm install util
```

```js
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in"], 
    string: ["file"]
});
```

- option for 1 hypen

- `getStdin()` - promise return 

  - resolve promise with all contents from standard in 

  `.then().catch()`

```js
else if(args.in || args._.includes("-")) {
    getStdin().then(processDifferentWay).catch(error);
} 
```





```bash
cat files/hello.txt | ./ex1.js --in
cat files/hello.txt | ./ex1.js -
HELLO
```

### 2.6 Env 

```bash
HELLO=WORLD ./ex1.js # set variable for terminal session
```

we are going to use to configure base file path 

if env is path then set otheriwse `__dirname` 

```js
var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
);
```

instead of `path.resolve` - `path.join`

- take any number of inputs
-  use appropriate dir seperator for os platform

```js
else if (args.file) {
    processFile(path.join(BASE_PATH, args.file));
}
```

```bash
BASE_PATH=files/ ./ex1.js --file=hello.txt
```



## 3. Streams

### 3.1 File hanling with Streams

Substack node stream 

there are simplex type of stream (one direction)

- read - readable stream
- write - writable stream

**duplex - write and read both**

take readable and pipe into writable 

pattern : `readable = readable.pipe(writable)`

```js
var readStream;
var writeStream;
var AnotherReadbleStream = readStream
	.pipe(writeStream)
	.pipe(writeStream2)


```



streams are in chunks (64kb each )

chunks reading binary data from readble stream push into write

`pipe` is part of `readable` interface 



modify our file to work with stream instead of file

```js
else if(args.in || args._.includes("-")) {
    processDifferentWay(process.stdin);
} 
else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processDifferentWay(stream);
}
```

method

```js
function processDifferentWay(inStream) {
    var outStream = inStream;
    var targetStream = process.stdout; 
    outStream.pipe(targetStream);

}
```

if we have 1mb of file in memory

we will have ony 64kb anaytime - we read chunk and send out 

### 3.2 Transform steam

```js
var Transform = require("stream").Transform;

...

function processDifferentWay(inStream) {
    var outStream = inStream;
    
    var upperStream = new Transform({
		transform(chunk,encoding,callFinish) {
			this.push(chunk.toString().toUpperCase());
			callFinish();
		}
	});

    outStream = outStream.pipe(upperStream);
    var targetStream = process.stdout;
    outStream.pipe(targetStream);
  
}
```

to proove chunk we can pass delay :

```js
    var upperStream = new Transform({
		transform(chunk,encoding,callFinish) {
			this.push(chunk.toString().toUpperCase());
            setTimeout(callFinish, 500);

		}
	});
```

### 3.3 Outputing a stream to a file  

- writing to a file 
- config if we want to output to standard 

```js
var OUTFILE = path.join(BASE_PATH, "out.txt");
```

```js
...
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out"], 
  
  
```

process file method

```js
   outStream = outStream.pipe(upperStream);
    var targetStream;
    if(args.out) {
        targetStream = process.stdout;
    } else {
        targetStream = fs.createWriteStream(OUTFILE);
    }
    outStream.pipe(targetStream);
```

add to help 

```js
function printHelp() {
    console.log("ex1 usage:");
    console.log("   ex1 usage --file={FILENAME}");
    console.log("");
    console.log("--help             print this help");
    console.log("--file={FILENAME   process the file");
    console.log("--in, -            process stdin");
    console.log("--out              print to stdout"); 
    console.log("");

}
```

### 3.4 Gzip compress with zlib

- gzip algorithm implemented called **zlib**

0. Require

1. add boolean flag - compress and update our help 
2. gziping after capitalization 

gzip protocol was designed for streams 

3. check if we pass in args compress then use `lib.createGzip()`
4. pipe to `outStream` 
5. add `.gz`  extension to `OUTFILE`

```js
var zlib = require("zlib");
...
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out", "compress"], 
  
...
  processDifferentWay(inStream) {
  ....
      outStream = outStream.pipe(upperStream);
    if(args.compress) {
        let gzipStream = zlib.createGzip();
        outStream = outStream.pipe(gzipStream);
        OUTFILE = `${OUTFILE}.gz`;
    }
    var targetStream;
}
```



```bash
./ex2.js --file=files/hello.txt --compress
```

### 3.5 Uncompress with lib

1. add boolean flag - compress and update our help 

2. before transformation - add step for decompressing 

   `zlib.createGunzip`

3. pipe to outsream

```js
function processDifferentWay(inStream) {
    var outStream = inStream;
    if (args.uncompress) {
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream);
    }
```



### 3.6 Determining End of Steam

if we add console log after the stream 

```js
....
else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processDifferentWay(stream);
    console.log("Complete");
}
```

and we call 

```bash
./ex3.js --file=files/hello.txt --out
```

console log first

all streams are asychrnonous

we need to make `processDifferentWay async` to wait  

- it will wait for promise

create function `streamComplete`

- return new Promise that will wait for broadcasted event by steam and call `on("end")`



in the end of our `processDifferentWay` call

`await streamComplete(outStream)`



```js
async function processDifferentWay(inStream) {
  ...
  
     outStream.pipe(targetStream);
    await streamComplete(outStream);

}
  
```

```js
else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processDifferentWay(stream).then(function() {
        console.log("Complete");
    }).catch(error);
}
```

```js
function streamComplete(stream) {
    return new Promise(function callback(res) {
        stream.on("end", res);
    });
}

```

### 
