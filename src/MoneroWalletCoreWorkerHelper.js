/**
 * Web worker to interact with a core wallet using messages.
 */
onmessage = function(e) {
  console.log("MoneroWalletCoreWorkerHelper.onmessage()!");
  console.log(e);
  this[e.data[0]].apply(null, e.data.slice(1));
}

this.createWalletRandom = function() {
  console.log("wallet worker createWalletRandom");
  postMessage(["onCreateWalletRandom"]);
}

this.getMnemonic = function() {
  console.log("wallet worker getMnemonic");
  postMessage(["onGetMnemonic", "my mnemonic!"]);
}

async function loadScripts() {
  console.log("loadScripts(");
  self.importScripts('monero-javascript-wasm.js');
  self.importScripts('worker_imports.js');
}