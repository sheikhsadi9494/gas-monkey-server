const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4wgcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        const database = client.db('gasMonkey-garage');
        const userCollaction = database.collection('services');

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitting the post', service)
            const result = await userCollaction.insertOne(service);
            console.log(result)
            res.json(result);
        })
        // GET API
        app.get('/services', async (req, res) => {
            const cursor = userCollaction.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // GET AN SINGLE API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await userCollaction.findOne(query);
            res.json(service);
        })
        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollaction.deleteOne(query);
            console.log(result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Genius Car Mechanices garage crud server')
})

app.listen(port, () => {
    console.log('Running  Server On Port', port);
})