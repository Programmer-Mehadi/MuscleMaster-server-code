const express = require("express");
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.p3ywohz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {

    try {
        const servicesCollection = client.db('MuscleMaster').collection('services');

        app.get('/', (req, res) => {
            res.send('MuscleMaster Server Running.')
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = await servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            if (id.length === 24) {
                const query = { _id: ObjectId(id) };
                const service = await servicesCollection.findOne(query);
                console.log(service);
                res.send(service);
            }
            else {
                res.send("Error: No Data found !");
            }

        })
    }
    finally {

    }

}
run()



app.listen(port, () => {
    console.log('Port: ', port);
})