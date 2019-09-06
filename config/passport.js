const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

const opts = {};
// the strategy of extraction
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// the secret we used to make the token in the first place
opts.secretOrKey = keys.secret;

module.exports = passport => {
  passport.use(
    new JWTstrategy(opts, (jwtPayload, done) => {
      //jwtpayload is the token after being decrypted using the secret
      User.findById(jwtPayload.id)
        .then(user => {
          // in case of successful authentication, the done call back should give a good session, otherwise unotherized
          return done(null, { id: user.id });
        })
        .catch(err => console.log(err));
    })
  );
};
