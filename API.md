# API 

## 1.1 MongoDB 

MongoDB problem on Ubuntu

 22.10 doesn't have official MongoDB packages yet, so the best  option now is to have Ubuntu 20.04, where official MongoDB packages are  availab



```bash
wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb

sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb

sudo apt-get install -y mongodb-org

#temp solution 
sudo rm -rf /tmp/mongodb-27017.sock
sudo service mongod start
mongosh
```



```sql
show dbs;  
use todos; # create database
show collections # like tables in sql 
db.createCollection('items')

```

compass - gui app 

easier to get started without foreign keys 

it is very flexible  - built with JS (even-driven architecture)



### 1.1.1 Schemans & Mongoose

schemas only for validation - we should use schemas 

Moongoes for ORM (Object Relational Mapper)`

### 1.1.2 Connecting to the Database

protocol://hostname:port

default port of mongodb `27017`

connect(protocol)

```js
const connect = () => {
    return mongoose.connect('mongodb://localhost:27017/whatever')
}
```



### 1.1.3 Create Schema & models

```js
const student = new mongoose.Schema({
    firstName: String
})
```

create Mongoose model

​	-> create collection for Us 

automatically pluralized for us

capital letter for models

```js
const Student = mongoose.model('student', student)
```

The `.model()` function makes a copy of `schema`

### 1.1.4 Create Mongo Document

-> connect to Database

-> 	write operations agains DATABASE 

​	create method on actual model 



```js
connect().then(async connection => {
    const firstStudent = new Student({firstName: 'Piotrek'});
    firstStudent.save(function(err) {
        if (err) {
            console.log(err)
        } 
        console.log(firstStudent)
    })
}).catch(e => console.error(e))
```

> { _id: 635fb805b9698679425286ae, firstName: 'Piotrek', __v: 0 } => Mongo document 

object_id get from `BSOM` package (object representation of uniquie ID)

`_v:0` => version of schema 



### 1.1.5 Mongoose Schemas

```js
const student = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: true // index - not validation 
    },
    faveFoods: [{type: String}],
    info: {
        school :{
            type: String
        }, 
        shoeSize: {
            type: Number
        }
    }
})
```







## 1.2. Rest

API design pattern

- combines DB resources, route paths and HTTP verbs  ==> describe what action they are trying to perform 

- works with basic data models 

### 1.3. Node JS

- async and event driven
- single threaded  (can be optimized)
- can handle high amount of cojncurrent request
- to great for CPU intesive work 



### 1.4 setup

**packages used**

-  bcrypt for crypting password 
- cors / body-parser for server 
- cuid - for testing
- express - framework
- json-webtoken -- for authentication purposes
- lodash - utiliy library 
- morgan / validator - > API plugins ? 





- babel from import / export 

in babel settings we have used 2 plugins for class and spread class operator in js 

```bash
npm install -g nodemon
```



`nodemon` like node but it will restart and rerun a file if a file changes 

there is file `nodemon.json` with instruction what file to watch 



Babble transpile code 



## 2. Express 

### 2.1 Express setup 



```js
app.get('/', (req, res) => {
  console.log(req.body)
  res.send({message: 'Ok'}) 
})
app.post('/', (req, res) => {
    res.send({message: 'Ok'})
})

export const start = () => {
    app.listen(3000, () => {
        console.log('server is running')
    })
}

```



### 2.2 Setting up express routes

```js
app.post('/', (req, res) => {
    res.send({message: 'Ok'})
})
app.get('/data', (req, res) => {
    res.send({message: 'Hello'})
})
```

### 2.3 Routing and Middleware 

middleware 

​	- list of functions that executes in order before our controller 

 - final functions that have to run before we respond back to the request 
 - great for authenticating - transforming request / error handling 

for example those are middlewares : 

```js
app.use(cors())
app.use(json())
```



`cors` -> cross domain resource sharing (allow headers , domain). 

we need to enable to allow browser to use our API 

`morgan` -> 

> GET /data 200 2.329 ms - 19





### 2.4 Custom middleware 

callback in the route is the last function that run 

`res.send`--> end request and send response 

`next` in callback -> allow to execute function in stack  

we call `next()` without argument. we pass arg in case of **error** handling 

```js
const log = (req,res,next) => {
    console.log('logging')
    next()
}
```



log function for entire server

`app.use(log)`

or we can pass middleware in array in controller -and it will be called before sending :

```js
app.get('/data', [log, log], (req, res) => {
    res.send({message: 'Hello'})
})
```

log will be called twice

they can be asynchronous 



### 2.5 Rest route with Express

express has route matching system that allows for exact `regex` and param matching 

```
app.get('/user/*') #global matching
app.get('/user:id') #param matching 
```

### 2.6 Route Order

in case of middleware - orders matter - we run before route matching 

first matched - executed.

here it will go to the second one  - we should nott do it !! 

```js
app.get('/',(req,res, next) => {
    next()
})
app.get('/', (req, res) => {
  res.send({data: 2}) 
})
```

### 2.7 Sub Routes

-> make branch on tree : )

- make router  - in the top : 

  

```
const router = express.Router()
```

we register path : 

```js
router.get('/piotr', (req, res) => {
    res.send({me: "Piotr"})
})
```

 

we need to register to app (root router )

- app.use middleware for every request having `api` 

```js
 app.use('/api', router)
```

```
http://localhost:3000/api/piotr
```

if part of API has set of rules separate then we use router

in case of we do not have all routes in single file !

 

### 2.8 Route Verb methods

```
$routes = [get /team, 'get /team/:id', 'post /team', 'put /team/:id', 'delete /team/:id']
```

tedious to write over and over again and again 

we can write just 2 : 

```js
router.route('/cat')
	.get()
	.post()

router.route('/cat/:id')
	.get()
	.put()
	.delete()
```



mount on server : 

```js
import itemRouter from './resources/item/item.router'
..
```

file we have created is; 

```js
/* eslint-disable prettier/prettier */
import { Router } from 'express'
const mockController = (req, res) => {
    res.send({message: "Piotrek"})
}
const router = Router()
router.route('/')
    .get(mockController)
    .post(mockController)
router.route('/:id')
    .put(mockController)
    .delete(mockController)
    .get(mockController)

export default router

```

```js
import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/db'
import itemRouter from './resources/item/item.router'
export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/api/item', itemRouter)
export const start = async () => {
  try {

    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
```

## 3. Data Modelling 

- always use schema for models

`MongoDB` - **Scheamless** document store -- good choice if you do not go crazy 

MongoDB has added support for creating scheamas but **Mongoose** is better 

```js
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },
      ...
      add some pre mutation ..
      
 export const User = mongoose.model('user', userSchema)     
```



resources line up sth in DATABASE 

Schemas are instructions for models (validations, names, indexes, hooks..)



### 3.1 Mongoese Schema

```js
/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'


const itemSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
      },
      status: {
        type: String,
        required: true,
        enum: ['active', 'complete', 'pastdue'],
        default: 'active'
      },
      notes: String,
      due: Date,
      createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      },
      list: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'list',
        required: true
      }
    },
    { timestamps: true }
  )
  
itemSchema.index({ list: 1, name: 1 }, { unique: true })
export const Item = mongoose.model('item', itemSchema)

```



This is how we setup relationship in mongo - using mongoose

```js
      createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      },
```

here we are saying that combination of index + name must be unique :

```js
itemSchema.index({ list: 1, name: 1 }, { unique: true })
```

### 4. Controllers & Models

controllers works like middleware but intent is to return some data 

- handle what route + verb combo can access data from DB 

- "final middleware" in the stack for a request - no intent to proceed to another middleware  

### 4.1 Express response object

```js
router
  .route('/')
  .get((req, res) => {
    res.status(404).json({ message: 'Hello' })
  })
```

### 4.2 CRUD route with Models

```js
    createdBy: mongoose.Types.ObjectId(), // create fake object id  
```

crud.js file 

```js
export const getOne = model => async (req, res) => {
  try {
    const doc = await model
      .findOne({ createdBy: req.user._id, _id: req.params.id })
      .lean()
      .exec()

    if (!doc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getMany = model => async (req, res) => {
  try {
    const docs = await model
      .find({ createdBy: req.user._id })
      .lean()
      .exec()

    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createOne = model => async (req, res) => {
  const createdBy = req.user._id
  try {
    const doc = await model.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateOne = model => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          createdBy: req.user._id,
          _id: req.params.id
        },
        req.body,
        { new: true }
      )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const removeOne = model => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id
    })

    if (!removed) {
      return res.status(400).end()
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})

```



```js
   const doc = await model.create({ ...req.body, createdBy })
```

for cloning object - -- merging an object or extending object 

```js
const obj1 = { foo: 'bar', x: 42 };

const clonedObj = { ...obj1 };
// { foo: "bar", x: 42 }

```

here we have router

```js
import { Router } from 'express'
import controllers from './item.controllers'

const router = Router()

// /api/item
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)

// /api/item/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router

```

### 5. Auth 

we have never fully authenticated 

**authentication** is controling if an incoming request can proceed or not 

**authorization** - controlling if **authenticated** request has correct permissions to access a resour

**identification** - determining who the requester is 



### 5.1 JWT authentication

tokens passed every request to check auth on the server 

SERVER has no idea what is happening  / not keep tracking who is asking 

requestor has to send token on every single request 

tokens to authenticate in the authorization header 

**bearer** - API is allowing some untrusted resource to access it 

untrusted resources access our API 



**combination of secrets on API and payload(user object)**

- must be sent with every request 

Json web tokens



```js
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

```



signup

```js
export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' })
  }
  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    return res.status(400).end()
  }
}
```



### 5.2 Protect routes

```js
export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end()
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).end()
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()

  if (!user) {
    return res.status(401).end()
  }

  req.user = user
  next()
}
```

