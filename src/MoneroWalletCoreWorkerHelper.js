/**
 * Web worker to interact with a core wallet using messages.
 */
onmessage = function(e) {
  console.log("MoneroWalletCoreWorkerHelper.onmessage()!");
  console.log(e);
  this[e.data[0]].apply(null, e.data.slice(1));
}

this.create_wallet_random = function() {
  console.log("wallet worker create_wallet_random");
  postMessage(["on_create_wallet_random"]);
}

this.get_mnemonic = function() {
  console.log("wallet worker get_mnemonic");
  postMessage(["on_get_mnemonic", "my mnemonic!"]);
}

async function loadScripts() {
  console.log("loadScripts(");
  self.importScripts('monero-javascript-wasm.js');
  self.importScripts('worker_imports.js');
}