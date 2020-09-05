const monerojs = require("monero-javascript");
const BigInteger = monerojs.BigInteger;
const MoneroUtils = monerojs.MoneroUtils;
const MoneroDestination = monerojs.MoneroDestination;
const MoneroTxConfig = monerojs.MoneroTxConfig;

// configuration
const MAX_OUTPUTS_PER_TX = 16;  // maximum outputs per tx
const MAX_OUTPUT_GROWTH = 40;   // avoid exponential growth of wallet's outputs by maximizing creation of new outputs until enough to stay busy, then sweeping individually

/**
 * Generates transactions on the Monero network using a wallet.
 */
class MoneroTxGenerator {

  constructor(daemon, wallet) {
    this.daemon = daemon;
    this.wallet = wallet;
    // Track the total number of transactions completed
    this.numTxsGenerated = 0;
    // Track the sum of all all cumulative transaction fees
    this.totalFee = new BigInteger(0);
    this.listeners = [];
  }

  async start() {
    if (this._isGenerating) throw new Error("Transaction generation already in progress");

    // create sufficient number of subaddresses in account 0 and 1
    let numSubaddresses = (await this.wallet.getSubaddresses(0)).length;
    if (numSubaddresses.length < MAX_OUTPUTS_PER_TX - 1) for (let i = 0; i < (MAX_OUTPUTS_PER_TX - 1 - numSubaddresses); i++) await this.wallet.createSubaddress(0);
    numSubaddresses = (await this.wallet.getSubaddresses(0)).length;
    if (numSubaddresses.length < MAX_OUTPUTS_PER_TX - 1) for (let i = 0; i < (MAX_OUTPUTS_PER_TX - 1 - numSubaddresses); i++) await this.wallet.createSubaddress(1);

    // start generation loop
    this._isGenerating = true;
    this._startGenerateLoop();
  }

  stop() {
    this._isGenerating = false;
  }

  isGenerating() {
    return this._isGenerating;
  }

  getNumTxsGenerated() {
    return this.numTxsGenerated;
  }

  getTotalFee() {
	return this.totalFee;
  }

  // Add an event listener to allow external classes to take actions in
  // response to each
  addTransactionListener(listener) {
    console.log("Adding a transaction listener");
    this.listeners.push(listener);
  }

  // ---------------------------- PRIVATE HELPERS -----------------------------

  async _startGenerateLoop() {
    while (true) {
      if (!this._isGenerating) break;

      // spend available outputs
      try {
        await this._spendAvailableOutputs();
      } catch (e) {
        console.log("Caught error in spendAvailableOuptuts()");
        console.log(e);
      }

      // sleep for a moment
      if (!this._isGenerating) break;
      await new Promise(function(resolve) { setTimeout(resolve, MoneroUtils.WALLET_REFRESH_RATE); });
    }
  }

  // Callback to notify requesting classes that a transaction occurred
  // and to provide those classes with transaction data and total number of
  // transactions up to this point
  onTransaction(tx) {
    console.log("onTransaction() was called!");
    for(let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](tx);
    }
  }

  async _spendAvailableOutputs() {

    console.log("Spending available outputs");

    // get available outputs
    let outputs = await this.wallet.getOutputs({isLocked: false, isSpent: false});
    console.log("Wallet has " + outputs.length + " available outputs");

    // avoid exponential growth of wallet's outputs by maximizing creation of new outputs until enough to stay busy, then sweeping individually
    let outputsToCreate = MAX_OUTPUT_GROWTH - outputs.length;

    // get fee with multiplier to be conservative
    let expectedFee = (await this.daemon.getFeeEstimate()).multiply(new BigInteger(1.2));

    // spend each available output
    for (let output of outputs) {

      // break if not generating
      if (!this._isGenerating) break;

      // split output to reach MAX_OUTPUT_GROWTH
      if (outputsToCreate > 0) {

        // skip if output is too small to cover fee
        let numDsts = Math.min(outputsToCreate, MAX_OUTPUTS_PER_TX - 1);
        expectedFee = expectedFee.multiply(new BigInteger(numDsts));
        expectedFee = expectedFee.multiply(new BigInteger(10));  // increase fee multiplier for multi-output txs   // TODO: improve fee estimation
        if (output.getAmount().compare(expectedFee) <= 0) continue;

        // build tx configuration
        let amtPerSubaddress = output.getAmount().divide(new BigInteger(2)).divide(new BigInteger(numDsts));  // amount to send per subaddress, one output used for change
        let dstAccount = output.getAccountIndex() === 0 ? 1 : 0;
        let destinations = [];
        for (let dstSubaddress = 0; dstSubaddress < numDsts; dstSubaddress++) {
          destinations.push(new MoneroDestination((await this.wallet.getSubaddress(dstAccount, dstSubaddress)).getAddress(), amtPerSubaddress)); // TODO: without getAddress(), obscure optional deref error, prolly from serializing in first step of monero_wallet_core::send_split
        }
        let config = new MoneroTxConfig({
          accountIndex: output.getAccountIndex(), 
          subaddressIndex: output.getSubaddressIndex(),
          destinations: destinations,
          relay: true
        });

        // attempt to send
        try {
          console.log("Sending multi-output tx");
          let tx = await this.wallet.createTx(config);
          this.numTxsGenerated++;
          this.totalFee = this.totalFee.add(tx.getFee());
          outputsToCreate -= numDsts;
          console.log("Sent tx id: " + tx.getHash());
          console.log(this.numTxsGenerated + "txs generated");
          console.log("Total fee: " + this.totalFee);

          // The transaction was successful, so fire the "onTransaction" event
          // to notify any classes that have submitted listeners that a new
          // transaction just took place and provide that class with transaction
          // data and total number of transactios up to this point
          this.onTransaction(tx);

        } catch (e) {
          console.log("Error creating multi-output tx: " + e.message);
        }
      }

      // otherwise sweep output
      else {
        let dstAccount = output.getAccountIndex() === 0 ? 1 : 0;
        let dstAddress = await this.wallet.getAddress(dstAccount, 0);
        if (output.getAmount().compare(expectedFee) <= 0) continue;
        try {
          console.log("Sending output sweep tx");
          let tx = await this.wallet.sweepOutput({
            address: dstAddress,
            keyImage: output.getKeyImage().getHex(),
            relay: true
          });
          this.numTxsGenerated++;
          this.totalFee = this.totalFee.add(tx.getFee());
          console.log("Sweep tx id: " + tx.getHash());
          console.log(this.numTxsGenerated + " txs generated");
          console.log("Total fee: " + this.totalFee);

          // The transaction was successful, so fire the "onTransaction" event
          // to notify any classes that have submitted listeners that a new
          // transaction just took place and provide that class with transaction
          // data and total number of transactios up to this point
          this.onTransaction(tx);

        } catch (e) {
          console.log("Error creating sweep tx: " + e.message);
        }
      }
    }
  }
}

module.exports = MoneroTxGenerator;
