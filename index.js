const express = require("express");
const cors = require('cors');

require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.p3ywohz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {

    try {
        const servicesCollection = client.db('MuscleMaster').collection('services');
        const reviewsCollection = client.db('MuscleMaster').collection('reviews');

        app.get('/', (req, res) => {
            res.send('MuscleMaster Server Running.')
        })

        app.get('/services', async (req, res) => {
            const limit = req.query.limit
            if (limit) {
                const query = {};
                const cursor = await servicesCollection.find(query).limit(parseInt(limit));
                const services = await cursor.toArray();
                res.send(services)
            }
            else {
                const query = {};
                const cursor = await servicesCollection.find(query);
                const services = await cursor.toArray();
                res.send(services)
            }

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
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            if (id.length === 24) {
                const query = { serviceId: id };
                const cursor = await reviewsCollection.find(query);
                const reviews = await cursor.toArray();
                res.send(reviews);
            }
        })
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            if (id.length === 24) {
                const query = { _id: ObjectId(id) };
                const review = await reviewsCollection.findOne(query);
                res.send(review);
            }
        })
        app.get('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { userId: id };
            const cursor = await reviewsCollection.find(query).sort({ time: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        app.post('/addreview', async (req, res) => {
            const reviewData = req.body;
            const result = await reviewsCollection.insertOne(reviewData);
            res.send(result);
        })
        app.patch('/editreview/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    reviewText: data.reviewText,
                    serviceId: data.serviceId,
                    serviceName: data.serviceName,
                    userId: data.userId,
                    userName: data.userName,
                    userPhoto: data.userPhoto,
                    rating: data.rating,
                    time: data.time,
                }
            }
            const result = await reviewsCollection.updateOne(filter, updatedDoc, options)
            res.send(result);
        })
        app.get('/deletereview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/addservice', async (req, res) => {
            console.log(req.body);
            const serviceData = req.body;
            const result = await servicesCollection.insertOne(serviceData);
            res.send(result);
        })

    }
    finally {

    }

}
run()



app.listen(port, () => {
    console.log('Port: ', port);
})