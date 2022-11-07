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
