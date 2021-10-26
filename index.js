const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const objectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
const port = 5000;



//middleware
app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://machanic1:c4Co371TpReyE4me@cluster0.gt16r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try {
    await client.connect();
    const database = client.db('machanic1');
    const servicesCollection = database.collection('services');


      //Get API
      app.get('/services',async(req,res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      })
      //Get Single Service
      app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        console.log('sp',id)
        const query = {_id:objectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
      })

    //Post API
    app.post('/services',async(req,res)=>{

      const service = req.body;

      console.log('hit the post api',service)
      
       const result = await servicesCollection.insertOne(service);
       console.log(result);
      res.json(result)
    });

    //Delete API
    app.delete('/services/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:objectId(id)};
      const result = await servicesCollection.deleteOne(query);
      res.json(result);

    })

  }
  finally{
    // await client.close();
  }

}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running genius server');

})

app.listen(port,()=>{
    console.log('Running Genius Server on port',port);
})