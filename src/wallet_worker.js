onmessage = function(e) {
  console.log("ENTER WORKER WITH MESSAGE: " + e.data);
  
  console.log("WORKER importScripts() monero-javascript.js");
  self.importScripts('monero-javascript-wasm.js');
  self.importScripts('worker_imports.js');
  console.log("done importing scripts");
  
  runWallet();
  
  async function runWallet() {
    console.log("WORKER loading module");
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

    // create a keys-only wallet from mnemonic
    let mnemonic = "petals frown aerial leisure ruined needed pruned object misery items sober agile lopped galaxy mouth glide business sieve dizzy imitate ritual nucleus chlorine cottage ruined";
    let primaryAddress = "54tjXUgQVYNXQCJM4CatRQZMacZ2Awq4NboKiUYtUJrhgYZjiDhMz4ccuYRcMTno6V9mzKFXzfY8pbPnGmu2ukfWABV75k4";  // just for reference
    walletKeys = await MoneroWalletKeys.createWalletFromMnemonic(MoneroNetworkType.STAGENET, mnemonic);
    assert.equal(await walletKeys.getMnemonic(), mnemonic);
    assert.equal(await walletKeys.getPrimaryAddress(), primaryAddress);
    console.log("Keys-only wallet imported mnemonic: " + await walletKeys.getMnemonic());
    console.log("Keys-only wallet imported address: " + await walletKeys.getPrimaryAddress());
    
    const protocol = "http";
    const host = "localhost";
    //const host = "127.0.0.1";
    const daemonPort = 38081;
    const walletPort = 38083;
    
    // connect to monero-daemon-rpc
    console.log("Connecting to monero-daemon-rpc...");
    let daemon = new MoneroDaemonRpc({protocol: protocol, host: host, port: daemonPort, user: "superuser", pass: "abctesting123"});
    console.log("Daemon height: " + await daemon.getHeight());
    
    // connect to monero-wallet-rpc
    let walletRpc = new MoneroWalletRpc({uri: protocol + "://" + host + ":" + walletPort, user: "rpc_user", pass: "abc123"});
    
    // configure the rpc wallet to open or create
    let name = "test_wallet_1";
    let password = "supersecretpassword123";
    let restoreHeight = 501788;
    
    // open or create rpc wallet
    try {
      console.log("Attempting to open wallet " + name + "...");
      await walletRpc.openWallet(name, password);
    } catch (e) {
      console.log(e);
          
      // -1 returned when the wallet does not exist or it's open by another application
      if (e.getCode() === -1) {
        console.log("Wallet with name '" + name + "' not found, restoring from mnemonic");
        
        // create wallet
        await walletRpc.createWalletFromMnemonic(name, password, mnemonic, restoreHeight);
        await walletRpc.sync();
      } else {
        throw e;
      }
    }
    
    // print rpc wallet balance
    console.log("Wallet rpc mnemonic: " + await walletRpc.getMnemonic());
    console.log("Wallet rpc balance: " + await walletRpc.getBalance());  // TODO:why does this print digits and not object?
    
    // create a random core wallet
    let daemonConnection = new MoneroRpcConnection({uri: protocol + "://" + host + ":" + daemonPort, user: "superuser", pass: "abctesting123"});  // TODO: support 3 strings, "pass" should probably be renamed to "password" 
    let walletCore = await MoneroWalletCore.createWalletRandom("", "supersecretpassword123", MoneroNetworkType.STAGENET, daemonConnection, "English");
    console.log("Core wallet random mnemonic: " + await walletCore.getMnemonic());
    
    // create a core wallet from mnemonic
    walletCore = await MoneroWalletCore.createWalletFromMnemonic("", "supersecretpassword123", MoneroNetworkType.STAGENET, mnemonic, daemonConnection, restoreHeight);
    assert.equal(await walletCore.getMnemonic(), mnemonic);
    assert.equal(await walletCore.getPrimaryAddress(), primaryAddress);
    console.log("Core wallet imported mnemonic: " + await walletKeys.getMnemonic());
    console.log("Core wallet imported address: " + await walletKeys.getPrimaryAddress());
    
    // synchronize core wallet, start background syncing with listener
    console.log("Synchronizing core wallet...");
    await walletCore.sync(new WalletSyncPrinter());               // synchronize and print progress
    await walletCore.addListener(new WalletSendReceivePrinter()); // listen for and print send/receive notifications
    await walletCore.startSyncing();                              // synchronize in background
    
    // print balance and number of transactions
    console.log("Core wallet balance: " + await walletCore.getBalance());
    console.log("Core wallet number of txs: " + (await walletCore.getTxs()).length);
    
    // send transaction to self, listener will notify when output is received
    console.log("Sending transaction");
    let txSet = await walletCore.send(0, await walletCore.getPrimaryAddress(), new BigInteger("75000000000"));
    console.log("Transaction sent successfully");
    console.log(txSet.getTxs()[0].toJson());
    
    console.log("EXIT WORKER");
    postMessage("run_demo_done");
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
  
  //  
//  console.log("Imported MoneroJS:");
//  console.log(MoneroJS);
  
//  importScripts("require.js");
//  requirejs.config({
////      //Lib path
////      baseUrl: '.',
////      // Some specific paths or alternative CDN's
////      paths: {
////          "monero-javascript": [
////              "//cdn.socket.io/socket.io-1.3.7",
////              "socket.io.backup"]
////      },
////      waitSeconds: 20
//  });
//  
//  requirejs(['require', 'worker_imports'], function (require, worker_imports) {
//    worker_imports = require("worker_imports");
//    console.log("LOADED worker_imports!!!");
//    console.log(worker_imports);
////    MoneroJS = MoneroJS();
////    console.log(MoneroJS);
//    //runWallet(MoneroJS);
//  });
}
