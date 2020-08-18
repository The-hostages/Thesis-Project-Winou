const express = require("express");
const jwt = require("jsonwebtoken")
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb+srv://belgacem:bill1234@cluster0.fogla.mongodb.net/Winou?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  ).then(() => console.log("Database connected successfully !")).catch(() => console.log("not connected !"));

app.use(cors());
app.use(bodyParser.json());

module.exports = app;