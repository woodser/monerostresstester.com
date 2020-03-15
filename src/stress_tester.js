/**
 * Tx spammer to stress test the network.
 */
require("monero-javascript");

// detect if called from worker
let isWorker = self.document? false : true;
if (!isWorker) runMain();

/**
 * Main thread.
 */
async function runMain() {
  console.log("RUN MAIN");
  
  // config
  let daemonRpcUri = "http://localhost:38081";
  let daemonRpcUsername = "superuser";
  let daemonRpcPassword = "abctesting123";
  let walletRpcUri = "http://localhost:38083";
  let mnemonic = "goblet went maze cylinder stockpile twofold fewest jaded lurk rally espionage grunt aunt puffin kickoff refer shyness tether building eleven lopped dawn tasked toolbox grunt";
  let seedOffset = "";
  let restoreHeight = 531333;
  let proxyToWorker = true;   // proxy core wallet and daemon to worker so main thread is not blocked (recommended)
  let useFS = true;           // optionally save wallets to an in-memory file system, otherwise use empty paths
  let FS = useFS ? require('memfs') : undefined;  // use in-memory file system for demo
  
  // create a wallet from mnemonic
  let daemonConnection = new MoneroRpcConnection({uri: daemonRpcUri, user: daemonRpcUsername, pass: daemonRpcPassword});
  let walletCorePath = useFS ? GenUtils.uuidv4() : "";
  console.log("Creating core wallet" + (proxyToWorker ? " in worker" : "") + (useFS ? " at path " + walletCorePath : ""));
  let wallet = await MoneroWalletCore.createWalletFromMnemonic(walletCorePath, "abctesting123", MoneroNetworkType.STAGENET, mnemonic, daemonConnection, restoreHeight, seedOffset, proxyToWorker, FS); 
  console.log("Core wallet imported mnemonic: " + await wallet.getMnemonic());
  console.log("Core wallet imported address: " + await wallet.getPrimaryAddress());
  
  // synchronize wallet
  console.log("Synchronizing core wallet...");
  let result = await wallet.sync(new WalletSyncPrinter());  // synchronize and print progress
  console.log("Done synchronizing");
  console.log(result);
  
  // print balance and number of transactions
  console.log("Core wallet balance: " + await wallet.getBalance());
  console.log("Core wallet number of txs: " + (await wallet.getTxs()).length);
  
  // receive notifications when blocks are added to the chain
  await wallet.addListener(new class extends MoneroWalletListener {
    onNewBlock(height) {
      console.log("Block added: " + height);
      spendAvailableOutputs(wallet);
    }
  });
  
  // start background syncing
  await wallet.startSyncing();
  
  // spend available outputs
  await spendAvailableOutputs(wallet);
}

async function spendAvailableOutputs(wallet) {
  let outputs = await wallet.getOutputs({isLocked: false, isSpent: false});
  console.log("Wallet has " + outputs.length + " available outputs...");
}

/**
 * Print sync progress every X blocks.
 */
class WalletSyncPrinter extends MoneroWalletListener {
  
  constructor(blockResolution) {
    super();
    this.blockResolution = blockResolution ? blockResolution : 2500;
  }
  
  onSyncProgress(height, startHeight, endHeight, percentDone, message) {
    if (percentDone === 1 || (startHeight - height) % this.blockResolution === 0) {
      console.log("onSyncProgress(" + height + ", " + startHeight + ", " + endHeight + ", " + percentDone + ", " + message + ")");
    }
  }
}