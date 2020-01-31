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
  
  // config
  let daemonRpcUri = "http://localhost:38081";
  let daemonRpcUsername = "superuser";
  let daemonRpcPassword = "abctesting123";
  let walletRpcUri = "http://localhost:38083";
  let mnemonic = "petals frown aerial leisure ruined needed pruned object misery items sober agile lopped galaxy mouth glide business sieve dizzy imitate ritual nucleus chlorine cottage ruined";
  let primaryAddress = "54tjXUgQVYNXQCJM4CatRQZMacZ2Awq4NboKiUYtUJrhgYZjiDhMz4ccuYRcMTno6V9mzKFXzfY8pbPnGmu2ukfWABV75k4";  // just for reference
  let restoreHeight = 501788;
  let daemonConnection = new MoneroRpcConnection({uri: daemonRpcUri, user: daemonRpcUsername, pass: daemonRpcPassword});
  
  // create a core wallet from mnemonic
  let walletCore = await MoneroWalletCoreWorker.createWalletFromMnemonic("abctesting123", MoneroNetworkType.STAGENET, mnemonic, daemonConnection, restoreHeight);
  assert.equal(await walletCore.getMnemonic(), mnemonic);
  assert.equal(await walletCore.getPrimaryAddress(), primaryAddress);
  console.log("Core wallet imported mnemonic: " + await walletCore.getMnemonic());
  console.log("Core wallet imported address: " + await walletCore.getPrimaryAddress());
  
  // synchronize core wallet
  console.log("Synchronizing core wallet...");
  let result = await walletCore.sync(new WalletSyncPrinter());               // synchronize and print progress
  console.log("Done synchronizing");
  console.log(result);
  
  // start background syncing with listener
  await walletCore.addListener(new WalletSendReceivePrinter()); // listen for and print send/receive notifications
  await walletCore.startSyncing();                              // synchronize in background
  
  // print balance and number of transactions
  console.log("Core wallet balance: " + await walletCore.getBalance());
  console.log("Core wallet number of txs: " + (await walletCore.getTxs()).length);
  
  // send transaction to self, listener will notify when output is received
  console.log("Sending transaction");
  let txSet = await walletCore.send(0, await walletCore.getPrimaryAddress(), new BigInteger("75000000000"));
  console.log("Transaction sent successfully");
  console.log(txSet.getTxs()[0].getHash());
  
//  // start old worker
//  var worker = new Worker('wallet_worker.js');
//  worker.postMessage("run_demo");
//  console.log('Message posted to worker');
//  worker.onmessage = function(e) {
//    console.log("Message received from worker: " + e.data);
//  }
  
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

/**
 * Print sync progress every X blocks.
 */
class WalletSendReceivePrinter extends MoneroWalletListener {
  
  constructor(blockResolution) {
    super();
  }

  onOutputReceived(output) {
    console.log("Wallet received output!");
    console.log(output.toJson());
  }
  
  onOutputSpent(output) {
    console.log("Wallet spent output!");
    console.log(output.toJson());
  }
}