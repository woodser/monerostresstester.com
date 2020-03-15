/**
 * Tx spammer to stress test the network.
 */
require("monero-javascript");

// detect if called from worker
let isWorker = self.document? false : true;
if (!isWorker) runMain();

const MAX_OUTPUTS = 16; // maximum number of outputs per tx

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
  
  // connect to daemon 
  let daemonConnection = new MoneroRpcConnection({uri: daemonRpcUri, user: daemonRpcUsername, pass: daemonRpcPassword});
  let daemon = new MoneroDaemonRpc(daemonConnection.getConfig()); // TODO: support passing connection
  
  // create a wallet from mnemonic
  let path = useFS ? GenUtils.uuidv4() : "";
  console.log("Creating core wallet" + (proxyToWorker ? " in worker" : "") + (useFS ? " at path " + path : ""));
  let wallet = await MoneroWalletCore.createWalletFromMnemonic(path, "abctesting123", MoneroNetworkType.STAGENET, mnemonic, daemonConnection, restoreHeight, seedOffset, proxyToWorker, FS); 
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
  
  // create sufficient number of subaddresses in account 0 and 1
  let numSubaddresses = (await wallet.getSubaddresses(0)).length;
  if (numSubaddresses.length < MAX_OUTPUTS - 1) for (let i = 0; i < (MAX_OUTPUTS - 1 - numSubaddresses); i++) await wallet.createSubaddress(0);
  numSubaddresses = (await wallet.getSubaddresses(0)).length;
  if (numSubaddresses.length < MAX_OUTPUTS - 1) for (let i = 0; i < (MAX_OUTPUTS - 1 - numSubaddresses); i++) await wallet.createSubaddress(1);
  await wallet.save();
  
  // receive notifications when blocks are added to the chain
  await wallet.addListener(new class extends MoneroWalletListener {
    onNewBlock(height) {
      console.log("Block added: " + height);
      spendAvailableOutputs(daemon, wallet);
    }
  });
  
  // start background syncing
  await wallet.startSyncing();
  
  // spend available outputs
  await spendAvailableOutputs(daemon, wallet);
}

async function spendAvailableOutputs(daemon, wallet) {
  let outputs = await wallet.getOutputs({isLocked: false, isSpent: false});
  console.log("Wallet has " + outputs.length + " available outputs...");
  for (let output of outputs) {
    if (output.getAmount().compare(expectedFee) > 0) {
      let expectedFee = await daemon.getFeeEstimate();
      
      // build send request
      let request = new MoneroSendRequest().setAccountIndex(output.getAccountIndex()).setSubaddressIndex(output.getSubaddressIndex());  // source from output subaddress
      let amtPerSubaddress = output.getAmount().subtract(expectedFee).divide(new BigInteger(MAX_OUTPUTS - 1));                          // amount to send per subaddress, one output used for change
      let dstAccount = output.getAccountIndex() === 0 ? 1 : 0;
      let destinations = [];
      for (let dstSubaddress = 0; dstSubaddress < MAX_OUTPUTS - 1; dstSubaddress++) {
        destinations.push(new MoneroDestination((await wallet.getSubaddress(dstAccount, dstSubaddress)).getAddress(), amtPerSubaddress)); // TODO: without getAddress(), obscure optional deref error, prolly from serializing in first step of monero_wallet_core::send_split
      }
      request.setDestinations(destinations);
      request.setDoNotRelay(true);
      
      // attempt to send
      try {
        let tx = (await wallet.createTx(request)).getTxs()[0];
        console.log("Gonna send tx id: " + tx.getId());
      } catch (e) {
        console.log("Error creating tx: " + e.message);
      }
    } else {
      //console.log("Output is too small to cover fee");
    }
  }
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