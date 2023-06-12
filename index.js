const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT  || 5000;
const app = express();
//middleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=> {
  res.send('API Running');
})


const uri = "mongodb+srv://dbuser2:JVcRoLjbdKquu75T@cluster0.wwvmwag.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(){
try {
  
  const userCollection = client.db('nodeMongoCrud').collection('users');

  app.get('/users',async(req,res)=> {
    const query = {};
    const cursor = userCollection.find(query);
    const users = await cursor.toArray();
    res.send(users);
  })
  app.get('/users/:id',async(req,res)=> {
    const id = req.params.id;
    const search = {_id : new ObjectId(id)}
    const result = await  userCollection.findOne(search);
    
    res.send(result)
  })
  app.put('/users/:id',async(req,res)=> {
    const id = req.params.id;
    const filter = {_id : new ObjectId(id)};
    const user = req.body;
    const options = {upsert:true};
    const updatedUser = {
      $set: {
        name:user.name,
        address:user.address,
        email:user.email
      }
    }
    const result = await userCollection.updateOne(filter,updatedUser,options);
    res.send(result)
    console.log(result);

  })

  app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    // console.log('trying to delete', id);
    const query = { _id: new ObjectId(id) }
    const result = await userCollection.deleteOne(query);
    console.log(result);
    res.send(result);
});

  app.post('/addUsers',async(req,res)=> {
  const user = req.body;
  const result = await userCollection.insertOne(user);
  console.log(result);
})

} 
finally{

}
}
run().catch(err=> console.error(err))



app.listen(port,()=> {
  console.log('port running on ', port);
})