/**
 * Implements a MoneroWallet by messaging a web worker which runs a core wallet.
 * 
 * TODO: extends MoneroWallet
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
  
  async getMnemonic() {
    console.log("MoneroWalletCoreWorker.getMnemonic()");
    let that = this;
    return new Promise(function(resolve, reject) {
      that.callbacks["onGetMnemonic"] = function(mnemonic) { resolve(mnemonic); }
      that.worker.postMessage(["getMnemonic"]);
    });
  }
  
  async sync(listenerOrStartHeight, startHeight) {
    console.log("MoneroWalletCoreWorker.sync(...)");
    
//    // normalize params
//    startHeight = listenerOrStartHeight instanceof MoneroSyncListener ? startHeight : listenerOrStartHeight;
//    let listener = listenerOrStartHeight instanceof MoneroSyncListener ? listenerOrStartHeight : undefined;
//    if (startHeight === undefined) startHeight = Math.max(await this.getHeight(), await this.getRestoreHeight());
//    if (listener !== undefined) throw new Error("Listener in web worker wrapper not supported");
    
    // sync the wallet in worker
    let that = this;
    return new Promise(function(resolve, reject) {
      that.callbacks["onSync"] = function(result) { resolve(result); }
      that.worker.postMessage(["sync"]);
    });
  }
}

module.exports = MoneroWalletCoreWorker;