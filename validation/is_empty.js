// @Def: Function to check if the data is empty or not
// @Name: use isEmpty()
// @Params
// Value -> the value you need to check if it's empty or not
// @returns
// true if empty, otherwise false
const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty;
