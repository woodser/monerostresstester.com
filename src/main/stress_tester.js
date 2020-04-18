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
const MNEMONIC = "zeal queen possible aces ivory mocked pedantic cunning request jeopardy fainted tepid geometry fifteen criminal smidgen rugged inmate gawk surfer dehydrate upgrade behind bypass pedantic";
const SEED_OFFSET = "";
const RESTORE_HEIGHT = 552022;
const PROXY_TO_WORKER = true;   // proxy core wallet and daemon to worker so main thread is not blocked (recommended)
const USE_FS = true;            // optionally save wallets to an in-memory file system, otherwise use empty paths
const FS = USE_FS ? require('memfs') : undefined;  // use in-memory file system for demo

// GUI constants
const FLEX_SRC = "img/muscleFlex.gif";
const RELAX_SRC = "img/muscleRelax.gif";

// Math constants
const AU_PER_XMR = 1000000000000;

//Hepler function to convert bigInt in atomic units to decimal representation
function atomicUnitsToDecimalString(aUAmount) {
  console.log("Testing the BigInteger value: " + aUAmount.toString());
  // Get a two-dimensional array containing the quotient and remainder of the result of 
  // dividing the fee in atomic units by the number of atomic units in one XMR
  let quotientAndRemainder = aUAmount.divRem(BigInteger(AU_PER_XMR));

  // Convert the quotient and remainder to JS integers
  quotientAndRemainder[0] = quotientAndRemainder[0].toJSValue();
  quotientAndRemainder[1] = quotientAndRemainder[1].toJSValue();

  // Divide remainder by AU_PER_XMR
  quotientAndRemainder[1] = quotientAndRemainder[1] / AU_PER_XMR;

  // Convert result to a string for display
  let stringRepresentation = (quotientAndRemainder[0]+quotientAndRemainder[1]).toString();
  console.log("AU to convert: " + aUAmount.toString());
  console.log("decimal string: " + stringRepresentation);

  return stringRepresentation;    
}

/**
 * Run the application.
 */
runApp()
async function runApp() {
  console.log("APPLICATION START!");

  // Set the start/stop button image to RELAX
  $("#muscleButton").attr('src',RELAX_SRC);

  // Display a "Initializing..." message on the page so the user knows
  // They can't start generating TXs yet
  $("#statusMessage").html("Initializing...");

  // bool to track whether the stress test loop is running
  // This will help us know which muscle button animation to play
  // and whether to send a "start" or "stop" stignal to the
  // generator
  let isTestRunning = false;

  // connect to daemon
  let daemonConnection = new MoneroRpcConnection({uri: DAEMON_RPC_URI, username: DAEMON_RPC_USERNAME, password: DAEMON_RPC_PASSWORD});
  //let daemon = new MoneroDaemonRpc(daemonConnection.getConfig()); // TODO: support passing connection
  let daemon = await MoneroDaemonRpc.create(Object.assign({PROXY_TO_WORKER: PROXY_TO_WORKER}, daemonConnection.getConfig()));

  // create a wallet from mnemonic
  let path = USE_FS ? GenUtils.getUUID() : "";
  console.log("Creating wasm wallet" + (PROXY_TO_WORKER ? " in worker" : "") + (USE_FS ? " at path " + path : ""));
  let wallet = await MoneroWalletWasm.createWallet({
    path: path,
    password: "abctesting123",
    networkType: MoneroNetworkType.STAGENET,
    mnemonic: MNEMONIC,
    server: daemonConnection,
    restoreHeight: RESTORE_HEIGHT,
    seedOffset: SEED_OFFSET,
    proxyToWorker: PROXY_TO_WORKER,
    fs: FS
  });

  //Get the wallet address
  let walletAddress = await wallet.getPrimaryAddress();
  let walletAddressLine1 = walletAddress.substring(0,walletAddress.length/2);
  let walletAddressLine2 = walletAddress.substring(walletAddress.length/2);
  //Display wallet address on page
  $("#walletAddress").html(walletAddressLine1 + "<br/>" + walletAddressLine2);  // TODO: this will split address for copy/paste, should use max width and auto line wrap

  console.log("Wallet imported mnemonic: " + await wallet.getMnemonic());
  console.log("Wallet imported address: " + walletAddress);

  // synchronize wallet
  $("#statusMessage").html("Synchronizing wallet...");
  let result = await wallet.sync(new WalletSyncPrinter());  // synchronize and print progress

  // render balances
  console.log("Wallet balance: " + await wallet.getBalance());
  $("#walletBalance").html(atomicUnitsToDecimalString(await wallet.getBalance()));
  $("#walletAvailableBalance").html(atomicUnitsToDecimalString(await wallet.getUnlockedBalance()));

  // start background syncing
  await wallet.startSyncing();

  // instantiate a transaction generator
  let txGenerator = new MoneroTxGenerator(daemon, wallet);

  // send a listener to the txGenerator so we can respond to transaction events
  // and be provided with transaction data
  txGenerator.addTransactionListener(async function(tx) {
    console.log("Running transaction listener callback");
    $("#txTotal").html(txGenerator.getNumTxsGenerated());
    $("#walletBalance").html(atomicUnitsToDecimalString(await wallet.getBalance()) + " XMR");
    $("#walletAvailableBalance").html(atomicUnitsToDecimalString(await wallet.getUnlockedBalance()) + " XMR");
    $("#feeTotal").html(atomicUnitsToDecimalString(txGenerator.getTotalFee()) + " XMR");
  });

  // give start/stop control over transaction generator to the muscle button
  // Listen for the start/stop button to be clicked
  $("#muscleButton").click(async function() {
    if (isTestRunning) {
	  isTestRunning = false;
      txGenerator.stop();
      $("#muscleButton").attr('src',RELAX_SRC);
	} else {
	  isTestRunning = true;
      $("#muscleButton").attr('src',FLEX_SRC);
      await txGenerator.start();
	}
  });

  $("#statusMessage").html("Ready to stress the system!");
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
    let percentString = Math.floor(parseFloat(percentDone) * 100).toString() + "%";
    $("#progressBar").width(percentString);
    if (percentDone === 1 || (startHeight - height) % this.blockResolution === 0) {
      console.log("onSyncProgress(" + height + ", " + startHeight + ", " + endHeight + ", " + percentDone + ", " + message + ")");
    }
  }
}
