/**
 * Implements a MoneroWallet by wrapping a web worker to interact with a core wallet using messages.
 * 
 * TODO: extends MoneroWallet
 */
class MoneroWalletCoreWorker {
  
  static async createWalletRandom(path, password, networkType, daemonUriOrConnection, language) {
    return new Promise(function(resolve, reject) {

      // create a wallet worker
      let worker = new Worker("MoneroWalletCoreWorkerHelper.js");
      
      // receive messages from worker
      worker.onmessage = function(e) {
        if (e.data === "on_create_wallet_random") {
          resolve(new MoneroWalletCoreWorker(worker));
        }
      }
      
      // create wallet in worker
      worker.postMessage("create_wallet_random");
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
    this.worker = worker;
    this.worker.onmessage = this._onWorkerPostMessage;
  }
  
  async getMnemonic() {
    console.log("MoneroWalletCoreWorker.getMnemonic()");
    this.worker.postMessage("get_mnemonic");
    throw new Error("Not implemented");
  }
  
  _onWorkerPostMessage(e) {
    console.log("MoneroWalletCoreWorker received message!");
    console.log(e);
  }
}

module.exports = MoneroWalletCoreWorker;