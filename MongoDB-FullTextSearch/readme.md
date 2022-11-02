# MongoDB

```js
use adoption; # create collection 
```

**Document** - record / 1 row/  1 tenry

**Collection** - table 

```js
show dbs;
db.pets.insertOne({name: "Bleki", type: "Dog", breed: "Mieszaniec", age:16 })
// creates automaticaly id for use
db.pets.count() // deprecated
db.pets.countDocuments()
db.pets.help // all methods 
```

### 1.1 Querying MongodB

```js
db.pets.findOne()
// return =>> 
{
  _id: ObjectId("6360d2720320464583fc1aff"),
  name: 'Bleki',
  type: 'Dog',
  breed: 'Mieszaniec',
  age: 16
} 
db.pets.findOne({type:"dog"}) // match first document that match if not then return null 
```

Insert array of objects

```js
db.pets.insertMany(
  Array.from({ length: 10000 }).map((_, index) => ({
    name: [
      "Luna",
      "Fido",
      "Fluffy",
      "Carina",
      "Spot",
      "Beethoven",
      "Baxter",
      "Dug",
      "Zero",
      "Santa's Little Helper",
      "Snoopy",
    ][index % 9],
    type: ["dog", "cat", "bird", "reptile"][index % 4],
    age: (index % 18) + 1,
    breed: [
      "Havanese",
      "Bichon Frise",
      "Beagle",
      "Cockatoo",
      "African Gray",
      "Tabby",
      "Iguana",
    ][index % 7],
    index: index,
  }))
);
```

find One

```js
db.pets.findOne({index:1})
```

```js
db.pets.findOne({type: "dog", age: 9})
db.pets.find({type: "dog", age: 9}) // return batch of 20 documents // type it for iterate
db.pets.find({type: "dog", age: 9}).limit(5)

```

to get all matched instead of 20 batch and running iterate

Expensive thing: !!e

```js
 db.pets.find({type: "dog", age: 9}).limit(40).toArray() 
```



count 

```js
db.pets.count({type: "dog", age: 9})
db.pets.countDocuments({type: "dog", age: 9})
```

- pass subquery as an object (greater than or equal )

```js
db.pets.count({type:"cat", age: {$gte:12}}); // 1110
```

`$eq` ~=> equals



### 1.2 Logical operators

```js
db.pets.count({type:"bird", $and: [{age: {$gte:4}}, {age: {$lte:8}}]})
```

**Sorting**

`1` -> ascending

`-1` -> descending

```js
db.pets.find({type: "dog"}).sort({age: -1, breed: 1}).limit(5)
```

### 1.3 Projections

we just want to return only name

- provide second  param to `find`  that we want to get only name. we can put there `true` or `1`

```js
db.pets.find({type: "dog"}, {name: 1}).limit(5)

```

we got `ObjectId` in return.  if we would not want to return it -- we will need to put `0`

```js
db.pets.find({type: "dog"}, {name: 1, _id: 0}).limit(5)

```



### 1.4 Updating MongoDB

- there is difference for insert one and insert many

`$set` -works like a  object merge

```js
db.pets.updateOne(   { type: "dog", name: "Luna", breed: "Havanese" },   { $set: { owner: "Piotr Sadman" } } );

```



update many - add 1 to age `$inc` -> increment

```js
db.pets.updateMany({type: "dog"}, {$inc: {age: 1}})
```

**upsert**

insert a new document with these things if you don't find one that exists with that.

```js
db.pets.updateOne(
  {
    type: "dog",
    name: "Sudo",
    breed: "Wheaten",
  },
  {
    $set: {
      type: "dog",
      name: "Sudo",
      breed: "Wheaten",
      age: 5,
      index: 10000,
      owner: "Sarah Drasner",
    },
  },
  {
    upsert: true,
  }
);
```

### 1.5 Deleting Documnets in MongoDB

```js
db.pets.deleteMany({ type: "reptile", breed: "Havanese" });
db.pets.findOneAndDelete({name: "Fido", type: "reptile"}); // return deleted documet
  
```

### 1.6 Indexes in MongoDB 

indexes - make faster - we can look for indexes

```js
db.pets.find({name: "Fido"}).explain("executionStats")
```

`collscan` - worst case scenario - look for each query

create index

```js
db.pets.createIndex({ name: 1 });
db.pets.find({ name: "Fido" }).explain("executionStats");
db.pets.getIndexes()
db.pets.find({index: 245})
```

### 1.7 Text Search Indexes

text search across multiple columns 

-> we can createIndex  to create new index containing 3 cols :

```js
db.pets.createIndex({type: "text", breed: "text", name: "text"})
```

`$text` - >search againts full text index 

```js
db.pets.find({$text: {$search: "dog Luna Havanese"}});
```

mongoDB does not sort results.

We need to use `textScore`



```js
db.pets.find({$text: {$search: "dog Luna Havanese"}}).sort({score: {$meta: "textScore"}});
```



### 1.8 Aggregation

people could post only 5 ads 

people tried to create different accounts 

find ads with the same addresses ban them using aggregation 

bucketing : 

- do this
- then do this
- then do this 

```js
db.pets.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 3, 9, 15],
      default: "very senior",
      output: {
        count: { $sum: 1 },
      },
    },
  },
]);
```

### 1.9 Node APP with Mongo DB 

```bash
npm i express mongodb@3.6.2 express@4.17.1
```

ORM  allow us to use library that construct queries for us 

MongoDB - official driver from MongoDB

```js
const express = require('express');
const { MongoClient } = require("mongodb");

const connectionString = "mongodb://localhost:27017";
async function init() {
    const client = new MongoClient(connectionString, {
        useUnifiedTopology: true,
      });
    await client.connect();

    const app = express();

    app.get("/get", async(req, res) => {
        const db = await client.db("adoption");
        const collection = db.collection('pets');
        const pets = await collection
        .find(
          {
            $text: { $search: req.query.search },
          },
          { _id: 0 }
        )
        .sort({ score: { $meta: "textScore" } })
        .limit(10)
        .toArray();
  
      res.json({ status: "ok", pets }).end();
    });

  const PORT = process.env.PORT || 3300;
  app.use(express.static("./static"));
  app.listen(PORT);
  console.log(`running on http://localhost:${PORT}`);
}

init();
```

