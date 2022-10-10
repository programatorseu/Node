# Node JS 

an open-source, server-side JavaScript runtime environment
Node - wrapper around JS engine called V8

*  can use Node.js to run JavaScript by using the V8 engine outside of a browser

 Node.js adds a `Buffer` class that allows V8 to work with files. 
 This feature makes Node.js a good choice for building something like a web server.

MongoDB also use JavaScript and JSON as a format for queries and schemas. Node.js uses the same language and technologies that many modern services and frameworks use.


## 2. How NodeJS Works

Node.js JS - wrapper around JavaScript engine called V8. 

Node.js can interpert and run code on host machine outside browser  -- runtime has direct access to the operating system I/O, file system and networ

Node.js is based on a single-threaded event loop. 

​    This architecture model efficiently handles concurrent operations.
​    Concurrency means multiple computations are happening at the same time
​    - here means the ability of the event loop to perform JavaScript callback functions after completing other work.

 Single-threaded : Js has 1 only call stack and can only do 1 thing at time
 Event Loop: run code , collects, process events and runs next subtask in event queue   

*Thread* - single sequence of programmed instructions 

 In Node.JS I/O operations (reading - writing file, network)
  --  A blocking operation blocks all subsequent tasks until the operation is finished before the next operation can proceed. In a non-blocking model, the event loop can run multiple I/O operations at the same time.

  ## 2.1 Node JS architecture

Event Loop -   makes it possible for Node.js to handle concurrent operations

**Worker Pool**  - handle blocking tasks like blocking I/O operations and CPU-intensive tasks.

Timers - callbacks schedules by `setTimeout` and `setInterval`

Callbacks - runs pending callbacks.

**Poll** retrieves incoming I/O events and runs I/O-related callbacks.

**Check** allows callbacks to be run immediately after the poll phase is completed.

**Close callbacks** closes events (for example, `socket.destroy()`)



![image-20221007104616735](/home/programators/.var/app/io.typora.Typora/config/Typora/typora-user-images/image-20221007104616735.png)



**asynchronous programming **

Node.js has a built-in set of non-blocking I/O APIs - provided by `libuv` library

example : 

> 1. read file content from a disk
> 2. Node.js does not block waiting fro disk and file descriptors to be ready 
> 3. non-blocking I/O interface notifies Node.js when file is ready 





### 2.2. Why we need Node JS

- run JS applications and code on server (outside borwser)
- Node.js is a single-threaded non-blocking runtime based on the event-driven I/O paradigm



## 3. Project

`npm init -y`

create /src/index.js

script

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node ./src/index.js"
  },
```

### 3.1 Add package

NPM - Node Package Manager

 A dependency is a third-party library, a piece of reusable code that  accomplishes something and can be added to your application.



**production vs development dependencies **

- production : need to run when your application is in production. A production  dependency must be built into your application so the functionality is  available when the application is running.

- development : only for develping (librarires, linting )



 **how to install a package**

`npm install <dependency>` --> part of our app

 `npm install <dependency> --save-dev`  --> means not to be shpped to production 

`npm install -g`  -> install globally

`npx` tool --> will fetch the dependency, run the command, and clean up.



```bash
npm list --depth=<depth>
```

the larger the bundle is, the longer it takes to send over the network  before it becomes something customers can interact with. The longer  customers have to wait, the more likely they might avoid using an app.



uninstall :

 ```bash
npm uninstall <name of> # remove from manifest file & node_modules folder
npm prune #  removes all dependencies in the node_modules folder that aren't listed as dependencies in the manifest file.
 ```



```bash
npm install jest --save-dev
```



add script

```json
  "scripts": {
    "test": "jest",
```

create `__tests__/address-parser.js`



### 3.2 Update dependency 

| Major version | 1.0.0 changes to **2**.0.0 |
| ------------- | -------------------------- |
| Minor version | 1.2.9 changes to 1.**3**.0 |
| Patch version | 1.0.7 changes to 1.0.**8** |

```
npm update <name of package>@<optional argument with version number>
```

**configure package.json for update**

`~1.0.0` -> patch

`^1.0.0` -> minor

`*1.0.0`--> major



`package-lock.json` - generated when we do sth that modifies `node_modules`

```js
npm outdated
npm update
npm install node-fetch@latest lodash@latest
```



## 4. Debugging

#### 4.1 What's a debugger? 

tool used to observer and control execution flow or program with analytical approach

goal is to help find the root cause of a bug and help you resolve it. 



**debugging process**

1. identify a bug in program
2. find where bug is located in code
3. analyze why bug occurs
4. fix bug
5. validated if fix work ?

```js
function addToBasket(product) {
    // Use "debugger" statement to pause at start of this function
    debugger;
  
    const basket = getCurrentBasket();
    basket.add(product);
  }

```





```js
node inspect <YOUR_SCRIPT>.js
```



## 5. File System

`fs` module - built-in module for working with file system



The *fs* module has a `promises` namespace that has promise versions of all methods.

- we can use `async`

```js
const fs = require('fs');
fs.promises.readdir("stores")
    .then(files => {
        for(let file of files) {
            console.log(file);
        }
    });
```

**determine content type**

```js
fs.promises.readdir("stores", {withFileTypes: true})
```



>Dirent { name: 'incl', [Symbol(type)]: 2 }
>Dirent { name: 'sales.json', [Symbol(type)]: 1 }
>Dirent { name: 'store.txt', [Symbol(type)]: 1 }

```js
    for(let file of files) {
            const type = file.isDirectory() ? "folder" : "file";
            console.log(`${file.name} : ${type}`);
        }
```

> incl : folder
> sales.json : file
> store.txt : file

if we have folder inside foolder 

you can search nested directory structures by having a method that finds folders and then calls itself to find folders inside those folders 



we have tree directory:

stores/sales.json

stores/incl/sales.json

```js
const fs = require("fs");

async function findSalesFiles(folderName) {
  // this array will hold sales files as they are found
  let salesFiles = [];
  async function findFiles(folderName) {
    const items = await fs.readdirSync(folderName, { withFileTypes: true });

    for (item of items) {
      if (item.isDirectory()) {
        // search this directory for files (this is recursion!)
        await findFiles(`${folderName}/${item.name}`);
      } else {
        if (item.name === "sales.json") {
          salesFiles.push(`${folderName}/${item.name}`);
        }
      }
    }
  }
  await findFiles(folderName);
  // return the array of found file paths
  return salesFiles;
}

async function main() {
  const salesFiles = await findSalesFiles("stores");
  console.log(salesFiles);
}

main();
```

### 5.2 Work with file paths 

constant

```js
console.log(__dirname);
```



> /home/programators/Desktop/NodeV

 Node.js includes a module called *path* specifically for working with paths.

```js
const path = require("path");
```

concept is that paths are just strings

```js
console.log(path.join("stores", "201")); // stores/201
```

path module will always format paths correctly for whatever operating system it's running 

```js
const path = require("path");
console.log(path.extname("sales.json"));
// .json
```

`parse` method to get as many information we need 

```js
console.log(path.parse("stores/201/sales.json"));
// { root: '', dir: 'stores/201', base: 'sales.json', ext: '.json', name: 'sales' }
```

```js
async function main() {
  const salesDir = path.join(__dirname, "stores");
  const salesFiles = await findSalesFiles(salesDir);
  console.log(salesFiles);
}
```

change the `findFiles` method to use `path.join`.

```js
const fs = require("fs");
const path = require('path');

async function findSalesFiles(folderName) {
  // this array will hold sales files as they are found
  let salesFiles = [];
  async function findFiles(folderName) {
    const items = await fs.readdirSync(folderName, { withFileTypes: true });

    for (item of items) {
      if (item.isDirectory()) {
        // search this directory for files (this is recursion!)
        await findFiles(path.join(folderName, item.name));
      } else {
        if (path.extname(item.name) === ".json") {
            // store the file path in the salesFiles array
            salesFiles.push(path.join(folderName, item.name));
          }
      }
    }
  }
  await findFiles(folderName);
  // return the array of found file paths
  return salesFiles;
}

async function main() {
  const salesDir = path.join(__dirname, "stores");
  const salesFiles = await findSalesFiles(salesDir);
  console.log(salesFiles);
}

main();
```



### 5.3 Create Files and directories

```js
const fs = require("fs").promises;
const path = require("path");

fs.mkdir(path.join(__dirname, "stores", "201", "newDir"));
// 201 must exist

// pass optional recursive
fs.mkdir(path.join(__dirname, "stores", "201", "newDir"), {
    recursive: true
});
```



```js
fs.writeFile(path.join(__dirname, "greeting.txt", String()));
```



The *fs* module in Node.js lets you create new files and directories programmatically.



```js
const fs = require("fs").promises;
const path = require("path");

async function findSalesFiles(folderName) {
  // this array will hold sales files as they are found
  let salesFiles = [];

  async function findFiles(folderName) {
    // read all the items in the current folder
    const items = await fs.readdir(folderName, { withFileTypes: true });

    // iterate over each found item
    for (item of items) {
      // if the item is a directory, it will need to be searched
      if (item.isDirectory()) {
        // call this method recursively, appending the folder name to make a new path
        await findFiles(path.join(folderName, item.name));
      } else {
        // Make sure the discovered file is a .json file
        if (path.extname(item.name) === ".json") {
          // store the file path in the salesFiles array
          salesFiles.push(path.join(folderName, item.name));
        }
      }
    }
  }

  await findFiles(folderName);

  return salesFiles;
}

async function main() {
  const salesDir = path.join(__dirname, "stores");
  const salesTotalsDir = path.join(__dirname, "salesTotals");

  // create the salesTotal directory if it doesn't exist
  try {
    await fs.mkdir(salesTotalsDir);
  } catch {
    console.log(`${salesTotalsDir} already exists.`);
  }

  // find paths to all the sales files
  const salesFiles = await findSalesFiles(salesDir);

  // write the total to the "totals.txt" file
  await fs.writeFile(path.join(salesTotalsDir, "totals.txt"), String());
  console.log(`Wrote sales totals to ${salesTotalsDir}`);
}

main();
```

### 5.4 Read data from files

we have file 

> ```
> {
>   "total": 22385.32
> }
> ```

```js
console.log(await fs.readFile("stores/201/sales.json"));
// <Buffer 7b 0a 20 20 22 74 6f 74 61 6c 22 3a 20 32 32 33 38 35 2e 33 32 0a 7d>

```

parse data

```js
const data = JSON.parse(await fs.readFile("stores/201/sales.json"));
console.log(data.total);
```

`writeFile` method. By default, the flag is set to `w`, which means "replace the file." 

- To append to the file instead, pass the `a` flag, which means "append."

## 6. Express

**http module in Node.js** 

`http.Server` Represents an instance of an HTTP Server.  - listen to different events on a  specific port and address.



1. **Create the server**: The `createServer()` method creates an instance of the `http.Server` class.

2 . The `createServer()` method expects a function known as a *callback*. 

​	When the callback is invoked, we supply the method with instances of the `http.IncomingMessage` and 	 	`http.ServerResponse` classes. In this example, we supply the `req` and `res` instances:

- a) **Client request**: The `req` object investigates which headers and data were sent in the client's request.
- b) **Server response**: The server constructs a response by telling the `res` object the data and response headers it should answer back with.



3. **Start listening to requests**: The `listen()` method is invoked with a specified port. After the call to the `listen()` method, the server is ready to accept client requests.

```js
const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('hello text');
});
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
```

### 6.1 Streams

Streams define the way data is transported back and forth. Data is sent, chunk by chunk, from client to server and from server to client.  

Streams make the server capable of handling many concurrent requests.

A stream is a fundamental data structure in Node.js that can read and write data, and send and receive messages, or *events*. Streaming is implemented in the HTTP module by having classes that are streams.



In our example, the `req` and `res` parameters are streams. Use the `on()` method to listen to incoming data from a client request like this:

```js
req.on('data', (chunk) => {
  console.log('You received a chunk of data', chunk)
})
```

Use the `end()` method for data sent back to the client in the `res` object response stream:

```js
res.end('some data')
```



### 6.2 new Express web app :

```js
npm init -y
npm install express
```



The code creates an instance of an Express application by invoking the `express()` method.

```js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/products", (req,res) => {
   const products = [
     {
       id: 1,
       name: "hammer",
     },
     {
       id: 2,
       name: "screwdriver",
     },
     ,
     {
       id: 3,
       name: "wrench",
     },
   ];

  res.json(products);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

### 6.3 Manage a request lifecycle with middleware

handing request as series of steps

- 1. invesitgate whether user sent proper credentials through request header / if verified - send request to the next step
  2. construct response : talk to data source - returns resource 
  3. post request - piece of code after request is handled



To run a pre or post request, implement the `use()` method on your Express instantiated object

 A `pre` or `post` request in Express is known as a *middleware*, and has the following syntax form:

```js
app.use((req, res, next) => {})
```

`req`- incoming request that contains headers and calling URL + body of data 

`res` - response stream (header + data we want to send calling client)

`next`: A parameter that signals the request is OK and is ready to be processed. If the `next()` parameter isn't called, processing of the request stops

```js
app.use((req, res, next) => {
  // Pre request
})
app.get('/protected-resource', () => {
  // Handle the actual request
})
app.use((req, res, next) => {
  // Post request
})

app.get('/login', () => {})
```

