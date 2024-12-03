const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const contactUs = fixNparkDatabase.collection("contactUs");

        // user's api's
        app.get('/users', (req, res) => {
            res.send();
        })


        // parkings api's
        app.get('/parkings', async (req, res) => {
            const { search, subscription, parkingType, wheels, provider } = req.query;

            try {
                const query = {};

                if (search && search.toLowerCase() !== "all") {
                    query.address = { $regex: search, $options: "i" };
                }

                if (subscription && subscription !== "Any Subscription") {
                    query.subscription = subscription;
                }

                if (parkingType && parkingType !== "Both Single and Bulk") {
                    query.parkingType = parkingType;
                }

                if (wheels && wheels !== "Any Number of Wheeler") {
                    query.wheels = wheels;
                }

                if (provider && provider !== "All Provider") {
                    query.provider = provider;
                }

                query.bookedUser = { $exists: false };
                query.bookedUser = null; // OR ensures 'bookedUser' is null

                console.log("Filters applied: ", query);

                const result = await parkings.find(query).toArray();

                res.send({ success: true, data: result });
            } catch (error) {
                console.error("Error fetching parkings: ", error);

                const allData = await parkings.find().toArray();

                res.send({
                    success: false,
                    error: "An error occurred while fetching filtered data.",
                    data: allData, // Send all parking data for fallback
                });
            }
        });


        app.post('/parking/add', async (req, res) => {
            const newParking = req.body;
            const result = await parkings.insertOne(newParking);
            res.send(result);
        });

        //contact us
        app.post('/contact', async (req, res) => {
            const { email, message } = req.body;

            const contactData = {
                email,
                message,
                createdAt: new Date(),
            };

            const result = await contactUs.insertOne(contactData);

            res.send(result)
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