// This to quickly setup settings for the whole website

module.exports = {
  // to change the time after which your login session expires
  loginSessionTimeLimit: 43200,
  // port on which backend will run locally
  // process.env.PORT : for heroku deploy.
  backendPort: process.env.PORT || 5000,
  // port on which frontend will run locally
  // TODO: connect this to the real frontend files
  frontendPort: 3000
};
