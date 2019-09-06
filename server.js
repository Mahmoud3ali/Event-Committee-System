const express = require("express"); // include express so we can use it -> app
const mongoose = require("mongoose"); // to connect to the db
const bodyParser = require("body-parser"); // use bodyparser to parse req.body
const passport = require("passport"); // use passport to validate JWT
const settings = require("./config/settings"); // to import ports from settings

// Import APIs
const store = require("./routes/api/store");
const user = require("./routes/api/user");
const owner = require("./routes/api/owner");
const resource = require("./routes/api/resource");
const space = require("./routes/api/space");
const material = require("./routes/api/material");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;

// connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log("Database Connected."))
  .catch(err => console.log(err));

// Passport middleware - to make express use passport as middleware, appearently it's not necessary now
// this part i don't understand well (mahmoud3ali)
app.use(passport.initialize());

// Passport config, call the passport.js and fix it's setting make it ready to be used by authentication
require("./config/passport")(passport);

// API routes
// route to store API
app.use("/api/store", store);
// route to user API
app.use("/api/user", user);
// route to owner register
app.use("/api/owner", owner);
//route to resource register
app.use("/api/resource", resource);
//route to space register
app.use("/api/space", space);
// route to material API
app.use("/api/material", material);

// use localhost:5000
app.listen(settings.backendPort, () =>
  console.log("server running " + settings.backendPort)
);
