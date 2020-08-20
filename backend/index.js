const express = require("express");
const jwt = require("jsonwebtoken")
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require('dotenv')

dotenv.config();

// Connect database
mongoose.set("useCreateIndex", true);
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true }
  ).then(() => console.log("Database connected successfully !")).catch(() => console.log("not connected !"));

app.use(bodyParser.json());

// // Import routes
const User = require('./routers/User.js')

// Route Middlewares

app.use('/user', User);


app.get('/',(req,res)=>res.send('hello from server'));
module.exports = app;