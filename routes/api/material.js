// to use Router
const express = require("express");
// to use get/post requests from it
const router = express.Router();
// to authenticate the private routes
const passport = require("passport");

// load material schema
const Material = require("../../models/material");

// validation functions
const validateMaterial = require("../../validation/material");

// @route GET api/material/test
// @desc Test the route
// @access public
// @return message if working
router.get("/test", (req, res) => {
  res.json("Testing material page");
});

// @route POST api/material/register
// @desc add a new material to the database
// @access private (logged in users only)
// @return success: {message} if succeded
// @terminal log errors if there's internal error in server
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateMaterial(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Material.findOne({ name: req.body.name }).then(material => {
      if (!material) {
        const newMaterial = new Material(req.body);
        newMaterial
          .save()
          .then(materiall => {
            return res.json(materiall);
          })
          .catch(err => console.log(err));
      } else {
        return res
          .status(400)
          .json({ message: "There's already a material with the same name" });
      }
    });
  }
);
module.exports = router;
