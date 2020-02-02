/**
 * Sample browser application which uses a JavaScript library to interact
 * with a Monero daemon using RPC and a Monero wallet using RPC and WASM
 * bindings.
 */
require("monero-javascript");
const MoneroWalletCoreProxy = require("./MoneroWalletCoreProxy");
const assert = require("assert");

document.addEventListener("DOMContentLoaded", function() {
  
  // mocha setup
  mocha.setup('bdd');
  mocha.checkLeaks();
  //mocha.growl();  // enable web notifications
  
  // import tests
  runMain();
  
  // run tests
  mocha.run();
});

/**
 * Main thread.
 */
function runMain() {
  console.log("RUN MAIN");
  
  console.log("What tests do you want to run?");

  /**
   * Test utilities including those implemented in WebAssembly.
   */
  describe("TEST MONERO UTILITIES", function() {
    
    // initialize utils to test
    before(async function() {
      await MoneroUtils.loadWasmModule();
    });
    
    describe("Binary Serialization", function() {
      
      it("Can serialize heights with small numbers", function() {
        let json = { heights: [111, 222, 333] };
        let binary = MoneroUtils.jsonToBinary(json);
        assert(binary);
        let json2 = MoneroUtils.binaryToJson(binary);
        assert.deepEqual(json2, json);
      });
      
      it("Can serialize heights with big numbers", function() {
        let json = { heights: [123456, 1234567, 870987] };
        let binary = MoneroUtils.jsonToBinary(json);
        assert(binary);
        let json2 = MoneroUtils.binaryToJson(binary);
        assert.deepEqual(json2, json);
      });
      
      it("Can serialize json with text", function() {
        let json = { msg: 'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' };
        let binary = MoneroUtils.jsonToBinary(json);
        assert(binary);
        let json2 = MoneroUtils.binaryToJson(binary);
        assert.deepEqual(json2, json);
      });
      
      it("Can serialize json with long text", function() {
        let json = { msg: 'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' +
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' + 
            'Hello there my good man lets make a nice long text to test with lots of exclamation marks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n'};
        let binary = MoneroUtils.jsonToBinary(json);
        assert(binary);
        let json2 = MoneroUtils.binaryToJson(binary);
        assert.deepEqual(json2, json);
      });
    });
  });
      
//  // config
//  let daemonRpcUri = "http://localhost:38081";
//  let daemonRpcUsername = "superuser";
//  let daemonRpcPassword = "abctesting123";
//  let walletRpcUri = "http://localhost:38083";
//  let walletRpcUsername = "rpc_user";
//  let walletRpcPassword = "abc123";
//  let mnemonic = "petals frown aerial leisure ruined needed pruned object misery items sober agile lopped galaxy mouth glide business sieve dizzy imitate ritual nucleus chlorine cottage ruined";
//  let primaryAddress = "54tjXUgQVYNXQCJM4CatRQZMacZ2Awq4NboKiUYtUJrhgYZjiDhMz4ccuYRcMTno6V9mzKFXzfY8pbPnGmu2ukfWABV75k4";  // just for reference
//  let restoreHeight = 501788;
//  let daemonConnection = new MoneroRpcConnection({uri: daemonRpcUri, user: daemonRpcUsername, pass: daemonRpcPassword});
//  
//  // create a core wallet from mnemonic
//  let walletCore = await MoneroWalletCoreProxy.createWalletFromMnemonic("abctesting123", MoneroNetworkType.STAGENET, mnemonic, daemonConnection, restoreHeight);
//  assert.equal(await walletCore.getMnemonic(), mnemonic);
//  assert.equal(await walletCore.getPrimaryAddress(), primaryAddress);
//  console.log("Core wallet imported mnemonic: " + await walletCore.getMnemonic());
//  console.log("Core wallet imported address: " + await walletCore.getPrimaryAddress());
  
  console.log("EXIT MAIN");
}

/**
 * Worker thread.
 */
async function runWorker() {
  console.log("RUN INTERNAL WORKER");
  console.log("EXIT INTERNAL WORKER");
}