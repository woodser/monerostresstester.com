/**
 * Web worker to interact with a core wallet using messages.
 */
onmessage = function(e) {
  console.log("MoneroWalletCoreWorkerHelper.onmessage()!");
  console.log(e);
  this[e.data[0]].apply(null, e.data.slice(1));
}

this.createWalletRandom = async function() {
  console.log("wallet worker createWalletRandom");
  
  // load scripts // TODO: load once
  console.log("WORKER loading scripts and and module");
  self.importScripts('monero-javascript-wasm.js');
  self.importScripts('worker_imports.js');
  await MoneroUtils.loadWasmModule();
  console.log("done loading scripts and module");
  
  // demonstrate c++ utilities which use monero-project via webassembly
  let json = { msg: "This text will be serialized to and from Monero's portable storage format!" };
  let binary = MoneroUtils.jsonToBinary(json);
  let json2 = MoneroUtils.binaryToJson(binary);
  console.log(json);
  console.log(json2);
  console.log("WASM utils to serialize to/from Monero\'s portable storage format working");
  
  postMessage(["onCreateWalletRandom"]);
}

this.getMnemonic = async function() {
  console.log("wallet worker getMnemonic");
  postMessage(["onGetMnemonic", "my mnemonic!"]);
}
