// to use Router from it
const express = require("express");
// to use get/post requests from it
const router = express.Router();
// the user database schema
const User = require("../../models/user");
// to use for password encryption
const bcrypt = require("bcryptjs");
// to use for tokens sent when logged in
const jwt = require("jsonwebtoken");
// to use for secret while generating the JWT
const keys = require("../../config/keys");
// to get the expire time for a login session
const settings = require("../../config/settings");
// to authenticate the private routes
const passport = require("passport");

// validation functions
const validateLoginInput = require("../../validation/login");
const validateRegisterInput = require("../../validation/register");

// @route GET api/user/test
// @desc test the route
// @access Public
// @params none
// @return:-
// 200 : if the route is working JSON {message}
router.get("/test", (req, res) => {
  res.json({ message: "User route works" });
});

// @route GET api/user/:user_id
// @desc get the user data given the user id
// @access Public
// @params user_id: "the required user ID"
// @return:-
// 404 : if there is no such user and {"messsage": the error}
// 200 : if the user is found successfully and all it's data
// reutrn JSON of the requested user => {name:,email:,mobile:,type:}
router.get("/:user_id", (req, res) => {
  User.findById({ _id: req.params.user_id })
    .then(user => {
      if (user) {
        userRequested = new User({
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          type: user.type
        });
        return res.status(200).json(userRequested);
      } else
        return res
          .status(404)
          .json({ message: "There's no user with the requested ID" });
    })
    .catch(err =>
      res.status(404).json({ message: "There's no user with the requested ID" })
    );
});

// @route DELETE api/user/:user_id
// @desc delete the user with the given id
// @access Private for the same user only
// @params user_id: "the required user ID"
// @return status :-
// 400/404 : if there is an error with JSON message: "error message"
// 200 : if the user has been removed with JSON message: "success"
router.delete(
  "/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.params.user_id })
      .then(user => {
        if (user) {
          if (req.user.id === req.params.user_id) {
            User.findOneAndDelete({ _id: req.params.user_id })
              .then(user =>
                res.json({ message: "Your accound has been deleted" })
              )
              .catch(err => console.log(err));
          } else
            return res.status(400).json({ messgae: "Unauthorized Deletion" });
        } else return res.status(404).json({ message: "User not found" });
      })
      .catch(err => console.log(err));
  }
);

// @route POST api/user/register
// @desc Register new user
// @access Public
// @params JSON {}
// @return:-
// 400 : if there's error(s), and the errors messages are returned
//       each with prefix describing where the error happened "email: already exists"
// 200 : if the user is registered successfully, and the user data is returned with the password encrypted
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          mobile: req.body.mobile
        });
        // To save the password in database encrypted
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// @route POST api/user/login
// @desc Login a registered user by returning a JWT token
// @access Public
// @return return a JWT token
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      // 404 is not found status
      return res.status(404).json({ email: "User not found" });
    }

    // Check if the given password match the user, remember password in database is hashed/encrypted
    bcrypt.compare(password, user.password).then(Matched => {
      if (Matched) {
        // the data you want to pass with the user
        const payload = { id: user.id, type: user.type, name: user.name };
        jwt.sign(
          payload,
          keys.secret,
          {
            expiresIn: settings.loginSessionTimeLimit
          },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        return res.status(400).json({ password: "Password is incorrect" });
      }
    });
  });
});

// @route POST api/user/profile
// @desc load the user profile
// @access Private
// @return validate the jwt token
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // session: false, i'm not sure what it means really
    // but i think it's a way to keep the communication authorized for future connections
    // if the authentication succeeded, then you should get here, call back is the done function
    res.json(req.user);
  }
);

module.exports = router;
