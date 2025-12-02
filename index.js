const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;


const app = express();
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://freelancemarketplace:mgdY3tHOlgcixBPC@cluster0.by0ybnd.mongodb.net/?appName=Cluster0";

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

    const database = client.db('postService');
    const postService = database.collection('services');

    app.post('/services', async(req,res)=>{
        const data = req.body;
        console.log(data);
        const result = await postService.insertOne(data);
        res.send(result);
    })

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