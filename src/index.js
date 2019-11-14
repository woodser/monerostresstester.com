/**
 * Sample browser application which uses a JavaScript library to interact
 * with a Monero daemon using RPC and a Monero wallet using RPC and WASM
 * bindings.
 */

"use strict"

// imports
const assert = require("assert");
const MoneroJS = require("monero-javascript");
const MoneroDaemonRpc = MoneroJS.MoneroDaemonRpc;
const MoneroWalletWasm = MoneroJS.MoneroWalletWasm;
const MoneroWalletRpc = MoneroJS.MoneroWalletRpc;
//const MoneroWalletLocal = MoneroJS.MoneroWalletLocal;

// start the application
startApp();
async function startApp() {
  console.log("Starting app...");
  
  // connect to monero-daemon-rpc
  let daemon = new MoneroDaemonRpc({uri: "http://localhost:38081", user: "superuser", pass: "abctesting123"});
  console.log("Daemon height: " + await daemon.getHeight());
  
  // wallet config
  let mnemonic = "megabyte ghetto syllabus opposite firm january velvet kennel often bugs luggage nucleus volcano fainted ripped biology firm sushi putty swagger dove obedient unnoticed washing swagger";
  let firstReceiveHeight = 453289;
  
  // import wasm wallet which exports a promise in order to load the WebAssembly module
  const MoneroWalletWasm = await MoneroJS.MoneroWalletWasmPromise();
  
  // demonstrate wasm wallet
  let daemonConnection = new MoneroRpcConnection({uri: "http://localhost:38081", user: "superuser", pass: "abctesting123"});
  //let walletWasm = await MoneroWalletWasm.createWalletRandom("", "supersecretpassword123", MoneroNetworkType.STAGENET, daemonConnection, "English");
  let walletWasm = await MoneroWalletWasm.createWalletFromMnemonic("", "supersecretpassword123", MoneroNetworkType.STAGENET, mnemonic, daemonConnection, firstReceiveHeight);
  let result = await walletWasm.sync();
  console.log("WASM wallet created and synced");
  
  // print wallet info
  console.log("Wallet mnemonic: " + await walletWasm.getMnemonic());
  console.log("Wallet address: " + await walletWasm.getPrimaryAddress());
  console.log("Wallet balance: " + await walletWasm.getBalance());
  console.log("Wallet num txs: " + (await walletWasm.getTxs()).length);
  
//  let tx = await walletWasm.send(0, await walletWasm.getPrimaryAddress(), new BigInteger("75000000000"));
//  console.log("Sent tx");
//  console.log(tx.toJson());
//  console.log("Wallet balance: " + await walletWasm.getBalance());
  
  // demonstrate using core utilities through web assembly
  const MoneroCppUtils = await MoneroJS.MoneroCppUtilsPromise();
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
  MoneroCppUtils.dummyMethod(JSON.stringify(json));
  let binary = MoneroCppUtils.jsonToBinary(json);
  assert(binary);
  let json2 = MoneroCppUtils.binaryToJson(binary);
  assert.deepEqual(json2, json);
  console.log("Yep they were equal.");
  
//  // connect to monero-wallet-rpc
//  let walletRpc = new MoneroWalletRpc({uri: "http://localhost:38083", user: "rpc_user", pass: "abc123"});
//  
//  // wallet to open or create
//  let name = "test_wallet_1";
//  let password = "supersecretpassword123";
//  let mnemonic = "hefty value later extra artistic firm radar yodel talent future fungal nutshell because sanity awesome nail unjustly rage unafraid cedar delayed thumbs comb custom sanity";
//  let primaryAddress = "528qdm2pXnYYesCy5VdmBneWeaSZutEijFVAKjpVHeVd4unsCSM55CjgViQsK9WFNHK1eZgcCuZ3fRqYpzKDokqSKp4yp38";  // just for reference
//  let restoreHeight = 383338;
//  
//  // open or create wallet
//  try {
//    console.log("Attempting to open " + name);
//    await walletRpc.openWallet(name, password);
//  } catch (e) {
//        
//    // -1 returned when the wallet does not exist or it's open by another application
//    if (e.getCode() === -1) {
//      console.log("Wallet with name '" + name + "' not found, restoring from mnemonic");
//      
//      // create wallet
//      await walletRpc.createWalletFromMnemonic(name, password, mnemonic, restoreHeight);
//      await walletRpc.sync();
//    } else {
//      throw e;
//    }
//  }
//  
//  // print rpc wallet balance to the console
//  console.log("Wallet rpc mnemonic: " + await walletRpc.getMnemonic());
//  console.log("Wallet rpc balance: " + await walletRpc.getBalance());
//  
//  // create a wallet from mnemonic using local wasm bindings
//  let walletLocal = new MoneroWalletLocal({daemon: daemon, mnemonic: mnemonic});
//  console.log("Local wallet address: " + await walletLocal.getPrimaryAddress());
//  console.log("Local wallet height: " + await walletLocal.getHeight());
//  if (primaryAddress !== await walletLocal.getPrimaryAddress()) throw "Addresses do not match";
  
  // sync the wallet
//  await wallet.sync(undefined, function(progress) {
//    console.log(progress.percent);
//  });
//  console.log("Done syncing?");
  console.log("Done");
}