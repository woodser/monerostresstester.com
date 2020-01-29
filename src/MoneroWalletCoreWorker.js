/**
 * Implements a MoneroWallet by wrapping a web worker to interact with a core wallet using messages.
 * 
 * TODO: extends MoneroWallet
 */
class MoneroWalletCoreWorker extends MoneroWallet {
  
  static async createWalletRandom(path, password, networkType, daemonUriOrConnection, language) {
    return new Promise(function(resolve, reject) {

      // create a wallet worker
      let worker = new Worker("MoneroWalletCoreWorkerHelper.js");
      
      // receive messages from worker
      worker.onmessage = function(e) {
        if (e.data[0] === "on_create_wallet_random") {
          resolve(new MoneroWalletCoreWorker(worker));
        }
      }
      
      // create wallet in worker
      worker.postMessage(["create_wallet_random"]);
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
      that.callbacks["on_get_mnemonic"] = function(mnemonic) {
        console.log("resolving with mnemonic: " + mnemonic);
        resolve(mnemonic);
      }
      that.worker.postMessage(["get_mnemonic"]);
    });
  }
}

module.exports = MoneroWalletCoreWorker;