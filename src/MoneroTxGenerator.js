
// configuration
const MAX_OUTPUTS = 300;        // maximum outputs to create per wallet
const MAX_OUTPUTS_PER_TX = 16;  // maximum outputs per tx

/**
 * Generates transactions on the Monero network using a wallet.
 */
class MoneroTxGenerator {
  
  constructor(wallet) {
    this.setWallet(wallet);
  }
  
  setWallet(wallet) {
    this.wallet = wallet;
  }
  
  getWallet() {
    return this.wallet;
  }
  
  start() {
    if (this._isGenerating) throw new Error("Transaction generation already in progress");
    this._isGenerating = true;
    this._startGenerateLoop();
  }
  
  stop() {
    this._isGenerating = false;
  }
  
  isGenerating() {
    return this._isGenerating;
  }
  
  async _startGenerateLoop() {
    while (true) {
      if (!this._isGenerating) break;
      throw new Error("Not implemented");
    }
  }
}

async function spendAvailableOutputs(daemon, wallet) {
  let outputs = await wallet.getOutputs({isLocked: false, isSpent: false});
  console.log("Wallet has " + outputs.length + " available outputs...");
  for (let output of outputs) {
    let expectedFee = await daemon.getFeeEstimate();
    expectedFee = expectedFee.multiply(BigInteger.parse("1.2"));  // fee multiplier to conservatively cover fees
    if (output.getAmount().compare(expectedFee) > 0) {
      
      // build send request
      let request = new MoneroSendRequest().setAccountIndex(output.getAccountIndex()).setSubaddressIndex(output.getSubaddressIndex());  // source from output subaddress
      let amtPerSubaddress = output.getAmount().subtract(expectedFee).divide(new BigInteger(MAX_OUTPUTS_PER_TX - 1));                          // amount to send per subaddress, one output used for change
      let dstAccount = output.getAccountIndex() === 0 ? 1 : 0;
      let destinations = [];
      for (let dstSubaddress = 0; dstSubaddress < MAX_OUTPUTS_PER_TX - 1; dstSubaddress++) {
        destinations.push(new MoneroDestination((await wallet.getSubaddress(dstAccount, dstSubaddress)).getAddress(), amtPerSubaddress)); // TODO: without getAddress(), obscure optional deref error, prolly from serializing in first step of monero_wallet_core::send_split
      }
      request.setDestinations(destinations);
      //request.setDoNotRelay(true);
      
      // attempt to send
      try {
        let tx = (await wallet.send(request)).getTxs()[0];
        console.log("Gonna send tx id: " + tx.getHash());
      } catch (e) {
        console.log("Error creating tx: " + e.message);
      }
    } else {
      //console.log("Output is too small to cover fee");
    }
  }
}

module.exports = MoneroTxGenerator;