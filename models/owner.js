// @Def: Owner is a crew/non crew person who owns 0 or more resources
// @Name: owners
// @Relation: owner has one or more resource, so resources refrence this schema (many to one)
const mongoose = require("mongoose");

// use mongo schema as Schema
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    // should be unique
    type: String,
    required: true
  },
  mobile: {
    type: [String],
    required: true
  },
  social_media: {
    type: String,
    required: true
  }
});

module.exports = owner = mongoose.model("owners", ownerSchema);
