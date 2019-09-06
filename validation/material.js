// @Def: Function to check if the material data is right
// @Name: use validateMaterialInput()
// @Params:
// 1. Data submitted from the material form
// note: store ID must be valid id or internal error can occur
// Req: (name, providers)
// @returns
// 1. errors: object contain error in each field, example : email= not a valid email
// 2. isValid: True if it found no errors, False otherwise

// to use some built in validators
const validator = require("validator");
// built in function to check on empty objects
const isEmpty = require("./is_empty");

module.exports = function validateMaterialInput(data) {
  let errors = {};

  let name = { min: 3, max: 100 };
  let notes = { max: 500 };

  if (isEmpty(data.name)) {
    errors.name = "You must enter the material name";
  } else if (!validator.isLength(data.name, name)) {
    errors.name =
      "The name must contain at least 3 letters and at most 100 letter";
  }

  if (!isEmpty(data.notes) && validator.isLength(data.notes, notes)) {
    errors.notes = "You can enter maximum 500 letter";
  }

  if (!Array.isArray(data.providers) || data.providers.length < 1) {
    errors.providers = "You have to enter at least one provider";
  }

  for (var i = 0; i < data.providers.length; i++) {
    let subErrors = {};

    if (isEmpty(data.providers[i].price)) {
      subErrors[i] = { price: "You must enter the price" };
    } else if (
      !validator.isInt(data.providers[i].price) &&
      !validator.isDecimal(data.providers[i].price)
    ) {
      subErrors[i] = { price: "You must enter a valid price" };
    }

    if (!isEmpty(subErrors)) errors.providers = subErrors;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
