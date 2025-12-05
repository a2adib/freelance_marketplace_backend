const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;


const app = express();
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://freelancemarketplace:iFb2Lwzjid2j0pip@cluster0.by0ybnd.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const database = client.db('freelanceMarketplace');
    const postJobs = database.collection('jobs');
// post or save services from database
    app.post('/jobs', async(req,res)=>{
        const data = req.body;
        const date = new Date();
        data.CreatedAt = date;
        console.log(data);
        const result = await postJobs.insertOne(data);
        res.send(result);
    })

// get or read services from database
    app.get('/jobs', async(req,res)=>{
        const result = await postJobs.find().toArray();
        res.send(result);
    })


// get single service using id
    app.get('/jobs/:id', async(req,res)=>{
        const id = req.params
        console.log(id);
        
        const query = {_id: new ObjectId(id)};
        const result = await postJobs.findOne(query);
        res.send(result);
    })
// get jobs added by specific user
  app.get('/myAddedJobs', async(req,res)=>{
    const {email} = req.query
    console.log(email);
    const query = {userEmail: email};
    const result = await postJobs.find(query).toArray();
    res.send(result);
  })

  app.put('/update/:id', async(req,res)=>{
    const data = req.body;
    const id = req.params
    const query = {_id: new ObjectId(id)};

    const updateJobs = {
      $set: data
  }})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('hello developers')
})



app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
    
})