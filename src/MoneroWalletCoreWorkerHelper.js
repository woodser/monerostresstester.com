/**
 * Web worker to run a core wallet using messages.
 */
onmessage = async function(e) {
  await self.initOneTime();
  self[e.data[0]].apply(null, e.data.slice(1));
}

self.initOneTime = async function() {
  if (!self.isInitialized) {
    self.isInitialized = true;
    console.log("WORKER loading scripts and module");
    self.importScripts('monero-javascript-wasm.js');
    self.importScripts('worker_imports.js');
    await MoneroUtils.loadWasmModule();
    console.log("done loading scripts and module");
  }
}

self.createWalletRandom = async function(password, networkType, daemonUriOrConfig, language) {
  let daemonConnection = new MoneroRpcConnection(daemonUriOrConfig);
  self.wallet = await MoneroWalletCore.createWalletRandom("", password, networkType, daemonConnection, language);
  postMessage(["onCreateWalletRandom"]);
}

self.createWalletFromMnemonic = async function(password, networkType, mnemonic, daemonUriOrConfig, restoreHeight, seedOffset) {
  let daemonConnection = new MoneroRpcConnection(daemonUriOrConfig);
  self.wallet = await MoneroWalletCore.createWalletFromMnemonic("", password, networkType, mnemonic, daemonConnection, restoreHeight, seedOffset);
  postMessage(["onCreateWalletFromMnemonic"]);
}

self.getMnemonic = async function() {
  postMessage(["onGetMnemonic", await self.wallet.getMnemonic()]);
}

self.getAddress = async function(accountIdx, subaddressIdx) {
  postMessage(["onGetAddress", await self.wallet.getAddress(accountIdx, subaddressIdx)]);
}

self.getRestoreHeight = async function() {
  postMessage(["onGetRestoreHeight", await self.wallet.getRestoreHeight()]);
}

self.getHeight = async function() {
  postMessage(["onGetHeight", await self.wallet.getHeight()]);
}

self.addListener = async function(listenerId) {
  
  /**
   * Internal listener to bridge notifications to external listeners.
   * 
   * TODO: MoneroWalletListener is not defined until scripts imported
   */
  class WalletWorkerHelperListener extends MoneroWalletListener {
    
    constructor(id, worker) {
      super();
      this.id = id;
      this.worker = worker;
    }
    
    getId() {
      return this.id;
    }
    
    onSyncProgress(height, startHeight, endHeight, percentDone, message) {
      this.worker.postMessage(["onSyncProgress_" + this.getId(), height, startHeight, endHeight, percentDone, message]);
    }

    onNewBlock(height) { 
      this.worker.postMessage(["onNewBlock_" + this.getId(), height]);
    }

    onOutputReceived(output) {
      this.worker.postMessage(["onOutputReceived_" + this.getId(), output]);  // TODO: serialize from block, deserialize in MoneroWalletCore
    }
    
    onOutputSpent(output) {
      this.worker.postMessage(["onOutputSpent_" + this.getId(), output]);
    }
  }
  
  let listener = new WalletWorkerHelperListener(listenerId, self);
  if (!self.listeners) self.listeners = [];
  self.listeners.push(listener);
  await self.wallet.addListener(listener);
}

self.removeListener = async function(listenerId) {
  for (let i = 0; i < self.listeners.length; i++) {
    if (self.listeners[i].getId() !== listenerId) continue;
    await self.wallet.removeListener(self.listeners[i]);
    self.listeners.splice(i, 1);
    return;
  }
  throw new MoneroError("Listener is not registered to wallet");
}

self.sync = async function() {
  postMessage(["onSync", await self.wallet.sync()]);
}

self.startSyncing = async function() {
  postMessage(["onStartSyncing", await self.wallet.startSyncing()]);
}

self.stopSyncing = async function() {
  postMessage(["onStopSyncing", await self.wallet.stopSyncing()]);
}

self.getBalance = async function() {
  postMessage(["onGetBalance", await self.wallet.getBalance()]);
}

self.getUnlockedBalance = async function() {
  postMessage(["onGetUnlockedBalance", await self.wallet.getUnlockedBalance()]);
}

self.getTxs = async function(query) {
  postMessage(["onGetTxs", await self.wallet.getTxs(query)]);
}

self.sendSplit = async function(requestOrAccountIndex, address, amount, priority) {
  postMessage(["onSendSplit", await self.wallet.sendSplit(requestOrAccountIndex, address, amount, priority)]);
}