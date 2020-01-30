/**
 * Web worker to run a core wallet using messages.
 */
onmessage = function(e) {
  console.log("MoneroWalletCoreWorkerHelper.onmessage()!");
  console.log(e);
  self[e.data[0]].apply(null, e.data.slice(1));
}

self.createWalletRandom = async function(path, password, networkType, daemonUriOrConfig, language) {
  console.log("wallet worker createWalletRandom");
  
  // load scripts // TODO: load once, in a different place
  console.log("WORKER loading scripts and and module");
  self.importScripts('monero-javascript-wasm.js');
  self.importScripts('worker_imports.js');
  await MoneroUtils.loadWasmModule();
  console.log("done loading scripts and module");
  
  console.log("Creating wallet with password: " + password);
  
  // create the wallet
  let daemonUriOrConnection = new MoneroRpcConnection(daemonUriOrConfig);
  self.wallet = await MoneroWalletCore.createWalletRandom(path, password, networkType, daemonUriOrConnection, language);
  
  // notify wallet creation
  postMessage(["onCreateWalletRandom"]);
}

self.getMnemonic = async function() {
  console.log("wallet worker getMnemonic()");
  postMessage(["onGetMnemonic", await self.wallet.getMnemonic()]);
}

self.getRestoreHeight = async function() {
  console.log("wallet worker getRestoreHeight()");
  postMessage(["onGetRestoreHeight", await self.wallet.getRestoreHeight()]);
}
self.getHeight = async function() {
  console.log("wallet worker getHeight()");
  postMessage(["onGetHeight", await self.wallet.getHeight()]);
}

self.sync = async function() {
  console.log("wallet worker sync()");
  postMessage(["onSync", await self.wallet.sync()]);
}