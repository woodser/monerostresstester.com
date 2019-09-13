/**
 * Sample browser application which uses a JavaScript library to interact
 * with a Monero daemon using RPC and a Monero wallet using RPC and WASM
 * bindings.
 */

"use strict"

// imports
const assert = require("assert");
const MoneroDaemonRpc = require("monero-javascript").MoneroDaemonRpc;
const MoneroWalletRpc = require("monero-javascript").MoneroWalletRpc;
const MoneroWalletLocal = require("monero-javascript").MoneroWalletLocal;

// start the application
startApp();
async function startApp() {
  console.log("Starting app...");
  
  // connect to monero-daemon-rpc
  let daemon = new MoneroDaemonRpc({uri: "http://localhost:38081", user: "superuser", pass: "abctesting123"});
  console.log("Daemon height: " + await daemon.getHeight());
  
  // connect to monero-wallet-rpc
  let walletRpc = new MoneroWalletRpc({uri: "http://localhost:38083", user: "rpc_user", pass: "abc123"});
  
  // wallet to open or create
  let name = "test_wallet_1";
  let password = "supersecretpassword123";
  let mnemonic = "hefty value later extra artistic firm radar yodel talent future fungal nutshell because sanity awesome nail unjustly rage unafraid cedar delayed thumbs comb custom sanity";
  let primaryAddress = "528qdm2pXnYYesCy5VdmBneWeaSZutEijFVAKjpVHeVd4unsCSM55CjgViQsK9WFNHK1eZgcCuZ3fRqYpzKDokqSKp4yp38";  // just for reference
  let restoreHeight = 383338;
  
  // open or create wallet
  try {
    console.log("Attempting to open " + name);
    await walletRpc.openWallet(name, password);
  } catch (e) {
        
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
  
  // print rpc wallet balance to the console
  console.log("Wallet rpc mnemonic: " + await walletRpc.getMnemonic());
  console.log("Wallet rpc balance: " + await walletRpc.getBalance());
  
  // create a wallet from mnemonic using local wasm bindings
  let walletLocal = new MoneroWalletLocal({daemon: daemon, mnemonic: mnemonic});
  console.log("Local wallet address: " + await walletLocal.getPrimaryAddress());
  console.log("Local wallet height: " + await walletLocal.getHeight());
  if (primaryAddress !== await walletLocal.getPrimaryAddress()) throw "Addresses do not match";
  
  // sync the wallet
//  await wallet.sync(undefined, function(progress) {
//    console.log(progress.percent);
//  });
//  console.log("Done syncing?");
  console.log("Done");
}