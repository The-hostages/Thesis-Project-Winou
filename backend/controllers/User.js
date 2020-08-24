const User = require("../models/User");
const { signUpValidation, loginValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  // Validation of data before saving
  const { error } = signUpValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Checking if The user is already exist
  const existedEmail = await User.findOne({ email: req.body.email });
  if (existedEmail) return res.status(400).send("Email is already exists");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // creation of a new user
  User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hashPassword,
  })
    .then((user) => {
      res.send({ user: user._id });
    })
    .catch((err) => {
      res.send("error: " + err);
    });
};

exports.findUser = async (req, res) => {
  // Validation of data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Checking if The user is already exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is wrong!");
  // Valid password
  const validPAssword = await bcrypt.compare(req.body.password, user.password);
  if (!validPAssword) return res.status(400).send("Invalid password");

  // create and assign a token
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send(token);
};
