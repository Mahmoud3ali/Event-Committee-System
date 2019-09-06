//To use Router
const express = require("express");
//To acsses GET && POST Requests from Router
const router = express.Router();
//To acsses resource database schema
const Resource = require("../../models/resource");

//To use Validation unction
const validateResourceInput = require("../../validation/resource");

//To test if it work
router.get("/test", (req, res) => {
  res.json("resource route works");
});

// @route POST api/resource/register
// @desc Register new resource
// @access Public
// @return status :-
// 400 : if there's error(s), and the errors messages are returned
//       each with prefix describing where the error happened "email: already exists"
// 200 : if the resource is registered successfully, and the resource data is returned with the password encrypted

router.post("/register", (req, res) => {
  const { errors, isValid } = validateResourceInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  } else {
    Resource.findOne({ name: req.body.name }).then(resource => {
      if (resource) {
        return res.status(400).json({ name: "This Resource already exists" });
      } else {
        const newResource = new Resource({
          name: req.body.name,
          details: req.body.details,
          owner: req.body.owner
        });
        //To save new resource in database
        newResource
          .save()
          .then(() =>
            res.status(200).json({ message: "Successfully Registered" })
          )
          .catch(err => console.log(err));
      }
    });
  }
});

module.exports = router;
