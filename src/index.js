/**
 * Sample browser application which uses a JavaScript library to interact
 * with a Monero daemon using RPC and a Monero wallet using RPC and WASM
 * bindings.
 */

require("monero-javascript");
const MoneroWalletCoreWorker = require("./MoneroWalletCoreWorker");

//"use strict"

// detect if called from worker
console.log("ENTER INDEX.JS");
let isWorker = self.document? false : true;
console.log("IS WORKER: " + isWorker);
if (isWorker) {
  //self.importScripts('monero-javascript-wasm.js');  // TODO: necessary to avoid worker.js onmessage() captured an uncaught exception: ReferenceError: monero_javascript is not defined
  runWorker();
} else {
  runMain();
}

/**
 * Main thread.
 */
async function runMain() {
  console.log("RUN MAIN");
  
  // start a core wallet worker
  let protocol = "http";
  let host = "localhost";
  //let host = "127.0.0.1";
  let daemonConnection = new MoneroRpcConnection({uri: protocol + "://" + host + ":38081", user: "superuser", pass: "abctesting123"});  // TODO: support 3 strings, "pass" should probably be renamed to "password"
  let walletCoreWorker = await MoneroWalletCoreWorker.createWalletRandom("", "abctesting123", MoneroNetworkType.STAGENET, daemonConnection);
  let mnemonic = await walletCoreWorker.getMnemonic();
  console.log("Got mnemonic from wallet worker: " + mnemonic);
  let syncResult = await walletCoreWorker.sync(new WalletSyncPrinter());
  console.log("Done syncing!!!");
  console.log(syncResult);
  
  // start old worker
  var worker = new Worker('wallet_worker.js');
  worker.postMessage("run_demo");
  console.log('Message posted to worker');
  worker.onmessage = function(e) {
    console.log("Message received from worker: " + e.data);
  }
  
  console.log("EXIT MAIN");
}

/**
 * Worker thread.
 */
async function runWorker() {
  console.log("RUN INTERNAL WORKER");
  console.log("EXIT INTERNAL WORKER");
}

/**
 * Print sync progress every X blocks.
 */
class WalletSyncPrinter extends MoneroWalletListener {
  
  constructor(blockResolution) {
    super();
    this.blockResolution = blockResolution ? blockResolution : 2500;
  }
  
  onSyncProgress(height, startHeight, endHeight, percentDone, message) {
    if (percentDone === 1 || (startHeight - height) % this.blockResolution === 0) {
      console.log("onSyncProgress(" + height + ", " + startHeight + ", " + endHeight + ", " + percentDone + ", " + message + ")");
    }
  }
}
