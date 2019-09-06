// @Def: Function to check if the owner data is sufficient
// @Name: use validateOwnerInput() after including
// @Params:
// 1. Data submitted from the add new owner form
// Req: (name, email, at least one mobile number, social_media)
// @returns
// 1. errors: object contain error in each field, example : email= not a valid email
// 2. isValid: True if it found no errors, False otherwise

// to use some built in validators
const validator = require("validator");
// now you can use isEmpty(anything) to check if it's empty or not
const isEmpty = require("./is_empty");

module.exports = function validateOwnerInput(data) {
  let errors = {};

  // Fixed name criteria
  let name_criteria = { min: 6, max: 100 };

  // name: Required, Not empty, between 6 and 100.
  if (isEmpty(data.name) || !validator.isLength(data.name, name_criteria)) {
    errors.name = "Name length should be between 6 and 10 characters";
  }

  // email: Required, Not empty, valid email.
  if (isEmpty(data.email) || !validator.isEmail(data.email)) {
    errors.email = "You must write a valid email";
  }

  // mobile: non empty array
  if (!Array.isArray(data.mobile) || data.mobile.length < 1) {
    errors.mobile = "You must provide at least one number";
  } else {
    // each mobile number must be valid egyptian mobile number
    let subErrors = {};
    for (var i = 0; i < data.mobile.length; i++) {
      if (
        isEmpty(data.mobile[i]) ||
        !validator.isMobilePhone(data.mobile[i], "ar-EG")
      ) {
        subErrors[i] = "Not a valid egyptian mobile number";
      }
    }
    if (!isEmpty(subErrors)) errors.mobile = subErrors;
  }

  // social_media: required, URL
  if (isEmpty(data.social_media) || !validator.isURL(data.social_media)) {
    errors.social_media = "Enter a valid facebook URL";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
