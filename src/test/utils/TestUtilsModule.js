/**
 * Exports test utils to resolve circular dependencies.
 */
module.exports = function() {
  this.TestUtils = require("./TestUtils");
}