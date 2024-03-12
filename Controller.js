const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

exports.startDatabase = async()=>{
    await mongoose.connect(process.env.URL,{dbName : process.env.DBNAME})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Failed to connect to MongoDB", err));
}