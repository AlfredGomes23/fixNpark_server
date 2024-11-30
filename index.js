const express = require("express");
const cors = require("cors");
// const json = require("./json.json");     //local json as database
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

//middleware
app.use(cors()); //must for cross origin access
app.use(express()); //must for stringify posted data


app.get('/status', (req, res) => {
    res.send("fixNpark Server at Your Server :)")
})

app.listen(port, () => {
    console.log(`fixNpark server is running in port: ${5000}`);
})