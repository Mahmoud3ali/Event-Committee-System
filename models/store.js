// @Def: Store is a place where we can buy one or more material
// @Name: stores
// @Relation: many to many relation with materials, so materials refrence here
// --> many stores can provide the same material, many materials could be provided by the same store
const mongoose = require("mongoose");

// use mongo schema as Schema
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  address: {
    link: {
      type: String,
      required: true
    },
    zone: {
      type: String,
      required: true
    }
  },
  opening: [
    {
      open: {
        type: String,
        required: true
      },
      close: {
        type: String,
        required: true
      }
    }
  ],
  notes: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  mobile: [
    {
      type: String
    }
  ],
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = store = mongoose.model("stores", storeSchema);
