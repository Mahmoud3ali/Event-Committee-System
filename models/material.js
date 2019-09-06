// @Def: Material is something that we can buy from a store (example: balloons)
// @Name: materials
// @Relation : one material can be provided by many stores (many to many)
// When many to many relation get a better way to express them, this should get a fix
const mongoose = require("mongoose");

// use mongo schema as Schema
const Schema = mongoose.Schema;

const materialSchema = new Schema({
  name: {
    // Should be unique
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  providers: [
    // should not be empty
    {
      store_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "stores"
      },
      price: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = material = mongoose.model("materials", materialSchema);
