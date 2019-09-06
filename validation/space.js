// @Def: Function to check if the space data is sufficient
// @Name: use validateSpaceInput() after including
// @Params:
// 1. Data submitted from the add new co-working space form
// Req: (name, address(zone,link), at least one mobile number, at least one room data, social_media, array of open, close times)
// @returns
// 1. errors: object contain error in each field, example : email= not a valid email
// 2. isValid: True if it found no errors, False otherwise

// to use some built in validators
const validator = require("validator");
// now you can use isEmpty(anything) to check if it's empty or not
const isEmpty = require("./is_empty");

module.exports = function validateSpaceInput(data) {
  let errors = {};
  // Fixed name criteria
  let name_criteria = { min: 6, max: 100 };

  // Fixed notes criteria
  let notes_critera = { min: 0, max: 500 };

  // name: Required, Not empty, between 6 and 100.
  if (isEmpty(data.name) || !validator.isLength(data.name, name_criteria)) {
    errors.name = "Name length should be between 6 and 10 characters";
  }

  // email: Optional, valid email.
  if (!isEmpty(data.email) && !validator.isEmail(data.email)) {
    errors.email = "This email is not valid";
  }

  let addressError = {};
  // address.link : Required, valid URL, using https.
  if (isEmpty(data.address.link) || !validator.isURL(data.address.link)) {
    addressError.link =
      "You must provide a valid google maps link, it must use https protocol";
  }

  // address.zone : Required, Not empty, max 100
  if (
    isEmpty(data.address.zone) ||
    !validator.isLength(data.address.zone, { max: 100 })
  ) {
    addressError.zone = "You must provide a valid zone";
  }

  if (!isEmpty(addressError)) {
    errors.address = addressError;
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

  // rooms: non empty array
  if (!Array.isArray(data.rooms) || data.rooms.length < 1) {
    errors.rooms = "Add at least one room data";
  } else {
    // each room must have capacity and a price and name, others has max 500 chars
    let subErrors = {};

    for (var i = 0; i < data.rooms.length; i++) {
      // capacity: required, integer
      if (
        isEmpty(data.rooms[i].capacity) ||
        !validator.isInt(data.rooms[i].capacity)
      ) {
        subError[i].capacity = "Capacity must be filled with integer value";
      }

      // price: required, integer
      if (
        isEmpty(data.rooms[i].price) ||
        !validator.isInt(data.rooms[i].price)
      ) {
        subError[i].price = "Price must be filled with integer value";
      }

      // name: required, 6:100
      if (
        isEmpty(data.rooms[i].name) ||
        !validator.isLength(data.rooms[i].name, name_criteria)
      ) {
        subError[i].name = "Name must be between 6 and 100 characters";
      }

      // special_cases: optional, max 500 chars
      if (
        !isEmpty(data.rooms[i].special_cases) &&
        !validator.isLength(data.rooms[i].special_cases, notes_critera)
      ) {
        subError[i].special_cases = "Maximum 500 characters";
      }

      // notes: optional, max 500 chars
      if (
        !isEmpty(data.rooms[i].notes) &&
        !validator.isLength(data.rooms[i].notes, notes_critera)
      ) {
        subError[i].notes = "Maximum 500 characters";
      }
    }
    if (!isEmpty(subErrors)) errors.rooms = subErrors;
  }

  // notes: optional, 500 max
  if (!isEmpty(data.notes) && !validator.isLength(data.notes, notes_critera)) {
    errors.notes = "Maximum 500 characters";
  }

  // connections : optional
  if (Array.isArray(data.connections)) {
    let subErrors = {};
    for (var i = 0; i < data.connections.length; i++) {
      // mobile: required, valid Ar-EG
      if (
        isEmpty(data.connections[i].mobile) ||
        !validator.isMobilePhone(data.mobile[i], "ar-EG")
      ) {
        subErrors[i].mobile = "Provide a valid egyptian mobile number";
      }

      // name: required, 6:100
      if (isEmpty(data.connections[i].name)) {
        subErrors[i].name = "Name must be between 6 and 100 letters";
      }

      if (!validator.isLength(data.connections[i].name, name_criteria)) {
        subErrors[i].name = "Name must be between 6 and 100 letters";
      }

      // notes: optional, 500 max
      if (
        !isEmpty(data.connections[i].notes) &&
        !validator.isLength(data.connections[i].notes, notes_critera)
      ) {
        subError[i].notes = "Maximum 500 letter";
      }
    }
    if (!isEmpty(subErrors)) errors.connections = subErrors;
  }

  // opening: required, 7 elements
  if (!Array.isArray(data.opening) || data.opening.length != 7) {
    errors.opening = "Please specify the weekly activity of the space";
  } else {
    let opening_subErross = {};
    for (var i = 0; i < 7; i++) {
      // open: required, not empty
      if (isEmpty(data.opening[i].open))
        subErros[i].open = "Specify the opening time";

      // close: required, not empty
      if (isEmpty(data.opening[i].close))
        subErros[i].close = "Specify the closing time";
    }
    if (!isEmpty(opening_subErross)) errors.opening = opening_subErross;
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
