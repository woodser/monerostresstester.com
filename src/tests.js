/**
 * Sample browser application which uses a JavaScript library to interact
 * with a Monero daemon using RPC and a Monero wallet using RPC and WASM
 * bindings.
 */
require("monero-javascript");
const MoneroWalletCoreProxy = require("./MoneroWalletCoreProxy");
const assert = require("assert");

/**
 * Run tests when document ready.
 */
document.addEventListener("DOMContentLoaded", function() {
  runTests();
});

/**
 * Run Monero tests.
 */
function runTests() {
  
  // mocha setup
  mocha.setup({
    ui: 'bdd',
    timeout: 3000000
  });
  mocha.checkLeaks();
  
  // test utilitiles
  new TestMoneroUtils().runTests();
  
  // test daemon rpc
  new TestMoneroDaemonRpc().runTests({
    liteMode: true,  // skips some thorough but lengthy tests
    testNonRelays: true,
    testRelays: false, // creates and relays outgoing txs
    testNotifications: false
  });
  
  // test wallet rpc
  new TestMoneroWalletRpc().runTests({
    liteMode: true, // skips some lengthy but detailed tests
    testNonRelays: true,
    testRelays: false,
    testNotifications: false,
    testResets: false
  });
  
  // test keys-only wallet
  new TestMoneroWalletKeys().runTests({
    liteMode: false,
    testNonRelays: true,
    testRelays: false,
    testResets: false,
    testNotifications: false
  });
  
  // test core wallet
  new TestMoneroWalletCore().runTests({
    liteMode: true,
    testNonRelays: true,
    testRelays: false,
    testResets: false,
    testNotifications: false
  });
  
  // run tests
  mocha.run();
}