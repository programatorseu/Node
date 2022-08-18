# Server API with express
```bash
npm install express body-parser morgan
```
- `express` - a framework for building servers
- `body-parser` - a middleware that parses incoming requests
- `morgan` = a middleware for logging incoming requests


**steps**

1. app for express
2. set middleware -> 2 parser for urlencoded and json 
3. set type of login with morgan 
4. imitate db 
5. set route for `post` method (request, responsea args)
   1. Create task
   2. push to `newTodo`
   3. response `json`
6. route for `get` method
7. Listen for server - pass port and callback 
