/**
 * Sample browser application which uses a JavaScript library to interact
 * with a Monero daemon using RPC and a Monero wallet using RPC and WASM
 * bindings.
 */
require("monero-javascript");

//"use strict"

// detect if called from worker
console.log("ENTER INDEX.JS");
let isWorker = self.document? false : true;
console.log("IS WORKER: " + isWorker);
if (isWorker) {
  //self.importScripts('monero-javascript-wasm.js');  // TODO: necessary to avoid worker.js onmessage() captured an uncaught exception: ReferenceError: monero_javascript is not defined
  runWorker();
} else {
  runMain();
}

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
  let walletRpcUsername = "rpc_user";
  let walletRpcPassword = "abc123";
  let mnemonic = "petals frown aerial leisure ruined needed pruned object misery items sober agile lopped galaxy mouth glide business sieve dizzy imitate ritual nucleus chlorine cottage ruined";
  let primaryAddress = "54tjXUgQVYNXQCJM4CatRQZMacZ2Awq4NboKiUYtUJrhgYZjiDhMz4ccuYRcMTno6V9mzKFXzfY8pbPnGmu2ukfWABV75k4";  // just for reference
  let restoreHeight = 501788;
  let daemonConnection = new MoneroRpcConnection({uri: daemonRpcUri, user: daemonRpcUsername, pass: daemonRpcPassword});
  
  // create a core wallet from mnemonic
  let walletCore = await MoneroWalletCoreProxy.createWalletFromMnemonic("abctesting123", MoneroNetworkType.STAGENET, mnemonic, daemonConnection, restoreHeight);
  assert.equal(await walletCore.getMnemonic(), mnemonic);
  assert.equal(await walletCore.getPrimaryAddress(), primaryAddress);
  console.log("Core wallet imported mnemonic: " + await walletCore.getMnemonic());
  console.log("Core wallet imported address: " + await walletCore.getPrimaryAddress());
  
  // synchronize core wallet
  console.log("Synchronizing core wallet...");
  let result = await walletCore.sync(new WalletSyncPrinter());               // synchronize and print progress
  console.log("Done synchronizing");
  console.log(result);
  
  // start background syncing with listener
  await walletCore.addListener(new WalletSendReceivePrinter()); // listen for and print send/receive notifications
  await walletCore.startSyncing();                              // synchronize in background
  
  // print balance and number of transactions
  console.log("Core wallet balance: " + await walletCore.getBalance());
  console.log("Core wallet number of txs: " + (await walletCore.getTxs()).length);
  console.log("First hash: " + (await walletCore.getTxs())[0].getHash());
  
  // send transaction to self, listener will notify when output is received
  console.log("Sending transaction");
  let txSet = await walletCore.send(0, await walletCore.getPrimaryAddress(), new BigInteger("75000000000"));
  console.log("Transaction sent successfully");
  console.log(txSet.getTxs()[0].getHash());
  
  // load the wasm module
  console.log("MAIN loading module");
  await MoneroUtils.loadWasmModule();
  console.log("done loading module");
  
  // demonstrate c++ utilities which use monero-project via webassembly
  let json = { msg: "This text will be serialized to and from Monero's portable storage format!" };
  let binary = MoneroUtils.jsonToBinary(json);
  assert(binary);
  let json2 = MoneroUtils.binaryToJson(binary);
  assert.deepEqual(json2, json);
  console.log("WASM utils to serialize to/from Monero\'s portable storage format working");
  
  // create a random keys-only wallet
  let walletKeys = await MoneroWalletKeys.createWalletRandom(MoneroNetworkType.STAGENET, "English");
  console.log("Keys-only wallet random mnemonic: " + await walletKeys.getMnemonic());
  
  // connect to monero-daemon-rpc
  console.log("Connecting to monero-daemon-rpc...");
  let daemon = new MoneroDaemonRpc({uri: daemonRpcUri, user: daemonRpcUsername, pass: daemonRpcPassword});
  console.log("Daemon height: " + await daemon.getHeight());
  
  // connect to monero-wallet-rpc
  let walletRpc = new MoneroWalletRpc({uri: walletRpcUri, user: walletRpcUsername, pass: walletRpcPassword});
  
  // configure the rpc wallet to open or create
  let walletRpcFileName = "test_wallet_1";
  let walletRpcFilePassword = "supersecretpassword123";
  
  // open or create rpc wallet
  try {
    console.log("Attempting to open wallet " + walletRpcFileName + "...");
    await walletRpc.openWallet(walletRpcFileName, walletRpcFilePassword);
  } catch (e) {
        
    // -1 returned when the wallet does not exist or it's open by another application
    if (e.getCode() === -1) {
      console.log("Wallet with name '" + walletRpcFileName + "' not found, restoring from mnemonic");
      
      // create wallet
      await walletRpc.createWalletFromMnemonic(walletRpcFileName, walletRpcFilePassword, mnemonic, restoreHeight);
      await walletRpc.sync();
    } else {
      throw e;
    }
  }
  
  // print wallet rpc balance
  console.log("Wallet rpc mnemonic: " + await walletRpc.getMnemonic());
  console.log("Wallet rpc balance: " + await walletRpc.getBalance());  // TODO:why does this print digits and not object?
  
  console.log("EXIT MAIN");
}

/**
 * Worker thread.
 */
async function runWorker() {
  console.log("RUN INTERNAL WORKER");
  console.log("EXIT INTERNAL WORKER");
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

/**
 * Print sync progress every X blocks.
 */
class WalletSendReceivePrinter extends MoneroWalletListener {
  
  constructor(blockResolution) {
    super();
  }

  onOutputReceived(output) {
    console.log("Wallet received output!");
    console.log(output.toJson());
  }
  
  onOutputSpent(output) {
    console.log("Wallet spent output!");
    console.log(output.toJson());
  }
}