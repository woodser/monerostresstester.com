/**
 * Sample browser application which uses a JavaScript library to interact
 * with a Monero daemon using RPC and a Monero wallet using RPC and WASM
 * bindings.
 */

"use strict"

const assert = require("assert");
const MoneroJS = require("monero-javascript");
const MoneroDaemonRpc = MoneroJS.MoneroDaemonRpc;
const MoneroWalletRpc = MoneroJS.MoneroWalletRpc;
const MoneroWalletKeys = MoneroJS.MoneroWalletKeys;
const MoneroWalletCore = MoneroJS.MoneroWalletCore;

// start the application
startApp();
async function startApp() {
  console.log("Starting app...");
  
  // demonstrate c++ utilities which use monero-project via webassembly
  const MoneroCppUtils = await MoneroJS.getMoneroUtilsWasm();
  let json = { msg: "This text will be serialized to and from Monero's portable storage format!" };
  let binary = MoneroCppUtils.jsonToBinary(json);
  assert(binary);
  let json2 = MoneroCppUtils.binaryToJson(binary);
  assert.deepEqual(json2, json);
  console.log("C++ utils to serialize to/from Monero\'s portable storage format working");
  
  // create a random keys-only wallet
  let walletKeys = await MoneroWalletKeys.createWalletRandom(MoneroNetworkType.STAGENET, "English");
  console.log("Keys-only wallet random mnemonic: " + await walletKeys.getMnemonic());

  // create a keys-only wallet from mnemonic
  let mnemonic = "megabyte ghetto syllabus opposite firm january velvet kennel often bugs luggage nucleus volcano fainted ripped biology firm sushi putty swagger dove obedient unnoticed washing swagger";
  let primaryAddress = "58De3pTCy1CFkh2xwTDCPwiTzkby13CZfJ262vak9nmuSUAbayvYnXaJY7WNGJMJCMBdFn4opqYCrVP3rP3irUZyDMht94C";  // just for reference
  walletKeys = await MoneroWalletKeys.createWalletFromMnemonic(MoneroNetworkType.STAGENET, mnemonic);
  assert.equal(await walletKeys.getMnemonic(), mnemonic);
  assert.equal(await walletKeys.getPrimaryAddress(), primaryAddress);
  console.log("Keys-only wallet imported mnemonic: " + await walletKeys.getMnemonic());
  console.log("Keys-only wallet imported address: " + await walletKeys.getPrimaryAddress());
  
  // connect to monero-daemon-rpc
  console.log("Connecting to monero-daemon-rpc...");
  let daemon = new MoneroDaemonRpc({uri: "http://localhost:38081", user: "superuser", pass: "abctesting123"});
  console.log("Daemon height: " + await daemon.getHeight());
  
  // connect to monero-wallet-rpc
  let walletRpc = new MoneroWalletRpc({uri: "http://localhost:38083", user: "rpc_user", pass: "abc123"});
  
  // configure the rpc wallet to open or create
  let name = "test_wallet_1";
  let password = "supersecretpassword123";
  let restoreHeight = 453289;
  
  // open or create rpc wallet
  try {
    console.log("Attempting to open wallet " + name + "...");
    await walletRpc.openWallet(name, password);
  } catch (e) {
    console.log(e);
        
    // -1 returned when the wallet does not exist or it's open by another application
    if (e.getCode() === -1) {
      console.log("Wallet with name '" + name + "' not found, restoring from mnemonic");
      
      // create wallet
      await walletRpc.createWalletFromMnemonic(name, password, mnemonic, restoreHeight);
      await walletRpc.sync();
    } else {
      throw e;
    }
  }
  
  // print rpc wallet balance
  console.log("Wallet rpc mnemonic: " + await walletRpc.getMnemonic());
  console.log("Wallet rpc balance: " + await walletRpc.getBalance());
  
//  // create a random core wallet
//  let daemonConnection = new MoneroRpcConnection({uri: "http://localhost:38081", user: "superuser", pass: "abctesting123"});  // TODO: support 3 strings, "pass" should probably be renamed to "password" 
//  let walletCore = await MoneroWalletCore.createWalletRandom("", "supersecretpassword123", MoneroNetworkType.STAGENET, daemonConnection, "English");
//  console.log("Core wallet random mnemonic: " + await walletCore.getMnemonic());
//
//  // create a core wallet from mnemonic
//  walletCore = await MoneroWalletCore.createWalletFromMnemonic("", "supersecretpassword123", MoneroNetworkType.STAGENET, mnemonic, daemonConnection, restoreHeight);
//  assert.equal(await walletCore.getMnemonic(), mnemonic);
//  assert.equal(await walletCore.getPrimaryAddress(), primaryAddress);
//  console.log("Core wallet imported mnemonic: " + await walletKeys.getMnemonic());
//  console.log("Core wallet imported address: " + await walletKeys.getPrimaryAddress());
    
//  // import wasm wallet which exports a promise in order to load the WebAssembly module
//  const MoneroWalletWasm = await require("../src/main/js/wallet/MoneroWalletWasm")();
//  
//  let firstReceiveHeight = 453289;
//  
//  // demonstrate wasm wallet
//  let daemonConnection = new MoneroRpcConnection({uri: "http://localhost:38081", user: "superuser", pass: "abctesting123"});  // TODO: support 3 strings, "pass" should probably be renamed to "password" 
//  let walletWasm = await MoneroWalletWasm.createWalletRandom("", "supersecretpassword123", MoneroNetworkType.STAGENET, daemonConnection, "English");
//  console.log("Created random wallet!");
//  walletWasm = await MoneroWalletWasm.createWalletFromMnemonic("", "supersecretpassword123", MoneroNetworkType.STAGENET, mnemonic, daemonConnection, firstReceiveHeight);
//  console.log("Restored wallet from seed!");
//  let result = await walletWasm.sync();
//  console.log("index.js received sync result");
//  console.log(result);
//  let height = await walletWasm.getHeight();
//  console.log("index.js received height result");
//  console.log(result);
//  console.log("WASM wallet created");
//  walletWasm.dummyMethod();
  
  // sync the wallet
//  await wallet.sync(undefined, function(progress) {
//    console.log(progress.percent);
//  });
//  console.log("Done syncing?");
  
  console.log("DONE");
}