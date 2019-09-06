// Def: Space is how we will represent co-working space
// Data details can be found on a trello card named the same name as this file
// this is a schema for how the co-working space instance will look like in the DB
// you will need mongoose 'mongoDB' to import the schema module
const mongoose = require("mongoose");

// use mongo schema as Schema
const Schema = mongoose.Schema;

const SpaceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
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
  mobile: {
    type: [String],
    // todo make sure what true here will do
    required: false
  },
  rooms: {
    type: [
      {
        capacity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        special_cases: {
          type: String,
          required: false
        },
        notes: {
          type: String,
          required: false
        },
        name: {
          type: String,
          required: true
        }
        //todo make sure what true here will do
      }
    ],
    //todo make sure what true here will do
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  connections: [
    {
      mobile: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      notes: {
        type: String,
        required: false
      }
    }
  ],
  opening: {
    type: [
      {
        open: {
          type: Date,
          required: true
        },
        close: {
          type: Date,
          required: true
        }
      }
    ],
    required: true
  },
  social_media: {
    type: String,
    required: true
  }
});

module.exports = space = mongoose.model("spaces", SpaceSchema);
