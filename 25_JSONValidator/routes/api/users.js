const express = require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { body, validationResult } = require("express-validator");

const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
const authenticate = require("../../middlewares/auth");

//Post Router api/users/register
Router.post(
  "/register",
  [
    body("username").isAlphanumeric().notEmpty(),
    body("email").isEmail().notEmpty(),
    body("password").isLength({ min: 6 }).notEmpty(),
    body("organization").notEmpty(),
    body("name").notEmpty(),
  ],
  (req, res) => {
    //Form Validation
    //Destructuring Values
    const errors = validationResult(req);
    console.log(errors);

    //Check Validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.findOne({
      email: req.body.email,
    }).then((user) => {
      if (user) {
        return res.status(400).json({
          email: "Email already exists",
        });
      } else {
        const { username, email, password, organization, name } = req.body;
        const newUser = new User({
          username,
          email,
          password,
          organization,
          name,
        });

        //Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(
                (user) => res.json(user)
                // res.redirect('/users/login')
              )
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
);

//Post Router api/users/login

Router.post("/login", [], (req, res) => {
  //Login Validation
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find User By Email
  User.findOne({
    email: email,
  }).then((user) => {
    //Check if Your Exists
    if (!user) {
      return res.status(404).json({
        emailNotFound: "Email is not registered",
      });
    }

    //Match Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //User Matched
        //Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };

        console.log(payload);

        //Sign Token
        jwt.sign(
          payload,
          config.get("secretOrKey"),
          {
            expiresIn: 63113852, //2 years in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token,
            });
          }
        );
      } else {
        return res.status(400).json({
          passwordIncorrect: "Password incorrect",
        });
      }
    });
  });
});

Router.get("/me", authenticate, async (req, res) => {
  try {
    console.log(req.user);
    const loggeduser = await User.findById(req.user.id).select("-password");
    res.status(200).json(loggeduser);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Cannot fetch user" });
  }
});

module.exports = Router;
