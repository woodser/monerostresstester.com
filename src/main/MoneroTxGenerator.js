
// configuration
const MAX_OUTPUTS_PER_TX = 16;      // maximum outputs per tx
const MAX_AVAILABLE_OUTPUTS = 20;  // max new outputs to create until wallet sweeps each output

/**
 * Generates transactions on the Monero network using a wallet.
 */
class MoneroTxGenerator {
  
  constructor(daemon, wallet) {
    this.daemon = daemon;
    this.wallet = wallet;
    this.numTxsGenerated = 0;
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
    await this._startGenerateLoop();
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
  
  // ---------------------------- PRIVATE HELPERS -----------------------------
  
  async _startGenerateLoop() {
    while (true) {
      if (!this._isGenerating) break;
      
      // spend available outputs
      await this._spendAvailableOutputs(this.daemon, this.wallet);
      
      // sleep for a moment
      await new Promise(function(resolve) { setTimeout(resolve, MoneroUtils.WALLET_REFRESH_RATE); });
    }
  }
  
  async _spendAvailableOutputs() {
    
    console.log("Spending available outputs");
    
    // get available outputs
    let outputs = await this.wallet.getOutputs({isLocked: false, isSpent: false});
    
    console.log("Got " + outputs.length + " available outputs");
    
    // create additional outputs until enough are available to stay busy
    let outputsToCreate = MAX_AVAILABLE_OUTPUTS - outputs.length;
    console.log(outputsToCreate > 0 ? outputsToCreate + " remaining outputs to create" : "Not creating new outputs, sweeping existing");
    
    // get fee with multiplier to be conservative
    let expectedFee = await this.daemon.getFeeEstimate();
    expectedFee = expectedFee.multiply(BigInteger.parse("1.2"));
    
    // spend each available output
    for (let output of outputs) {
      
      // break if not generating
      if (!this._isGenerating) break;
      
      // skip if output is too small to cover fee
      if (output.getAmount().compare(expectedFee) <= 0) continue;
      
      // split output until max available outputs reached
      if (outputsToCreate > 0) {
        
        // build send request
        let request = new MoneroSendRequest().setAccountIndex(output.getAccountIndex()).setSubaddressIndex(output.getSubaddressIndex());            // source from output subaddress
        let numDsts = Math.min(outputsToCreate, MAX_OUTPUTS_PER_TX - 1);
        let amtPerSubaddress = output.getAmount().subtract(expectedFee).divide(new BigInteger(numDsts));  // amount to send per subaddress, one output used for change
        let dstAccount = output.getAccountIndex() === 0 ? 1 : 0;
        let destinations = [];
        for (let dstSubaddress = 0; dstSubaddress < numDsts; dstSubaddress++) {
          destinations.push(new MoneroDestination((await this.wallet.getSubaddress(dstAccount, dstSubaddress)).getAddress(), amtPerSubaddress)); // TODO: without getAddress(), obscure optional deref error, prolly from serializing in first step of monero_wallet_core::send_split
        }
        request.setDestinations(destinations);
        
        // attempt to send
        try {
          let tx = (await this.wallet.send(request)).getTxs()[0];
          this.numTxsGenerated++;
          outputsToCreate -= numDsts;
          console.log("Sent tx id: " + tx.getHash());
          console.log(this.numTxsGenerated + "txs generated");
        } catch (e) {
          console.log("Error creating tx: " + e.message);
        }
      }
      
      // otherwise sweep output
      else {
        let dstAccount = output.getAccountIndex() === 0 ? 1 : 0;
        let dstAddress = await this.wallet.getAddress(dstAccount, 0);
        try {
          let tx = (await this.wallet.sweepOutput(dstAddress, output.getKeyImage().getHex())).getTxs()[0];
          this.numTxsGenerated++;
          console.log("Sweep tx id: " + tx.getHash());
          console.log(this.numTxsGenerated + " txs generated");
        } catch (e) {
          console.log("Error creating tx: " + e.message);
        }
      }
    }
  }
}

module.exports = MoneroTxGenerator;