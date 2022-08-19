# Hard Parts of Servers & Node

### 1. Intro

#### 1.1 Node Overview

-> build apps  embedded systems 

Js does not have access to computer features . so must use `c++` to control them (filesystem etc..)



JS  + C++ combination => Node.js



**JS tasks**

1. saves data and functionality. - **only JS**
2. Use data by running functionality on it  - **only JS**
3. ton of built-in labels that trigger Node features that are built in c++ to use computer's internal - **with Node help**

#### 1.2 Execute JS code vs Node Code 



```js
let num = 3;
function multiplyBy2(inputNumber) {
    const result = inputNumber * 3;
    return result;
}
const output = multiplyBy2(num);
const newOutput = multiplyBy2(10);
```

thread of execution - ability to go line by line 

**global variable environment**

> 1. variable `num` save 3
> 2. declare function `multiplyBy2` with parameter `inputNumber`
>    - declare ==>take function label and body and save for later 
>    - function -> we bundle up all code for later 
> 3. create constant `output` -> unitilized that will be returned value `multiplyBy2(num)` -> pass 3 
>
> **new execution context** 
>
>  - 1. declare `result` that will be output of `inputNumber * 2`
>    1. Return `result`  



#### 1.3 Executing Node Code

- Setup `Node.js` feature to wait for requests for `html/css/js/tweets` 
- `http` module 

**http feature of Node to setup an open socket**

```js
const server = http.createServer()
server.listen()

```

`http.createServer` is a label for node c++ feature that says we  open channel to Internet (socket)

- receive message  - interact with JS 

### 2. Using Node APIS

#### 2.1 Calling Node with JS

```js
const server = http.createServer()
server.listen()
```

`http.createServer()` -> command for internal feature: 

**Node c ++ Feature**

- setup Network 
  - HTTP protocol specialized 

with help of `Libuv` (pre written c++ code) - link code from Node with any computer internal structure (independing of OS) is going to interact with operating system : 

---> **Computer Internals**

+ open socket - ready to receive message 

there are thousands of entry point to our computer -> **ports**



**Our Computer**

==> send request  to web page to get images 



- we use port 80 

`server` -> is label of function-object combo full of pre-defined functions



`sever.listen(80)` -> we setup socket  



Node knows when inbound messag coming -> send data bach

- we trust node that it will auto run -> we need to **wrap with function**



#### 2.2 Calling methods in Node 

2 parts calling a function

- Parantheses at the end - execute its code
- inserted args 

**node auto-runs code for us when request arrives from user**

```js
function doOnIncoming(incomingData, functionsToSetOutgoingData) {
  functionsToSetOutgoingData.end("Welcome to Twitter")
}
const server = http.createServer(doOnIncoming)
server.listen(80)


```

inside `createServer` we pass function that will be auto-run as argument

we pass entire function `doOnIncoming`

1. we do not know when inbound request come
2. JS is a single-threaded -- all slow work (speaking to db) is done by NODE



in case of `multiplyBy2(3)` - argument is 3 and we have inserted it 

Node will auto-run function at right moment

- will automatically insert relevant data as additional parameter 
- it will even insert a set of functions in an object (as an argument)



#### 2.3 Creatig a Server under the hood

```js
function doOnIncoming(incomingData, functionsToSetOutgoingData) {
  functionsToSetOutgoingData.end("Welcome to Twitter");
}
const server = http.createServer(doOnIncoming);
server.listen(80);

```

Incomming message  ==> auto-run  `doOnIncoming` 

- somehow we need have acess to message 

when inbound message from computer --> automatically packed up 2 objects : 

1. Packaged information from inbound message `{url}` - will be created automatically by `node`

   {url, body, header... many more}

2. `functionsToSetOutoingData`second object with many functions and one of them is `end`

`end(input)` -> will be used to add data ro `response` message

`end` -> has connection with node and send message to Node to `http` message 

that message will be sent backk to computer



### 2.4 Server summary

- function that auto-run 
  - auto-insert arguments 
- `end` function - that belong to one of object that will send data to message 

2 objects (JS) are automatically inserted inside 

objects - bundle up with functions 

are linked to auto-cretated message --> we can add text (content, image, html js) by running `end` function on the 2nd auto-created object



### 2.5 Request & Response with Node

message are sent in http format  - **protocol** for browser<->server interaction

http mesage contain : 

- Request (url, metohd)
- headers
- body ('optional')



```js
const tweets = ["Ania", "hej", "Basia", "Rysiek"]

function doOnIncoming(incomingData, functionsToSetOutgoingData) {
    const tweetsNeeded= incomingData.url.slice(8)-1
    functionsToSetOutgoingData.end(tweetsNeeded)
}
const server = http.createServer(doOnIncoming)
server.listen(80)
```



Anias' PC is sending message : 

`twitter.com/tweets/3` --> http message :

- request line : `GET /tweets/3`
- headers: meta data about Ania PC computer ( browser type, location .. )





we have hundred pages - we do not need to write many if  ==> `express` we can use 



### 3. Node with HTTP

#### 3.1 Preparing for HTTPrequestObject

JS trigger code written in `c++` (node C++ features) - to control computer internal features (networking, filesystem..)

```js
const tweets = ["Ania", "hej", "Basia", "Rysiek"]

function doOnIncoming(incomingData, functionsToSetOutgoingData) {
    const tweetsNeeded= incomingData.url.slice(8)-1
    functionsToSetOutgoingData.end(tweetsNeeded)
}
const server = http.createServer(doOnIncoming)
server.listen(80)
```

> 1. declare const tweets with array - saved in memory
>
> 2. function declaration `doOnIncoming` - we do not run it
>
> 3. create const `server` unitiliazed is gonna be output of calling `createServer` and passing `doOnIncoming`
>
>    `http.createServer` do 3 things : 
>
>    - 1. setup in c++ instance of http feature (network connection) 
>
>         => open channel to internet - called **socket**
>
>      2. store function for auto-run when **incoming message** come
>
>      3. in JS server -> get `server` object that has bunch of function included to edit backgkround feature - like for example edit port
>
> 4. `server.listen` -> use it built-in function to edit port 



#### 3.2 Parsing HTTPRequestObject

Anias' PC opens url which is automatically sending message : 

`twitter.com/tweets/3` --> http message :

- request line : `GET /tweets/3`
- headers: meta data about Ania PC computer ( browser type, location .. )

it arrives into node with message 

{GET /tweets/3, Headers}



Mean while response message is going to be prepared (**outbound message** or **http response message**)

2 objects will be created by node : 

**auto-created data ** === **arguments**

1. {url: /tweets/3, method: GET}

2. {end:} - it will stick data on **http response message**



#### 3.3 Parsing HTTPRequestObject

`doOnIncoming`

> **new execution context**
>
> 1. two parameters assign 2 auto-created object  - we will give them name
>
>    `incomingData` :  {url: /tweets/3, method: GET}
>
>    `functionsToSetOutgoingData` :  {end:}
>
> 2. `tweetNeeded` = number 2 index
>
> 3. `end`  - pass position of array of index number 2 and sent back to us 



data come as chunk of data

#### 3.4 Response Headers

response message is in http format 

- has got header content-type with format of file we are going to send back 





#### 3.5 Require in Node 

- we have to tell Node we want to have access to each of its c++ feature independently 
- `require` feature



```js
const http = require('http');
```

http - will be object full of functinos like `createServer`



### 3.6 Js node Development

1. create file and save as index.js 
2. From terminal `node server.js`
3. `nodemon` if we want to run node js after we did update without reloading code 



#### 3.7 Cloud Node Development

- rent server 
- ASW / Google cloud / Microsoft Azure



1.write code / 2. ssh into someone else computer (ASW) / 3. setup DNS to mach domain name to right IP 

DNS - connect  url domain and ip 

we open computer ===> go to Twitter.com.



### 4. Events & Error Handling

#### 4.1 Error handling in node 

- there is risk of plenty errors because we interact with other computerse over internet



message might be corrupt  => we want to send other function when error happened 

when inbound message come == inside node big shoutout | broadcast | emitted inside NODE : 

`request` 

we can setup manually: 

```js
function doOnIncoming(incomingData, functionsToSetOutgoingData) {
    functionsToSetOutgoingData.end("Welcome to Twitter");
}
function doOnError(infoOnError) {
  console.error(infoOnError);
}
const server = http.createServer();
server.listen(80)
server.on('request', doOnIncoming)
server.on('clientError', doOnError);
```

Node is going to broadcast message that has attached function node will auto-run 





> **twitter computer **
>
> declare function `doOnIncoming` & `doOnError`
>
> 2. Declare `server`  = wiill be result of calling ` http.createServer();`
>
>    Will be object full of methods . One of them is `listen` method and `on` 
>
>    we can modify http instance with those methods 
>
> 3. server.listen(80) - set port in node
>
> 4. `server.on('request', doOnIncoming)` - set up in node
>
> 5. `server.on('clientError', doOnError);`





> **Piotr's computer**



> **computer Internal features**

> ​	 *2) Networking --> open socket ( send - receive data back)
>
> ​	*3) port is set to 80

> **Node c++ features**
>
> *2) `http` network is called  --> open sockect 
>
> *3) port of http is set to 80
>
> <u>Auto-run functions</u>
>
> *4) if we have keyword 'request' run `doOnIncoming`
>
> *5) if we have 'clientError' - please run `doOnError`
>
> 
>
> we hit url -->> send corrupted HTTP request in some way  - `clientError` appear 
>
> trigger `doOnError` 
>
> **auto-inserted data**  - `Error` object {} --- will be passed to `doOnError` method





### 5. File System

#### 5.1 Intro the File System API

- twitters are stored in huge file saved in computer

charceter in Twitter is 1 byte (8 x 0 and 1 = 256 combinations)

1mb takes 1ms 



#### 5.2 Importing with fs

- every file has a `path`  like url.
- position in folder 

`./tweets.json`  --> current directory - when `node is run`

`json` -> javascript-ready datad format 



```json
{
  "tweet1": "yo",
  "tweet2": "Hi"
}
```

`JSON.parse` take string and convert into sth that object can work with 

```js
function cleanTweets(tweetsToClean) {
  	// code to remove bad tweets
}
function useImportedTweets(errorData, data) {
  const cleanedTweetsJson = cleanTweets(data);
  const tweetsObj = JSON.parse(cleanedTweetsJson);
  console.log(tweetsObj);
}
fs.readFile('./tweets.json', useImportedTweets);
```



LibUv allow us to interact with FileSystem through Node 

> 1. declare `cleanTweets` function
> 2. declare `usedImportedTweets` function 
> 3. `fs.readFile`  - node c++ feature is going to be brought  (location, function auto-run)

 - location - current folder when we run `node`

it is really slow task 

`useImportedTweets`

> **new context**
>
> Json.parse -> convert perfectly formated JSON file 
>
> 1. args to paramterers:  
>
> errorData : null / data: tweets
>
> 2. const `cleanedTweetsJson` = call cleantTweets



### 6. Streams

Event ( message - broadcasting) system  - send message (event) each time a sufficient batch of json data had been loaded in 

- auto-run function that start cleaning batch of data  - store it / the same time - node is pushing other batch of data 

Data in chunks - auto trigger function 

```js
let cleandtweets = "";
function cleanTweets(tweetsToClean) {
  
}
function doNewBatch(data) {
  cleanedTweets = cleandtweets(data);
}
const accessTweetsArchive = fs.createReadStream('./tweetsArchive.json')
accessTweetsArchive.on('data', doNewBatch);
```



default batch size is 64kb 

stream -- chunks of data  - **not constant flow of data ! **

buckets of water (each 64kb )



### 6.1 Setting up the Stream

```js
let cleandtweets = "";
function cleanTweets(tweetsToClean) {
  
}
function doOnNewBatch(data) {
  cleanedTweets = cleanTweets(data);
}
const accessTweetsArchive = fs.createReadStream('./tweetsArchive.json')
accessTweetsArchive.on('data', doOnNewBatch);
```

> 1. declare variable cleanedTweets
> 2. declare cleanTweets function 
> 3. declare funcion doNewBatch
> 4. declare const `accessTweetsArchive` which is unitilized at the beginning 
>    - we are going to use node c++ feature called `fs` 
>    - Pass `./tweetsArchive` 
>    - in Node it tells file system to load that file (setup dedicated thread to start pulling data)
>    - in JS return object full of functions, methods
> 5. `accessTweetsArchive.on('data', doNewBatch);` auto-run function that will be fired every received batch on event `data`  



### 6.2 Processing Data in Batches 

- first batch arrived - data event will be called - `doOnNewBatch`  is going to be called 

> **new execution context**
>
> - `data` : assign with json 
>
> - call `cleanTweets` and return to global

while is cleaning enxt 64kb of batch arrive 

auto-function`doOnNewBatch`  automatically call `cleanTweets` and in 3/4 of cleaning :

--> another batch of data came and auto-run function 

with Node and libuv library  - JS set up **queue**

function passed into another function - **call back** to JS  - **callback queue**  -- here it will wait in queue while we continue running code 



**call stack**

cleanTweets()

doOnNewBatch()

Global()



Pop all from call stack 

### 6.3 Checking the callback queue

1) if there is anmy code sitting or running on call stack ?
2) if there is any code in global ? 

: both answer no -> **start checking queues**

**event loop**  - node with help of libuv checkes queue(s) and determines what function / code to run 



=> grab new `doOnNewBatch` - put into **call stack**

> executed - input is next bunch  clean data and move on to the next batch 

node uses event system to auto run function on batch of data 

functions needs to be queued up 

import data - clean it - import - clean it 



we can break any inbound of data into chunks and run function on it

JS has thread

Libuv has bg thread







### 7. Asynchronicity in Node

```js
function useImportedtweets(errorData, data){
  const tweets = JSON.parse(data)
  console.log(tweets.tweet1)
}
function immediately() {
  console.log("Run me last ")
}
function printHello() {
  console.log("Hello")
}
function blockFor500ms(){
// Block JS thread DIRECTLY for 500 ms
// With e.g. a for loop with 5m elements
}
setTimeout(printHello,0)
fs.readFile('./tweets.json', useImportedtweets)
blockFor500ms()
console.log("Me first")
setImmediate(immediately)

```

**call stack** - JS keep track of what function is being run  - will be at the top of call stack 

**event loop**- determines what function to run next from queues

**callback queue** - any func delayed from rrunning (and run by NODE automatically)



each function behave differently - added to different queues

`setImmediate` - set automatically to specific queue





### 7.1 Timer Queue & IO Queue & check queue

> 1. declare functions : 4 functions : `userImportedTweets... blockFor500ms`
>
> 2. `setTimeout` -> call set Timer for 0 ms ( it is not JS feature - Node C++ featuer with Libuv help)
>
>    consequence in node   => printHello auto-run
>
>    status at 0ms -> complete => will not be put into **call stack ** - it goes to **Timer Queue**
>
> 3. 1ms later run `fs.readFile` - pass path to file and what function auto-run  `useImportedTweets`
>
>    in node set up FS with help with libuv  & setup background thread to handle data comming in 
>
> 4. 2ms blocking for 500ms - > push to call stack `blockFor500ms`
>
> 5. at 200ms data come back in `fs.readFile`- -- > `userImportedTweets` is going to run  (ErrorData, Data) passed to auto-run function 
>
> **Event loop does not allow to run ** 
>
> `userImportedTweets` - goes to **IO Queue** (most of auto-run function goes there)
>
> 6. at 500ms blockFor500ms stops running but **event loop** still does not go there - still more code to run
> 7. at 502ms `console.log`
> 8. at 503ms ==> Third prioritized queue - **check queue** - `setImmediate` put function to that queue :):) 
>
> - we make sure IO has done - we want to make sure that are finished we can use `setImmediate` to put function in the last queue

 

no global code left , call stack is empty

**event loop** goes to check queue 

1. Timer 

> 9. at 504 ms `printHello` (add to call stack)

2. IO queue - next queue checked by Event Loop 

> 10. at 505 auto run `userImportedTweets` - is executed by Node  (add  to callStack)

3. Check Queue - 

> 11. at 506 `setImmediate`  (`immediately` added to call stack )





