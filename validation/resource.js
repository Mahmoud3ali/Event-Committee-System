// @Def: Function to check if the resource data is sufficient
// @Name: use validateResourceInput() after including
// @Params:
// 1. Data submitted from the add new resource form
// Req: (name, details, owner) -- updated is set automatically to date.now
// @returns
// 1. errors: object contain error in each field, example : email= not a valid email
// 2. isValid: True if it found no errors, False otherwise

// to use some built in validators
const validator = require("validator");
// now you can use isEmpty(anything) to check if it's empty or not
const isEmpty = require("./is_empty");

module.exports = function validateResourceInput(data) {
  let errors = {};

  // Fixed name criteria
  let name_criteria = { min: 6, max: 100 };

  // Fixed notes criteria
  let notes_critera = { min: 0, max: 500 };

  // name: Required, Not empty, between 6 and 100.
  if (isEmpty(data.name)) {
    errors.name = "Name is Required";
  }
  if (!validator.isLength(data.name, name_criteria)) {
    errors.name = "Name length should be between 6 and 10 characters";
  }

  // details: Required, Not empty, between 10 and 500
  if (
    isEmpty(data.details) ||
    !validator.isLength(data.details, notes_critera)
  ) {
    errors.details = "Detials should be between 10 and 500 characters";
  }

  // owner: Required.

  if (isEmpty(data.owner.length)) {
    errors.owners = "You must provide at least one owner";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
