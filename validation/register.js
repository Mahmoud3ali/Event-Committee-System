// @Def: Function to check if the login data is right
// @Name: use validateLoginInput()
// @Params:
// 1. Data submitted from the login form
// Req: (name, email, password, mobile number)
// @returns
// 1. errors: object contain error in each field, example : email= not a valid email
// 2. isValid: True if it found no errors, False otherwise

// to use some built in functions in validator
const validator = require("validator");

// function in validation folder
const isEmpty = require("./is_empty");

// If you don't know what is owasp, check this link https://github.com/nowsecure/owasp-password-strength-test
const owasp = require("owasp-password-strength-test");

// configuring owasp
owasp.config({
  // to allow Passphrases (simple notation for long passwords that are not complex for your mind)
  allowPassphrases: true,
  maxLength: 64,
  minLength: 10,
  minPhraseLength: 20,
  // there's optional tests, here you set the minimum required number to pass
  minOptionalTestsToPass: 4
});

module.exports = function validateRegisterInput(data) {
  let errors = {};
  let name = { min: 6, max: 100 };
  let address = { max: 500 };
  const result = owasp.test(data.password);

  if (isEmpty(data.name)) {
    errors.name = "This field is required";
  } else if (!validator.isLength(data.name, name)) {
    errors.name = "Your name must contain at least 6 char and at most 100 char";
  }

  if (isEmpty(data.email) || !validator.isEmail(data.email)) {
    errors.email = "You must write a valid email";
  }

  if (!result.strong) {
    errors.password = result.errors;
  }

  if (data.password !== data.password2) {
    errors.password2 = "Those passwords doesn't match";
  }

  if (!Array.isArray(data.mobile) || data.mobile.length < 1) {
    errors.mobile = "You have to enter at least one mobile number";
  } else if (data.mobile.length > 5) {
    errors.mobile = "You have to enter at most five mobile numbers";
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

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
