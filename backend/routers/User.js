const express = require("express");
const users = express.Router();
const User = require('../controllers/User');

users.post('/register', User.createUser)
users.post('/login', User.findUser)


module.exports = users;