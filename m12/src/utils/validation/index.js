const schema = {};
const userSchema = require("./userSchema");
const customSchema = require("./customSchema");

schema.user = userSchema;
schema.customPengecekan = customSchema;

module.exports = schema;
