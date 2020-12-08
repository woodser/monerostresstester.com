/**
 * Event listener for MoneroTxGenerator.
 */
class MoneroTxGeneratorListener {
    
  /**
   * Notified on tx generator messages.
   * 
   * @param {string} msg - message from the tx generator
   */
  onMessage(msg) { }
  
  /**
   * Notified when a tx is generated.
   * 
   * @param tx - transaction that was generated
   * @param numTxsGenerated - total number of transactions generated
   * @param totalFees - total miner fees as a result of transaction generation
   * @param numSplitOutputs - number of new outputs created from splitting
   */
  onTransaction(tx, numTxsGenerated, totalFees, numSplitOutputs) { }
  
  /**
   * Notified when num blocks to unlock updated.
   */
  onNumBlocksToUnlock(numBlocksToNextUnlock, numBlocksToLastUnlock) { }
}

module.exports = MoneroTxGeneratorListener;
