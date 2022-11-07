const express = require("express");
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.p3ywohz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {

    const database = client.db('MuscleMaster');
    app.get('/services', async (req, res) => {
        const query = {};
        const cursor = await database.collection('services').find(query);
        const services = await cursor.toArray();
        res.send(services)
    })

}
run()

app.get('/', (req, res) => {
    res.send('MuscleMaster Server Running.')
})


app.listen(port, () => {
    console.log('Port: ', port);
})