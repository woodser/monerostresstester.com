/**
 * Implements a MoneroWallet by messaging a web worker which runs a core wallet.
 * 
 * TODO: extends MoneroWallet
 * TODO: sort these methods according to master sort in MoneroWallet.js
 */
class MoneroWalletCoreWorker extends MoneroWallet {
  
  static async createWalletRandom(path, password, networkType, daemonUriOrConnection, language) {
    
    // create a wallet worker
    let worker = new Worker("MoneroWalletCoreWorkerHelper.js");
    
    // return promise which resolves when worker creates wallet
    return new Promise(function(resolve, reject) {
      
      // listen worker to create wallet
      worker.onmessage = function(e) {
        if (e.data[0] === "onCreateWalletRandom") resolve(new MoneroWalletCoreWorker(worker));
      }
      
      // create wallet in worker
      let daemonUriOrConfig = daemonUriOrConnection instanceof MoneroRpcConnection ? daemonUriOrConnection.config : daemonUriOrConnection;
      worker.postMessage(["createWalletRandom"].concat([path, password, networkType, daemonUriOrConfig, language]));
    });
  }
  
  /**
   * Internal constructor which is given a worker to communicate with via messages.
   * 
   * This method should not be called externally but should be called through
   * static wallet creation utilities in this class.
   * 
   * @param {Worker} worker is a web worker to communicate with via messages
   */
  constructor(worker) {
    super();
    this.worker = worker;
    this.callbacks = {};
    let that = this;
    this.worker.onmessage = function(e) {
      that.callbacks[e.data[0]].apply(null, e.data.slice(1));
    }
  }
  
  /**
   * Get the wallet's network type (mainnet, testnet, or stagenet).
   * 
   * @return {MoneroNetworkType} the wallet's network type
   */
  async getNetworkType() {
    throw new Error("Not implemented");
  }
  
  async getVersion() {
    throw new Error("Not implemented");
  }
  
  getPath() {
    throw new Error("Not implemented");
  }
  
  async getMnemonic() {
    let that = this;
    return new Promise(function(resolve, reject) {
      that.callbacks["onGetMnemonic"] = function(mnemonic) { resolve(mnemonic); }
      that.worker.postMessage(["getMnemonic"]);
    });
  }
  
  async getMnemonicLanguage() {
    throw new Error("Not implemented");
  }
  
  async getMnemonicLanguages() {
    throw new Error("Not implemented");
  }
  
  async getPrivateSpendKey() {
    throw new Error("Not implemented");
  }
  
  async getPrivateViewKey() {
    throw new Error("Not implemented");
  }
  
  async getPublicViewKey() {
    throw new Error("Not implemented");
  }
  
  async getPublicSpendKey() {
    throw new Error("Not implemented");
  }
  
  async getAddress(accountIdx, subaddressIdx) {
    throw new Error("Not implemented");
  }
  
  async getAddressIndex(address) {
    throw new Error("Not implemented");
  }
  
  getAccounts() {
    throw new Error("Not implemented");
  }
  
  async setDaemonConnection(uriOrRpcConnection, username, password) {
    throw new Error("Not implemented");
  }
  
  /**
   * Get the wallet's daemon connection.
   * 
   * @return {MoneroRpcConnection} the wallet's daemon connection
   */
  async getDaemonConnection() {
    throw new Error("Not implemented");
  }
  
  /**
   * Indicates if the wallet is connected to daemon.
   * 
   * @return {boolean} true if the wallet is connected to a daemon, false otherwise
   */
  async isConnected() {
    throw new Error("Not implemented");
  }
  
  /**
   * Get the height of the first block that the wallet scans.
   * 
   * @return {number} the height of the first block that the wallet scans
   */
  async getRestoreHeight() {
    let that = this;
    return new Promise(function(resolve, reject) {
      that.callbacks["onGetRestoreHeight"] = function(restoreHeight) { resolve(restoreHeight); }
      that.worker.postMessage(["getRestoreHeight"]);
    });
  }
  
  /**
   * Set the height of the first block that the wallet scans.
   * 
   * @param {number} restoreHeight is the height of the first block that the wallet scans
   */
  async setRestoreHeight(restoreHeight) {
    throw new Error("Not implemented");
  }
  
  async getDaemonHeight() {
    throw new MoneroError("Not implemented");
  }
  
  /**
   * Get the maximum height of the peers the wallet's daemon is connected to.
   *
   * @return {number} the maximum height of the peers the wallet's daemon is connected to
   */
  async getDaemonMaxPeerHeight() {
    throw new Error("Not implemented");
  }
  
  /**
   * Indicates if the wallet's daemon is synced with the network.
   * 
   * @return {boolean} true if the daemon is synced with the network, false otherwise
   */
  async isDaemonSynced() {
    throw new Error("Not implemented");
  }
  
  async getHeight() {
    let that = this;
    return new Promise(function(resolve, reject) {
      that.callbacks["onGetHeight"] = function(height) { resolve(height); }
      that.worker.postMessage(["getHeight"]);
    });
  }
  
  /**
   * Indicates if the wallet is synced with the daemon.
   * 
   * @return {boolean} true if the wallet is synced with the daemon, false otherwise
   */
  async isSynced() {
    throw new Error("Not implemented");
  }
  
  async sync(listenerOrStartHeight, startHeight) {
    console.log("MoneroWalletCoreWorker.sync(...)");
    
    // normalize params
    startHeight = listenerOrStartHeight instanceof MoneroSyncListener ? startHeight : listenerOrStartHeight;
    let listener = listenerOrStartHeight instanceof MoneroSyncListener ? listenerOrStartHeight : undefined;
    if (startHeight === undefined) startHeight = Math.max(await this.getHeight(), await this.getRestoreHeight());
//    if (listener !== undefined) throw new Error("Listener in web worker wrapper not supported");
    
    // sync the wallet in worker
    let that = this;
    return new Promise(function(resolve, reject) {
      that.callbacks["onSync"] = function(result) { resolve(result); }
      that.worker.postMessage(["sync"]);
    });
  }
  
  async startSyncing() {
    throw new MoneroError("Not implemented");
  }
    
  async stopSyncing() {
    throw new MoneroError("Not implemented");
  }
  
  /**
   * Register a listener receive wallet notifications.
   * 
   * @param {MoneroWalletListener} listener is the listener to receive wallet notifications
   */
  async addListener(listener) {
    throw new Error("Not implemented");
  }
  
  /**
   * Unregister a listener to receive wallet notifications.
   * 
   * @param {MoneroWalletListener} listener is the listener to unregister
   */
  async removeListener(listener) {
    throw new Error("Not implemented");
  }
  
  /**
   * Get the listeners registered with the wallet.
   * 
   * @return {MoneroWalletListener[]} the registered listeners
   */
  getListeners() {
    throw new Error("Not implemented");
  }
  
  // rescanSpent
  // rescanBlockchain
  
  async getBalance(accountIdx, subaddressIdx) {
    throw new MoneroError("Not implemented");
  }
  
  async getUnlockedBalance(accountIdx, subaddressIdx) {
    throw new MoneroError("Not implemented");
  }
  
  async getAccounts(includeSubaddresses, tag) {
    throw new MoneroError("Not implemented");
  }
  
  async getAccount(accountIdx, includeSubaddresses) {
    throw new MoneroError("Not implemented");
  }
  
  async createAccount(label) {
    throw new MoneroError("Not implemented");
  }
  
  async getSubaddresses(accountIdx, subaddressIndices) {
    throw new MoneroError("Not implemented");
  }
  
  async createSubaddress(accountIdx, label) {
    throw new MoneroError("Not implemented");
  }
  
  async getTxs(query) {
    throw new MoneroError("Not implemented");
  }
  
  async getTransfers(query) {
    throw new MoneroError("Not implemented");
  }
  
  async getOutputs(query) {
    throw new MoneroError("Not implemented");
  }
  
  async getOutputsHex() {
    throw new MoneroError("Not implemented");
  }
  
  async importOutputsHex(outputsHex) {
    throw new MoneroError("Not implemented");
  }
  
  async getKeyImages() {
    throw new MoneroError("Not implemented");
  }
  
  async importKeyImages(keyImages) {
    throw new MoneroError("Not implemented");
  }
  
  async getNewKeyImagesFromLastImport() {
    throw new MoneroError("Not implemented");
  }
  
  async relayTxs(txsOrMetadatas) {
    throw new MoneroError("Not implemented");
  }
  
  async sendSplit(requestOrAccountIndex, address, amount, priority) {
    throw new MoneroError("Not implemented");
  }
  
  async sweepOutput(requestOrAddress, keyImage, priority) {
    throw new MoneroError("Not implemented");
  }

  async sweepUnlocked(request) {
    throw new MoneroError("Not implemented");
  }
  
  async sweepDust() {
    throw new MoneroError("Not implemented");
  }
  
  async sweepDust(doNotRelay) {
    throw new MoneroError("Not implemented");
  }
  
  async sign(message) {
    throw new MoneroError("Not implemented");
  }
  
  async verify(message, address, signature) {
    throw new MoneroError("Not implemented");
  }
  
  async getTxKey(txHash) {
    throw new MoneroError("Not implemented");
  }
  
  async checkTxKey(txHash, txKey, address) {
    throw new MoneroError("Not implemented");
  }
  
  async getTxProof(txHash, address, message) {
    throw new MoneroError("Not implemented");
  }
  
  async checkTxProof(txHash, address, message, signature) {
    throw new MoneroError("Not implemented");
  }
  
  async getSpendProof(txHash, message) {
    throw new MoneroError("Not implemented");
  }
  
  async checkSpendProof(txHash, message, signature) {
    throw new MoneroError("Not implemented");
  }
  
  async getReserveProofWallet(message) {
    throw new MoneroError("Not implemented");
  }
  
  async getReserveProofAccount(accountIdx, amount, message) {
    throw new MoneroError("Not implemented");
  }

  async checkReserveProof(address, message, signature) {
    throw new MoneroError("Not implemented");
  }
  
  async getTxNotes(txHashes) {
    throw new MoneroError("Not implemented");
  }
  
  async setTxNotes(txHashes, notes) {
    throw new MoneroError("Not implemented");
  }
  
  async getAddressBookEntries() {
    throw new MoneroError("Not implemented");
  }
  
  async getAddressBookEntries(entryIndices) {
    throw new MoneroError("Not implemented");
  }
  
  async addAddressBookEntry(address, description) {
    throw new MoneroError("Not implemented");
  }
  
  async addAddressBookEntry(address, description, paymentId) {
    throw new MoneroError("Not implemented");
  }
  
  async deleteAddressBookEntry(entryIdx) {
    throw new MoneroError("Not implemented");
  }
  
  async tagAccounts(tag, accountIndices) {
    throw new MoneroError("Not implemented");
  }

  async untagAccounts(accountIndices) {
    throw new MoneroError("Not implemented");
  }
  
  async getAccountTags() {
    throw new MoneroError("Not implemented");
  }

  async setAccountTagLabel(tag, label) {
    throw new MoneroError("Not implemented");
  }
  
  async createPaymentUri(request) {
    throw new MoneroError("Not implemented");
  }
  
  async parsePaymentUri(uri) {
    throw new MoneroError("Not implemented");
  }
  
  async getAttribute(key) {
    throw new MoneroError("Not implemented");
  }
  
  async setAttribute(key, val) {
    throw new MoneroError("Not implemented");
  }
  
  async startMining(numThreads, backgroundMining, ignoreBattery) {
    throw new MoneroError("Not implemented");
  }
  
  async stopMining() {
    throw new MoneroError("Not implemented");
  }
  
  async isMultisigImportNeeded() {
    throw new MoneroError("Not implemented");
  }
  
  async isMultisig() {
    throw new MoneroError("Not implemented");
  }
  
  async getMultisigInfo() {
    throw new MoneroError("Not implemented");
  }
  
  async prepareMultisig() {
    throw new MoneroError("Not implemented");
  }
  
  async makeMultisig(multisigHexes, threshold, password) {
    throw new MoneroError("Not implemented");
  }
  
  async exchangeMultisigKeys(multisigHexes, password) {
    throw new MoneroError("Not implemented");
  }
  
  async getMultisigHex() {
    throw new MoneroError("Not implemented");
  }
  
  async importMultisigHex(multisigHexes) {
    throw new MoneroError("Not implemented");
  }
  
  async signMultisigTxHex(multisigTxHex) {
    throw new MoneroError("Not implemented");
  }
  
  async submitMultisigTxHex(signedMultisigTxHex) {
    throw new MoneroError("Not implemented");
  }
  
  async isClosed() {
    throw new Error("Not implemented");
  }
  
  async close() {
    throw new Error("Not implemented");
  }
}

module.exports = MoneroWalletCoreWorker;