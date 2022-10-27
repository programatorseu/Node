## 1 . Modules

 Node.js uses modules to to share your JavaScript with other JavaScript in your apps

**module**

- chunk of code that has its own context. 

`export` keyword before the variable declartion. This creates a named export.

 You also have to prefix your path with a `'./'`. If you don' - - Node will think you're trying to import a built in module or npm module

-> remember about setting in package.json uppercase

```js
export const text = () => {

}
export const upper = (name) => {
    console.log(name);
}
```

```js
import {text, upper} from './utils.js';

upper('Piotrek');
```

 if you only have to expose one bit of code, you should use the `default` keyword

```js
// utils.js
export default function() {
    console.log('did action')
  }

```

then to import 

```js
import piotrek from './utils.js';
```

## 2. FileSystem

simple template file with placeholders for {title} and {body}

To read a file, we'll use the `readFile` method.



```js
import { readFile } from 'fs/promises'

let template =  await readFile(new URL('./template.html', import.meta.url), 'utf-8');
console.log(template); // we got <html lang="en"> file

```

* write a file 

`import.meta` returns :

>[Object: null prototype] {
>  url: 'file:///home/programators/Desktop/node/app.js'
>}



```js
import { readFile, writeFile } from 'fs/promises'

let template = await readFile(new URL('./template.html', import.meta.url), 'utf-8')

const data = {
  title: 'Piotre file',
  body: 'Node entry'
}

for (const [key, val] of Object.entries(data)) {
  template = template.replace(`{${key}}`, val)
}

await writeFile(new URL('./index.html', import.meta.url), template)

```

### 3. Error Handling

- **process exiting**

  `process.exit(1)`

exit with a code of `1`. This effectively errors out and stops your programing completely

**async errors**

dealing with callbacks that are used for async operations, the standard pattern is:

```js
fs.readFile(filePath, (error, result) => {
  if (error) {
    // do something
  } else {
    // yaaay
  }
})
```

## 4. Cli

command line interface  - program designed to start and complete task.

**shabang or hashbang**. --> tell the machine where the interpreter is located that is needed to execute this file. For us ==> Node.js. 



our cli.js  file: 

```bash
#! /usr/bin/env node

console.log('hello from your CLI')
```

update package.json :

```json
  "bin": {
    "reddit" : "./cli.js"
  },
```



we must install our own package locally so we can test out the CLI. 

```bash
npm install -g
```

**install few packages**

```bash
npm install open node-fetch yargs --save
```

`yargs` - will allow us to process any flags or arguments passed to the CLI

`open` - open browser with URL

`node-fetch` -  fetch client that will hit API

```js
#! /usr/bin/env node
// import our packages
import open from 'open'
import fetch from 'node-fetch'
import yargs from 'yargs'
// parse env vars
const { argv } = yargs(process.argv)
// init fetch to reddit api
const res = await fetch('https://www.reddit.com/.json')
const data = await res.json()
console.log(data.dat);

// const randomIndex = Math.floor(Math.random() * data.data.children.length)
// const post = data.data.children[randomIndex]

// if (argv.print) {
//   console.log(`
//     Title: ${post.data.title}\n
//     Link: ${post.data.permalink}
//   `)
// } else {
//   open(`https://reddit.com${post.data.permalink}`)
// }
```

### 5. Servers 

node has : 

- access to OS level functionaliy (networking)

node is:

- single threaded and runs even loop for async tasks. -- used for API's that need to respond fast and do not require heavy CPU intensive work. 

```js
import http from 'http'
const host = 'localhost'
const port = 8080

const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end('hello from my server')
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
```

**express **- framework  || 

`body-parser` -> middleware that parses incoming requests || 

`morgan` -->  middleware for logging incoming requests



