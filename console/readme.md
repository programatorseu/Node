## 1. Intro

Standard I/O - set of 3 streams that model input and output to a program 

0 - `stdin`

1 - `stdout`

2 - `stderr`



Node use POSIX for working with I/O

`process` -> object that has got connection to our system 

`console.log` - > is not part of JS // it is browser thing

that's why JS is so popular - there are no assumption about environment 

`process.stdout` -> access to standard output. 

-  we call `.write` if we want to have some content to a stream 



```js
process.stdout.write('Helllo Piotrek'); // print without trailing new line 
```

`console.log` - > wrapper around `process.stdout` 

	- it does many other things  making printing more efficient 

**console error & Process stderr**

standard out and standard error -by system are just printed to console.

our file has code `console.log` and `console.error`

```js
console.log('Działki leśne');
console.error('Babie Doły');
```



`/dev/null` -> bit trash

`1>` -> file descriptor 

```bash
node app.js 1>/dev/null # Babie Doły
node app.js 2>/dev/null # Działki Leśne
```





## 2. Command line scripts

in the top `hashbang` symbol to tell interpreter we are dealing with bash scripts 

program from linux distro  : called `env` -> we will pass name of program - it will find wherever is in system

- `/usr/bin/env node` -> says computer to use `env` software 
- we might need to change mode for our file  to put executable : 

```bash
chmod u+x index.js
./index.js # it will run the same 
```

```js
#! /usr/bin/env node
"use strict";
printHelp();
function printHelp() {
    console.log("Usage of our file:")
    console.log("   app.js --help");
    console.log("Print necessary help");
}

```



### 2.1 Command line arguments

```BASH
./app.js --arg=my_first
```

1. access arguments  `process.argv` (array of arguments we passed in )

```js
console.log(process.argv)
```

returned array is : [1. node location / 2. file path / 3. passed argument]

>[
>  '/usr/bin/node',
>  '/home/programators/Desktop/node/app.js',
>  '--arg=my_first'
>]



we are going to slice 

```js
console.log(process.argv.slice(2));
```

use package `minimist` for regex parsing :

- need to require minist (it is function so we pass array we want to parse )

```js
var args = require("minimist")(process.argv.slice(2));
```

returns object 

`_` -> minist do it to overflow anything that minist does not unders

> { _: [], arg: 'my_first' }

```js
./index.js --hello=world
[ '--hello=world' ]
```

**configuration**

- we overwrite default guessing what type of value might be passed there

```js
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help"],
    string: ["file"]
});
```

> ./app.js --arg=my_first
> { _: [], help: false, arg: 'my_first' }
>
> ./app.js --help --arg=my_first
>
> { _: [], help: true, arg: 'my_first' }

### 2.2 Argument handling 



```bash
./index.js --file="hello"
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
} else {
    error("Incorrect usage", true);
}
function error(msg, includeHelp = false) {
    console.error(msg);
    if (includeHelp) {
        console.log("");
        printHelp();
    }
}
// printHelp();
function printHelp() {
    console.log("Usage --file={FILENAME}");
    console.log("   app.js --help");
    console.log("Print necessary help");
}

```

### 2.3 Reading files with PATH & FS modules

- path built-in node 

```js
var path = require('path');
```

`resolve`method 

- hanlde path logic / returns absolute reference to  file location
- implicitly assume that there is a file and return 

`fs` -> file system 

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

>  ./index.js --file=files/hello.txt
>  <Buffer 68 65 6c 6c 6f 0a> 

stringinifation of binary buffer - console log is trying to process value

instead of `console.log` -> we can output in different way 

```js
    process.stdout.write(contents);
```

`console.log` before send already had stringified 

we could pass encoding to tell shell that we want the reall string

### 2.4 Asynchronous readFile

- everything that is not a startup should be asynchronous

async form fo readFile expect callback (first param is error param in node callback)

-> we will need to check if there is an error  and chang `toString`

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

1. turn buffer into string in order to call `upperCase`

   

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

   example 1MB of file we outputting in that way : 

   - 1) pulled in entire megabyte as buffer 
     2) turn entire megabye into a string 
     3) turn entire megabyte into uppercase 
     4) log entire 1MB 

it is not efficient - we pull entire data to memory



### 2.6 Processing Input from stdin 

we need stream of operation !:)

```bash
npm install get-stdin@7.0.0 # specific one
npm install util
```

```js
var getStdin = require('get-stdin');
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in"], 
    string: ["file"]
});
```

- option for 1 hypen

- `getStdin()` - return promise  we need to call `.then` - remember about catching error 

  

```js
else if(args.in || args._.includes("-")) {
    getStdin().then(processDifferentWay).catch(error);
} 

 else if (args.file) {
    fs.readFile(path.resolve(args.file), function onContents(err, contents) {
        if(err) {
            error(err.toString());
        } else {
            processFile(contents.toString());
        }
     });
}

...
function processFile(contents) {
    contents = contents.toUpperCase();
    process.stdout.write(contents);
}
```



```bash
cat files/hello.txt | ./ex1.js --in
cat files/hello.txt | ./ex1.js -
HELLO
```

### 2.6 Environment Variables





```bash
HELLO=WORLD ./app.js # set variable for terminal session
```

```js
if(process.env.HELLO) {}
```



we are going to use to configure base file path 



if env is path then set otheriwse `__dirname` 

```js
var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
);
```

instead of `path.resolve` ---> `path.join`

- take any number of inputs
- use appropriate dir seperator for os platform

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

https://www.npmjs.com/package/stream-handbook

https://frontendmasters.com/courses/networking-streams/

there are **simplex** type of stream (one direction)

- read - readable stream
- write - writable stream (streams in which we can write to them)

**duplex - write and read both**

we want to read from 1 stream and pipe into writeable stream 

we call `.pipe()` on readable stream  only. and we can pass only `writeable` stream 

take readable and pipe into writable 

pattern : `readable = readable.pipe(writable)`

```js
var readStream;
var writeStream;
var stream3 = readStream1.pipe(writeStream);
// steam3 - > is readable stream 


```



streams are in chunks (64kb each )

chunks reading binary data from readble stream push into write

`pipe` is part of `readable` interface 



modify our file to work with stream instead of file

change streategy to more efifcient - **Stream Interface**



on our `fs` module we have metohd that give us : 

- readable stream that is connected to a file 

```js
else if(args.in || args._.includes("-")) {
    processFile(process.stdin);
} 
else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processDifferentWay(stream);
}
```



our method : 

- outStream equals input stream

- we have a target  output stream that we want to send out 
- pipe targetStream to `outStream`

`var targetStream = process.stdout; `



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

to do processes on our stream 

-> we use transform from built-in `stream` module

- with Transform Stream we can step in the middle of stream pipe and item by item we can process through it 

- call it Transform class -- inside `transform` method  with `chunk` and `encoding` and call back to notify is finished 

`chunk` from buffer of course 



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

add `out` flag 

```js
...
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out"], 
  
  
```

in process file process file method

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

steps: 

1. Require
2. add boolean flag - for compress and update our help 

3. gziping after capitalization 

gzip protocol was designed for streams 

3. check if we pass in args `compress` then use `lib.createGzip()`
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
./app.js --file=Hello.txt --compres
```

### 3.5 Uncompress with lib

1. add boolean flag - compress and update our help 

2. before transformation - add step for decompressing 

   `zlib.createGunzip`

3. pipe to outsream

```js
function processFiles(inStream) {
    var outStream = inStream;
    if (args.uncompress) {
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream);
    }
```



### 3.6 Determining End of Steam

with stream  : do whatever you want with stream.

we want to insert `console.log` after process complete 

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
./app.js --file=Hello.txt --out
```

console log first

we need to make `processFile async` function : 

-  it gives us promise 

- it will wait for promise
- we need add `catch` whenever we call `processFile`

```js
async function processFile(inStream) ..
```

```js
    processFile(stream).then(function() {
        console.log("Complete!");
    }).catch(error);
```

we need to hook in to the last stream - we want to know when that stream finishes 

- we are going to listen on stream waiting till sth happen 

create function `streamComplete`

- return new Promise that will wait for broadcasted event by steam and call `on("end")` end event 

call `res` to signal it finishes 



```js
function streamComplete(stream) {
    return new Promise(function c(res){
       stream.on("end", function() {
            res();
       }); 
    });
```



we want to monitor when stream is flushed 

`await` promise completion 
