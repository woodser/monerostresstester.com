/**
 * Web worker to interact with a core wallet using messages.
 */
onmessage = function(e) {
  console.log("MoneroWalletCoreWorkerHelper.onmessage()!");
  console.log(e);
  
  if (e.data === "create_wallet_random") {
    postMessage("on_create_wallet_random");
  }
  if (e.data === "get_mnemonic") {
    postMessage("on_get_mnemonic");
  }
}

async function loadScripts() {
  console.log("loadScripts(");
  self.importScripts('monero-javascript-wasm.js');
  self.importScripts('worker_imports.js');
}