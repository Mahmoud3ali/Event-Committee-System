//To use Router
const express = require("express");
//To acsses GET && POST Requests from Router
const router = express.Router();
//To acsses space database schema
const Space = require("../../models/space");

//To use Validation unction
const validateSpaceInput = require("../../validation/space");

//To test if it work
router.get("/test", (req, res) => {
  res.json("space route works");
});

// @route POST api/space/register
// @desc Register new space
// @access Public
// @return status :-
// 400 : if there's error(s), and the errors messages are returned
//       each with prefix describing where the error happened "email: already exists"
// 200 : if the space is registered successfully, and the space data is returned with the password encrypted

router.post("/register", (req, res) => {
  const { errors, isValid } = validateSpaceInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  } else {
    Space.findOne({ name: req.body.name }).then(space => {
      if (space) {
        return res.status(400).json({ name: "This Space already exists" });
      } else {
        for (var i = 0; i < 7; i++) {
          req.body.opening[i].open = Date(req.body.opening[i].open);
          req.body.opening[i].close = Date(req.body.opening[i].close);
        }
        const newSpace = new Space(req.body);

        //To save new space in database

        newSpace
          .save()
          .then(space => res.json(space))
          .catch(err => console.log(err));
      }
    });
  }
});

module.exports = router;
