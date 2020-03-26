// import dependencies
require("./utils/TestUtilsModule")();
const TestMoneroTxGenerator = require("./TestMoneroTxGenerator");

// test tx generator
new TestMoneroTxGenerator({}).runTests();