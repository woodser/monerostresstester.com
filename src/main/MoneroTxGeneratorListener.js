/**
 * Event listener for MoneroTxGenerator.
 */
class MoneroTxGeneratorListener {
    
    /**
     * Notified when a new transaction is generated.
     * 
     * @param tx - transaction that was generated
     * @param balance - wallet's balance after the transaction was generated
     * @param unlockedBalance - wallet's unlocked balance after the transaction was generated
     * @param numTxsGenerated - total number of transactions generated
     * @param totalFees - total miner fees as a result of transaction generation
     * @param numSplitOutputs - number of new outputs created from splitting
     * @param numBlocksToNextUnlock - number of blocks until next funds are available
     * @param numBlocksToLastUnlock - number of blocks until all funds are available
     */
    onTransaction(tx, balance, unlockedBalance, numTxsGenerated, totalFees, numSplitOutputs, numBlocksToNextUnlock, numBlocksToLastUnlock) { }
    
    /**
     * Notified when the wallet's block height updates.
     *
     * @param height - the wallet's new block height
     * @param balance - wallet's balance
     * @param unlockedBalance - wallet's unlocked balance after the new block
     * @param numBlocksToNextUnlock - number of blocks until next funds are available
     * @param numBlocksToLastUnlock - number of blocks until all funds are available
     */
    onNewBlock(height, balance, unlockedBalance, numBlocksToNextUnlock, numBlocksToLastUnlock) { }
}

module.exports = MoneroTxGeneratorListener;
