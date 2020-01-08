/**
 * Sample browser application which uses a JavaScript library to interact
 * with a Monero daemon using RPC and a Monero wallet using RPC and WASM
 * bindings.
 */

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
