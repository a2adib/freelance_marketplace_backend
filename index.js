const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;


const app = express();
app.use(cors());
app.use(express.json());



const uri = process.env.MONGODB_URI;

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
    const freelanceMarketplace = database.collection('jobs');
    const acceptedJobsCollection = database.collection('acceptedJobs');

    // post or save services from database
    app.post('/jobs', async (req, res) => {
      const data = req.body;
      const date = new Date();
      data.CreatedAt = date;
      console.log(data);
      const result = await freelanceMarketplace.insertOne(data);
      res.send(result);
    })

    // get or read services from database
    app.get('/jobs', async (req, res) => {
      const category = (req.query.category || "").trim();

      const query = category ? { category } : {};
      const result = await freelanceMarketplace.find(query).toArray();
      res.send(result);
    })


    // get single service using id
    app.get('/jobs/:id', async (req, res) => {
      const { id } = req.params
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await freelanceMarketplace.findOne(query);
      res.send(result);
    })
    // get jobs added by specific user
    app.get('/myAddedJobs', async (req, res) => {
      const { email } = req.query
      console.log(email);
      const query = { userEmail: email };
      const result = await freelanceMarketplace.find(query).toArray();
      res.send(result);
    })
    // update jobs
    app.put('/update/:id', async (req, res) => {
      const data = req.body;
      delete data._id;
      console.log(data)
      const { id } = req.params
      const query = { _id: new ObjectId(id) };

      const updateJobs = {
        $set: data
      }

      const result = await freelanceMarketplace.updateOne(query, updateJobs);
      res.send(result);
      console.error("Update error:", err);
    })
// delete jobs
    app.delete('/delete/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await freelanceMarketplace.deleteOne(query);
      res.send(result);
    })

// accepted jobs api
    app.post('/acceptedJobs', async (req, res) => {
      const data = req.body;
      console.log(data);
      result = await acceptedJobsCollection.insertOne(data);
      res.send(result);
    })
// get accepted jobs by user email
    app.get('/acceptedJobs', async (req, res) => {
      const { email } = req.query
      console.log(email);
      const query = { acceptedBy: email };
      const result = await acceptedJobsCollection.find(query).toArray();
      res.send(result);
    });
      
app.delete('/remove/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await acceptedJobsCollection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('hello developers')
})



app.listen(port, () => {
  console.log(`server is running on ${port}`);

})