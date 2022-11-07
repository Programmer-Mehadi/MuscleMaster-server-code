const express = require("express");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const services = require('./services.json');

app.get('/', (req, res) => {
    res.send('MuscleMaster Server Running.')
})

app.get('/services', (req, res) => {
    res.send(services)
})

app.listen(port, () => {
    console.log('Port: ', port);
})