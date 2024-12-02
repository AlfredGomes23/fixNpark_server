const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
// const json = require("./json.json");     //local json as database
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

//middleware
app.use(cors()); //must for cross origin access
app.use(express.json()); //must for stringify posted data


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // database
        const fixNparkDatabase = client.db("fixNparkDB");
        // database collections
        const users = fixNparkDatabase.collection("users");
        const parkings = fixNparkDatabase.collection("parkings");

        // user's api's
        app.get('/users', (req, res) => {
            res.send();
        })

        
        // parkings api's
        app.get('/parkings', (req, res) => {
            console.log(req.query);
            res.send();
        });

        app.post('/parking/add', async (req, res) => {
            console.log(req.body);
            const newParking = req.body;
            const result = await parkings.insertOne(newParking);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/status', (req, res) => {
    res.send("fixNpark at Your Service :)")
})

app.listen(port, () => {
    console.log(`fixNpark is running in port: ${5000}`);
})