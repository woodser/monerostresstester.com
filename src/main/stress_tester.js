/**
 * Web app to stress test the Monero network by generating transactions.
 */

// import dependencies
require("monero-javascript");
const MoneroTxGenerator = require("./MoneroTxGenerator");

// configuration
const DAEMON_RPC_URI = "http://localhost:38081";
const DAEMON_RPC_USERNAME = "superuser";
const DAEMON_RPC_PASSWORD = "abctesting123";
const MNEMONIC = "goblet went maze cylinder stockpile twofold fewest jaded lurk rally espionage grunt aunt puffin kickoff refer shyness tether building eleven lopped dawn tasked toolbox grunt";
const SEED_OFFSET = "";
const RESTORE_HEIGHT = 531333;
const PROXY_TO_WORKER = true;   // proxy core wallet and daemon to worker so main thread is not blocked (recommended)
const USE_FS = true;            // optionally save wallets to an in-memory file system, otherwise use empty paths
const FS = USE_FS ? require('memfs') : undefined;  // use in-memory file system for demo

// run application on main thread
let isMain = self.document? true : false;
if (isMain) runApp();

/**
 * Run the application.
 */
async function runApp() {
  console.log("APPLICATION START");
  
  // connect to daemon 
  let daemonConnection = new MoneroRpcConnection({uri: DAEMON_RPC_URI, user: DAEMON_RPC_USERNAME, pass: DAEMON_RPC_PASSWORD});
  //let daemon = new MoneroDaemonRpc(daemonConnection.getConfig()); // TODO: support passing connection
  let daemon = await MoneroDaemonRpc.create(Object.assign({PROXY_TO_WORKER: PROXY_TO_WORKER}, daemonConnection.getConfig()));
  
  // create a wallet from mnemonic
  let path = USE_FS ? GenUtils.uuidv4() : "";
  console.log("Creating core wallet" + (PROXY_TO_WORKER ? " in worker" : "") + (USE_FS ? " at path " + path : ""));
  let wallet = await MoneroWalletCore.createWalletFromMnemonic(path, "abctesting123", MoneroNetworkType.STAGENET, MNEMONIC, daemonConnection, RESTORE_HEIGHT, SEED_OFFSET, PROXY_TO_WORKER, FS); 
  console.log("Core wallet imported mnemonic: " + await wallet.getMnemonic());
  console.log("Core wallet imported address: " + await wallet.getPrimaryAddress());
  
  // synchronize wallet
  console.log("Synchronizing core wallet...");
  let result = await wallet.sync(new WalletSyncPrinter());  // synchronize and print progress
  console.log("Done synchronizing");
  console.log(result);
  
  // print balance and number of transactions
  console.log("Core wallet balance: " + await wallet.getBalance());
  
//  // receive notifications when blocks are added to the chain
//  await wallet.addListener(new class extends MoneroWalletListener {
//    onNewBlock(height) {
//      console.log("Block added: " + height);
//      //spendAvailableOutputs(daemon, wallet);
//    }
//  });
  
  // start background syncing
  await wallet.startSyncing();
  
  // start generating transactions
  let txGenerator = new MoneroTxGenerator(daemon, wallet);
  console.log("Starting...");
  await txGenerator.start();
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