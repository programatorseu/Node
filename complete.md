### 7.3 Http request
What is API ? 
-> application programming interface 
-> specify how 2 applications can talk to each other 

we use methods that we can use on different collections of data 
`GET /friends`
`GET /friends/5`
`POST /friends/`
`PUT /friends/5`
`DELETE /friends/5`

Http requets consist of : 
 - method (POST,..)
 - path (/messages)
 - body (contains data we are sending from browser to server) 
   + json format {text: "hello", photo: "img.jpg"}
 - HEADERS (optional properties in which we can pass meta data about our request we can send )
**host heaader must be specified** to verify we are sending message to write server 

**HTTP responses**
 - headers : content-type (application/json) --> type of data
 - body: data we are fetching from server
 - status code : tells whether request was successfull 
 

 ### 7.4 First Web Server
 req -> our readable stream
 res -> writable stream 
 ```js
const http = require('http');
const PORT = 4000;
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type' : 'text/plain'
    });
    res.end('Hello from server');
});
server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})
 ```

we can pass json as well :
```js
    res.writeHead(200, {
        'Content-Type' : 'application/json'
    });
    res.end(JSON.stringify({
        id: 1,
        name: "Rysiek Sad"
    }));
```
### 7.5 HTTP APIs and Routing
```js
const http = require('http');
const PORT = 4000;
const server = http.createServer((req, res) => {
    if(req.url === '/friends') {
        res.writeHead(200, {
            'Content-Type' : 'application/json'
        });
        res.end(JSON.stringify({
            id: 1,
            name: "Rysiek Sad"
        }));
    } else if(req.url === '/messages') {
       res.setHeader('Content-Type', 'text/html');
       res.write('<html>');
       res.write('<body>');
       res.write('<ul>');
       res.write('<li>Hello Piotrek</li>');
       res.write('</ul>');
       res.write('</body>');
       res.write('</html>');
       res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
});
server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})

```
### 7.6 Parameterized URL
`req.url.split('/')` 
> /friends/2 => ['', friendsm 2]
```js
const http = require('http');
const PORT = 4000;
const server = http.createServer();
const friends = [
    {
        id: 1,
        name: "Rysiu"
    },
    {
        id: 2,
        name: "Basia"
    },
    {
        id: 3,
        name: "Ania"
    }

];
server.on('request', (req, res) => {
    const items = req.url.split('/');
    
    if(items[1] === 'friends') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if(items.length === 3) {
            const index = Number(items[2]);
            res.end(JSON.stringify(friends[index]));
        } else {
            res.end(JSON.stringify(friends));
        }
    } else if(items[1] === 'messages') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<body>');
        res.write('<ul>');
        res.write('<li>Hello Piotrek</li>');
        res.write('</ul>');
        res.write('</body>');
        res.write('</html>');
        res.end();
     }  else {
        res.statusCode = 404;
        res.end();
      }
});

server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})
```
### 7.7 Same Origin Policy

What is Origin ? 
- combination of (protocol / host / port(included or not))
- browser assume in case of https that we are using `443` port
https://programatory.com:443/product

browser and JS uses same origin policy 
- security feature that restrict what our browser is able to load 
JS code on our computer may request 2 seperate processes 
google can not get data our friends from facebook ! - will be denied by browser 

we can allow post data from 1 orign to 2nd origin (2nd is responsible to ignore or process request)

if we try to fetch data from google web console:  :
`window.fetch('https://en.wikipedia.org')`; // cross-origin request

### 7.8 CORS (cross-origin-resource sharing)
relax restrictions 
normally we can talk only with 1 origin 
-> set header to specify what resources could be shared beyond same origin file exists on 
-> controlled by server who owns data 
`Access-Control-Allow-Origin: https://www.google.com`
`Allow-Origin: *` 
WhiteListing - allow acess particular privilege or service 

### 7.9 Posting Data to Server
https://www.udemy.com/course/complete-nodejs-developer-zero-to-mastery/learn/lecture/26191438#content

in node in console we can
`fetch` function exepcts string not an object
```js
fetch('http://localhost:4000/friends', {
  method: 'POST', 
  body: JSON.stringify({id: 4, name: "Ania Sadowska"})
})
```
request - readable stream
res - writable stream
```js
const http = require('http');

const PORT = 3000;

const server = http.createServer();

const friends = [
  {
    id: 0,
    name: 'Piotr',
  },
  {
    id: 1,
    name: 'Ania',
  },
  {
    id: 2,
    name: 'Basia',
  }
];

server.on('request', (req, res) => {
  const items = req.url.split('/');
  // /friends/2 => ['', 'friends', '2']
  if (req.method === 'POST' && items[1] === 'friends') {
    req.on('data', (data) => {
      const friend = data.toString();
    //   console.log(friend);
      console.log('Request:', friend);
      friends.push(JSON.parse(friend));
    });
    req.pipe(res);
  } else if (req.method === 'GET' && items[1] === 'friends') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (items.length === 3) {
      const friendIndex = Number(items[2]);
      res.end(JSON.stringify(friends[friendIndex]));
    } else {
      res.end(JSON.stringify(friends));
    }
  } else if (req.method === 'GET' && items[1] === 'messages') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<body>');
    res.write('<ul>');
    res.write('<li>Hello Isaac!</li>');
    res.write('<li>What are your thoughts on astronomy?</li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
}); //127.0.0.1 => localhost

```


# Express

### Why Express ?? 
-> one of the most popular frameworks
-> handle different scenarios 

### Intro to Express
```js
const express = require('express');
const app = express();
const PORT = 3000;
app.get('/msg', (req, res) => {
    res.send('<ul><li>Piotrek</li></ul>');
});
app.post('/msg', (req, res) => {
    console.log('Updating messages');
});
app.listen(PORT, () => {
    console.log(`Running server on ${PORT}..`);
})
```

### Express vs Next.js vs Koa

- high performant
- tested
- minimal built that can be extended by middleware 
    - we can use middleware to 
    - the same company build loop back4 (based on typescript)



Koa : 
  - promised based controll (without call back )
  - coall bundle request and response into context object 

 - relien on async js feature


Next.js 
-> framework for React (server)
-> next is used by github or netflix 
-> performance (server-side rendering )

### Route Parameters

```js
const friends = [
    {
        id: 0,
        name: "Piotrek S"
    },
    {
        id: 1,
        name: "Ania T"
    }
];
app.get('/friends', (req, res) => {
    res.send(friends)
});
```

install nodemon inside development : 
```bash
npm install nodemon --save-dev
```

### middleware
Req --> Express API --> Response 

Req-> middleware (1)
req + res + next 
middleware(1) -> next() ->  middleware(2) 
req + res + next
middleware(2) -> middleware(Endpoint)
`app.METHOD` 

### Writing own middleware
