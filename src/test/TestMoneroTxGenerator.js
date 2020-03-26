/**
 * Tests the tx generator.
 */
class TestMoneroTxGenerator {
  
  constructor(config) {
    this.config = config;
  }
  
  /**
   * Run all tests.
   */
  runTests() {
    let that = this;
    let config = this.config;
    describe("TEST MONERO TX GENERATOR", function() {
      
      // initialize wallet before all tests
      before(async function() {
        try {
          that.wallet = await TestUtils.getWalletCore();
          that.daemon = await TestUtils.getDaemonRpc();
          TestUtils.TX_POOL_WALLET_TRACKER.reset(); // all wallets need to wait for txs to confirm to reliably sync
        } catch (e) {
          console.log(e);
          throw e;
        }
      });
      
      // -------------------------- TESTS ---------------------------
      
      it("Can generate txs", async function() {
        throw new Error("Not implemented");
      });
    });
  }
}

module.exports = TestMoneroTxGenerator;