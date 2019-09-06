// @Def: Function to check if the store data is sufficient
// @Name: use validateStoreInput() after including
// @Params:
// 1. Data submitted from the add new store form
// Req: (address, at least one mobile number, at least one room data, array of (open, close) times)
// @returns
// 1. errors: object contain error in each field, example : email= not a valid email
// 2. isValid: True if it found no errors, False otherwise

// TODO: Fix the maps checker (zone, link)

// to use some built in validators
const validator = require("validator");
// now you can use isEmpty(anything) to check if it's empty or not
const isEmpty = require("./is_empty");

module.exports = function validateStoreInput(data) {
  let errors = {};

  // name general criteria
  let name_criteria = { min: 3, max: 100 };

  // note general criteria
  let notes_criteria = { max: 500 };

  // name: optional, 6:100
  if (!isEmpty(data.name) && !validator.isLength(data.name, name_criteria)) {
    errors.name = "Name must be between 6 and 100 letters";
  }

  // mobile: non empty array
  if (!Array.isArray(data.mobile) || data.mobile.length < 1) {
    errors.mobile = "You have to enter at least one mobile number";
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

  let adderr = {};
  // address.link : Required, valid URL, using https.
  if (
    isEmpty(data.address.link) ||
    !validator.isURL(data.address.link, { protocols: ["https"] })
  ) {
    adderr.link =
      "You must provide a valid google maps link, it must use https protocol";
  }

  // address.zone : Required, Not empty, max 100
  if (
    isEmpty(data.address.zone) ||
    !validator.isLength(data.address.zone, { max: 100 })
  ) {
    adderr.zone = "Please provide a valid zone";
  }

  if (!isEmpty(adderr)) {
    errors.address = adderr;
  }

  // opening: required, 7 elements
  if (!Array.isArray(data.opening) || data.opening.length != 7) {
    errors.opening =
      "Please specify the open/close time for each day in a week";
  } else {
    let subErrors = {};
    for (var i = 0; i < 7; i++) {
      // open: required, not empty
      let temp = {};
      if (isEmpty(data.opening[i].open)) temp.open = "Specify the opening time";

      // close: required, not empty
      if (isEmpty(data.opening[i].close))
        temp.close = "Specify the closing time";

      if (!isEmpty(temp)) subErrors[i] = temp;
    }
    if (!isEmpty(subErrors)) errors.opening = subErrors;
  }

  // notes: optional, 500 max
  if (!isEmpty(data.notes) && !validator.isLength(data.notes, notes_criteria)) {
    errors.name = "notes should be at maximum 500 letters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
