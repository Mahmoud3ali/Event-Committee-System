// to use Router
const express = require("express");
// to use get/post requests from it
const router = express.Router();
// to authenticate the private routes
const passport = require("passport");

// load store schema
const Store = require("../../models/store");

// validation functions
const validateStore = require("../../validation/store");

// @route GET api/store/test
// @desc Test the route
// @access public
// @return message if working
router.get("/test", (req, res) => {
  res.json("Testing store page");
});

// @route POST api/store/register
// @desc add a new store to the database
// @access private (logged in users only)
// @return success: {message} if succeded
// @terminal log errors if there's internal error in server
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateStore(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Store.findOne({ name: req.body.name, mobile: req.body.mobile }).then(
      store => {
        if (!store) {
          const newStore = new Store(req.body);
          newStore
            .save()
            .then(store =>
              res.json({ success: "Successfully added to the database" })
            )
            .catch(err => console.log(err));
        } else {
          json.status(400).json({ message: "Duplicated entry" });
        }
      }
    );
  }
);

module.exports = router;
