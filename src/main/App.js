import React from 'react';
import ReactDOM from 'react-dom';
import "./app.css";

import Banner from "./components/Banner.js";
import Home from "./components/pages/Home.js";
import Deposit from "./components/pages/Deposit.js";
import Save_Phrase_Page from "./components/pages/Save_Phrase_Page.js";
import Withdraw from "./components/pages/Withdraw.js";
import {Notification_Bar, Loading_Animation, getLoadingAnimationFile} from "./components/Widgets.js";

import QR_Code from "./components/QR_Code.js";
import qrcode from './tools/qrcode.js';

import {HashRouter as Router, Link, Route, Routes} from 'react-router-dom';
import { createBrowserHistory } from 'history';

//import { BrowserRouter as Link, NavLink } from "react-router-dom";
import MoneroTxGenerator from './tools/MoneroTxGenerator.js';
import MoneroTxGeneratorListener from './tools/MoneroTxGeneratorListener.js';

import flexingLogo from './img/muscleFlex.gif';
import relaxingLogo from './img/muscleRelax.gif';

const DEBUG = true;

const monerojs = require("monero-javascript");
const LibraryUtils = monerojs.LibraryUtils;
const MoneroWalletListener = monerojs.MoneroWalletListener;
const MoneroWallet = monerojs.MoneroWallet;
const MoneroRpcConnection = monerojs.MoneroRpcConnection;
const MoneroUtils = monerojs.MoneroUtils;
const BigInteger = monerojs.BigInteger;

/* 
 * A wallet must contain at least this many atomic units to be considered "funded" 
 * and thus allowed to generate transactions
 */
const FUNDED_WALLET_MINIMUM_BALANCE = 0.000000000001;
/*
 * WALLET_INFO is a the basic configuration object ot pass to the walletKeys.createWallet() method
 * in order to create a new, random keys-only wallet
 * It is also used as the base to create configuration objects for the WASM wallets that will follow
 * by copying then adding an empty path ("") property and, in the case of a generated wallet,
 * the mnemonic from the generated keys-only wallet.
 */
const WALLET_INFO = {
    password: "supersecretpassword123",
    serverUsername: "superuser",
    serverPassword: "abctesting123"
}

// Temporary hard-coded nodes; will be replaced with implementation of connectionManager
const NETWORK_SERVERS = [
  // mainnet
  {
    serverUri: "127.0.0.1:18081",
    networkType: "mainnet"
  },
  // stagenet
  {
    serverUri: "127.0.0.1:38081",
    networkType: "stagenet"
  },
  {
    serverUri: "127.0.0.1:28081",
    networkType: "testnet"
  }
]

// implementation in progress; will replace NETWORK_SERVERS
const networkConfig = {
  mainnet: [
    
  ]
}



class App extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.browserHistory = createBrowserHistory();
    // Monitor URL changes and redirect if they were initiated by manual url entry
    
    this.withdrawAmountTextPrompt = 'Enter amount to withdraw or click "Send all" to withdraw all funds';
    this.withdrawAmountSendAllText = "All available funds";
    this.withdrawAddressTextPrompt = "Enter destination wallet address..";
    
    // Force the loading animation to preload
    const img = new Image();
    img.src = getLoadingAnimationFile();
    
    
    // print current version of monero-javascript
    
    /*
     * Member Variables
     * No need to store these in state since no components need to re-render when their values are set
     */
    this.txGenerator = null;
    this.walletAddress = "empty";
    this.wallet = null;
    this.enteredText = "";
    this.restoreHeight = 0;
    this.lastHomePage = "";
    this.currentNetwork = 1; // Default to stagenet
 
    // In order to pass "this" into the nested functions...
    let that = this;
    
    //Start loading the Keys-only and full wallet modules
    
    //First, load the keys-only wallet module  
    LibraryUtils.loadKeysModule().then(
      function() {
	      that.keysModuleLoaded = true;

	      // Load the full module
	      LibraryUtils.loadFullModule().then(
	        function() {
	          that.coreModuleLoaded = true;
	        }
	      ).catch(
	        function(error) {
	          console.log("Failed to load full wallet module!");
	          console.log("Error: " + error);
	        } 
	      );
      }
    ).catch(
      function(error) {
	console.log("Failed to load keys-only wallet module!");
	console.log("Error: " + error);
      } 
    );
    
    /*
     * VARS TO EXTRACT FROM STATE:
     * lastHomePage
     */
    
    this.initialState = {
      walletPhrase: "",
      phraseIsConfirmed: false,
      walletSyncProgress: 0,
      walletIsSynced: false,
      balance: 0,
      availableBalance: 0,
      currentHomePage: "Welcome",
      isGeneratingTxs: false,
      transactionsGenerated: 0,
      totalFees: 0,
      enteredMnemonicIsValid: true,
      enteredHeightIsValid: true,
      isAwaitingWalletVerification: false,
      flexLogo: relaxingLogo,
      depositQrCode: null,
      isAwaitingDeposit: false,
      transactionStatusMessage: "",
      currentSitePage: "/"
    };
	    
    this.state = this.initialState;
  }
  
  componentDidMount(){
    this.browserHistory.listen( location =>  {
      /*
       * Parse the hash portion of the current URL to enable comparision with currentSitePage
       * (In other words remove the leading hash)
       */
      let currentUrl = window.location.hash;
      if (currentUrl.length === 0) {
        // We are on the home page. simply ADD a "/"
        currentUrl = "/"
      } else {
        // We are on a sub-page. Remove the leading "#"
        currentUrl = currentUrl.slice(1, currentUrl.length);
      }
    
      /* 
       * Check whether the current url was navigated to by valid means 
       * (that is by links within the app and NOT by manually entering a url)
       */
     
      if(currentUrl !== this.state.currentSitePage){
        console.log("User tried to cheat! redirect.");
        let urlToNavigateTo = "http://localhost:8080/#" + this.state.currentSitePage;
        this.browserHistory.replace(urlToNavigateTo);
      }
    });
  }
  
  createDateConversionWallet(){
    // Create a disposable,random wallet to prepare for the possibility that the user will attempt to restore from a date
    // At present, getRestoreHeightFromDate() is (erroneously) an instance method; thus, a wallet instance is
    // required to use it.
    
    this.dateRestoreWalletPromise = monerojs.createWalletFull({
      password: "supersecretpassword123",
      networkType: NETWORK_SERVERS[this.currentNetwork].networkType,
      path: "",
      serverUri: NETWORK_SERVERS[this.currentNetwork].serverUri,
      serverUsername: "superuser",
      serverPassword: "abctesting123",
    });

  }
  
  async createTxGenerator(wallet) {
    
    // create daemon with connection
    let daemonConnection = new MoneroRpcConnection("http://" + NETWORK_SERVERS[this.currentNetwork].serverUri, WALLET_INFO.serverUsername, WALLET_INFO.serverPassword);
    let daemon = await monerojs.connectToDaemonRpc({
      server: daemonConnection,
      proxyToWorker: true
    });
    // create tx generator
    this.txGenerator = new MoneroTxGenerator(daemon, wallet);
  }
  
  setBalances(balance, availableBalance){
    this.setState({
      balance: balance,
      availableBalance: availableBalance
    });
  }
  
  convertStringToRestoreDate(str){
    // Make sure the string is of the format "####/##/##"
    // Does the date have the correct number of characters? (10):
    if(str.length === 10){
      //Attempt to divide the string into its constituent parts
      var dateParts = str.split("-");
      // If the result yields three strings
      if (dateParts.length === 3){
	// Attempt to convert each string to an integer
	for (let i = 0; i < 3; i++){
	  try {
	    let n = Number(dateParts[i]);
	    if (n === NaN) throw "Invalid date";
	    // If the conversion worked, replace the string in the array with the number
	    dateParts[i] = n;
	  } catch(e){
	    throw "Invalid date: " + e;
	  }
	}
	return dateParts;
      } else throw "Invalid date; date should contain three numbers separated by two slashes";
    }
    throw "Invalid date; date should be 10 chars long";
  }
  
  setRestoreHeight(height){
    this.restoreHeight = height;
    this.setState({
      enteredHeightIsValid: true
    });
  }
  
  async restoreWallet(){
    
    this.setState({
      isAwaitingWalletVerification: true
    });
    
    let alertMessage = "";  
    
    // First, determine whether the user has typed a height, a date, or something else(invalid)
    let height=Number(this.restoreHeight);
    // If the string is NOT a valid integer, check to see if it is a date and convert accordingly:
    if(!(height != NaN && height%1 === 0 && height >= 0)) {
      // Attempt to convert the string to a date in the format "YYYY-MM-DD"
      try {
        var dateParts = this.convertStringToRestoreDate(this.restoreHeight);
    
        // Attempt to convert date into a monero blockchain height:
        let dateRestoreHeightWallet = await this.dateRestoreWalletPromise;
        height = await dateRestoreHeightWallet.getHeightByDate(dateParts[0], dateParts[1], dateParts[2]);
      } catch(e) {
        alertMessage = e;
      }
    }
    
    // If no errors were thrown, "height" is a valid restore height.
    if (alertMessage !== "") {
      //If height was invalid:
      console.log(alertMessage);
      this.setState({
	enteredHeightIsValid: false,
        isAwaitingWalletVerification: false
      });
      return;
    }
    
    console.log("currentNetwork: " + this.currentNetwork);
    console.log("Creating wallet on network " + NETWORK_SERVERS[this.currentNetwork].networkType);
    console.log("serverUri: " + NETWORK_SERVERS[this.currentNetwork].serverUri);
    
    let walletFull = null;
    try {
      let fullWalletInfo = Object.assign({}, WALLET_INFO);
      fullWalletInfo.path = "";
      fullWalletInfo.mnemonic = this.delimitEnteredWalletPhrase();
      fullWalletInfo.restoreHeight = height;
      fullWalletInfo.serverUri = NETWORK_SERVERS[this.currentNetwork].serverUri;
      fullWalletInfo.networkType = NETWORK_SERVERS[this.currentNetwork].networkType;
      walletFull = await monerojs.createWalletFull(fullWalletInfo);
      
    } catch(e) {
      console.log("Error: " + e);
      this.setState({
	enteredMnemonicIsValid: false,
	isAwaitingWalletVerification: false
      });
      return;
    }
    
    if(this.userCancelledWalletImport){
      return;
    }
    // Both the mnemonic and restore height were valid; thus, we can remove the disposable date-conversion
    // Wallet from memory
    this.dateRestoreHeightWallet = null;
    this.setState({
      isAwaitingWalletVerification: false
    });
    
    this.wallet = walletFull;
    
    // Get the mnemonic so we can store it in state and make it available to view on "Backup" page
    let mnemonic = await walletFull.getMnemonic();
    
    this.lastHomePage = "Import_Wallet";
    
    this.setState({
      currentHomePage: "Sync_Wallet_Page"
    });
    
    // Create a wallet listener to keep app.js updated on the wallet's balance etc.
    this.walletUpdater = new walletListener(this);
    let that=this;
    walletFull.sync(this.walletUpdater).then(async () => {
      
      if(!that.userCancelledWalletSync && !that.userCancelledWalletImport){
        // This code should only run if wallet.sync finished because the wallet finished syncing
        // And not because the user cancelled the sync
        that.walletUpdater.setWalletIsSynchronized(true);
        await that._initMain();
        let balance = await walletFull.getBalance();
        let availableBalance = await walletFull.getUnlockedBalance();
        that.setState({
          walletIsSynced: true,
          balance: balance,
          availableBalance: availableBalance,
          currentHomePage: "Wallet",
          walletPhrase: mnemonic
        });
        qrcode.toDataURL(that.walletAddress, function(err, url){
            let code = <QR_Code url={url} />;
            that.setState({
              depositQrCode: code
            });
          }
        );

      } else {
        // Reset the wallet sync cancellation indicator variable so that any syncs
        // completed in the future are not misinterpretted as cancelled syncs by default
        that.userCancelledWalletSync = false;
        that.userCancelledWalletImport = false;
      }
    });
    

  }

setCurrentSyncProgress(percentDone){
  this.setState({walletSyncProgress: percentDone});
}
  
setEnteredPhrase(mnemonic){
  this.enteredText = mnemonic;
  this.setState({
    enteredMnemonicIsValid: true
  });
}

async startGeneratingTxs(){
  await this.txGenerator.start();
  this.setState({
    isGeneratingTxs: true
  })
}

async stopGeneratingTxs(){
  this.txGenerator.stop();
  this.setState({
    isGeneratingTxs: false
  })
}

async generateWallet(){
  
  let walletKeys = null
  try {
    walletKeys = await monerojs.createWalletKeys(Object.assign({}, WALLET_INFO, {
      networkType: NETWORK_SERVERS[this.currentNetwork].networkType,
      serverUri: NETWORK_SERVERS[this.currentNetwork].serverUri
    }));
  } catch(error) {
    console.log("failed to create keys-only wallet with error: " + error);
    return;
  }
  
  console.log("Keyswallet: " + walletKeys);
  
  let newPhrase = await walletKeys.getMnemonic();
  this.walletAddress = await walletKeys.getAddress(0,0);
  this.setState({
    walletPhrase: newPhrase
  });
  console.log("");
  console.log("Attempting to generate new wallet");
  console.log("current network: " + this.currentNetwork);
  console.log("Network server on the current network: " + JSON.stringify(NETWORK_SERVERS[this.currentNetwork]));
  console.log("serverUri: " + NETWORK_SERVERS[this.currentNetwork].serverUri);
  console.log("");
  let fullWalletInfo = Object.assign(
    {},
    WALLET_INFO,
  );
  
     fullWalletInfo.mnemonic = newPhrase;
     fullWalletInfo.path = "";
     fullWalletInfo.serverUri = NETWORK_SERVERS[this.currentNetwork].serverUri;
     fullWalletInfo.networkType = NETWORK_SERVERS[this.currentNetwork].networkType;
  
  // set restore height to daemon's current height
  let daemonConnection = new MoneroRpcConnection("http://" + NETWORK_SERVERS[this.currentNetwork].serverUri, WALLET_INFO.serverUsername, WALLET_INFO.serverPassword);    // TODO: factor out common daemon reference so this code is not duplicated
  let daemon = await monerojs.connectToDaemonRpc({
    server: daemonConnection,
    proxyToWorker: true
  });
  fullWalletInfo.restoreHeight = await daemon.getHeight();
  
  // create wallet promise which syncs when resolved
  let walletPromise = monerojs.createWalletFull(fullWalletInfo);
  walletPromise.then(async function(wallet) {
    await wallet.sync();
  })
  
  this.wallet = walletPromise;
}

  /**
   * Common helper to initialize the main page after the wallet is created and synced.
   *
   * Creates the tx generator, listens for event notifications, and starts background synchronization.
   */
  async _initMain() {
    
    // resolve wallet promise
    this.wallet = await this.wallet;
    
    // Keep track of the wallet's address
    this.walletAddress = await this.wallet.getAddress(0,0);
    
    // If the user hit "Or go back" before the wallet finished building, abandon wallet creation
    // and do NOT proceed to wallet page
    if (this.userCancelledWalletConfirmation) return;
        
    // create transaction generator
    await this.createTxGenerator(this.wallet);
            
    // register listener to handle notifications from tx generator
    let that = this;
    await this.txGenerator.addListener(new class extends MoneroTxGeneratorListener {
      
      async onMessage(msg) {
        that.setState({
          transactionStatusMessage: msg
        });
      }
      
      // handle transaction notifications
      async onTransaction(tx, numTxsGenerated, totalFees, numSplitOutputs) {
        
        // refresh main ui
        await that.refreshMainState();
      }
      
      async onNumBlocksToUnlock(numBlocksToNextUnlock, numBlocksToLastUnlock) {
        await that.refreshMainState();
      }
    });
    
    // listen for wallet updates to refresh main ui
    await this.wallet.addListener(new class extends MoneroWalletListener {
        
      async onBalancesChanged(newBalance, newUnlockedBalance) {
        if (newBalance > that.state.balance){
          that.setState({
            isAwaitingDeposit: false,
            availableBalance: newUnlockedBalance,
            balance: newBalance
          });
        }
        await that.refreshMainState();
      }
    });
    
    // start syncing wallet in background if the user has not cancelled wallet creation
    await this.wallet.startSyncing(5000);
  }
  
  async refreshMainState() {
    
    // skip if already refreshing
    if (this._refreshingMainState) return;
    this._refreshingMainState = true;
    
    // build new state
    let state = {};
    state.balance = await this.wallet.getBalance();
    state.availableBalance = await this.wallet.getUnlockedBalance();
    state.transactionsGenerated = this.txGenerator.getNumTxsGenerated();
    state.totalFees = this.txGenerator.getTotalFees();
    
    // pump arms if new tx generated
    let armPump = state.transactionsGenerated > this.state.transactionsGenerated;
    if (armPump) this.playMuscleAnimation();

    // TODO: update balance with time to last unlock if > 0
    this.setState(state);
    this._refreshingMainState = false;
  }
  
  playMuscleAnimation() {
    this.setState({flexLogo: flexingLogo});
    let that = this;
    setTimeout(function() {
      that.setState({flexLogo: relaxingLogo});
    }, 1000);
  }

  logout() {
    this.setState (this.initialState);
    this.txGenerator.stop();
    this.txGenerator = null;
    this.walletUpdater = null;
    this.wallet = null;
    this.restoreHeight = 0;
    this.lastHomePage = "";
    this.enteredWithdrawAmountIsValid = true;
    this.enteredWithdrawAddressIsValid = true;
    this.withdrawTransaction = null;
  }
  
  delimitEnteredWalletPhrase(){
    // Remove any extra whitespaces
    let enteredTextCopy = this.enteredText;
    enteredTextCopy = enteredTextCopy.replace(/ +(?= )/g,'').trim();
    return(enteredTextCopy);
  }
  
  async confirmWallet() {
    
    this.setState({
      isAwaitingWalletVerification: true
    });

    let walletPhrase = await this.state.walletPhrase;
    
    if (this.delimitEnteredWalletPhrase() === walletPhrase) {
      
      // Create a wallet event listener
      this.walletUpdater = new walletListener(this);
      this.walletUpdater.setWalletIsSynchronized(true);
      
      // initialize main page with listening, background sync, etc
      await this._initMain();
      
      // If the user hit "Or go back" before the wallet finished building, abandon wallet creation
      // and do NOT proceed to wallet page
      if(this.userCancelledWalletConfirmation){
	this.userCancelledWalletConfirmation = false;
	this.setState({
	  isAwaitingWalletVerification: false
	});
	return;
      }
      
      this.lastHomePage = "Confirm_Wallet";
      
      this.setState ({
        phraseIsConfirmed: true,
        walletIsSynced: true,
        currentHomePage: "Wallet",
        isAwaitingWalletVerification: false
      });
      let that = this;
      qrcode.toDataURL(this.walletAddress, function(err, url){
          let code = <QR_Code url={url} />;
          that.setState({
            depositQrCode: code
          });
        }
      );
    } else {
      this.setState({
        enteredMnemonicIsValid: false,
	isAwaitingWalletVerification: false
      });
    }
  }
  
  async confirmAbortWalletSynchronization() {
    let doAbort = confirm("All synchronization will be lost. Are you sure you wish to continue?");
    
    if (doAbort){
      
      this.setState({
        walletPhrase: "",
        phraseIsConfirmed: false,
        walletSyncProgress: 0,
        balance: 0,
        availableBalance: 0,
        enteredMnemonicIsValid: true,
        enteredHeightIsValid: true,
        currentHomePage: "Import_Wallet"
      });
      /*
       * First, set a class variable so that the importWallet function 
       * can know that the wallet sync function finished because it was cancelled
       * and not because the wallet actually finished syncing
       */
      this.userCancelledWalletSync = true;      
      await this.wallet.stopSyncing();
    }
  }
  
  /*
   * currentHomePage and currentSitePage
   * the "current home page" is the "subpage" of "home" (/#) the user is currently viewing
   * 
   * currentSitePage refers to the ACTUAL page - this could be "home" (/#) but can also be any
   * of the other pages (deposit, withrawl, etc)
   * 
   * currentHomePage becomes irrelevant once the user loads a wallet and gains acces
   * to the other site pages besides home (since home no longer has sub pages
   * once this is the case)
   */
  setCurrentHomePage(pageName){
    this.setState({
      currentHomePage: pageName
    });
  }
  
  setCurrentSitePage(pageName) {
    if(pageName === "/sign_out"){
      let userConfirmedSignout = confirm("Are you sure you want to sign out of this wallet? If you did not record the seed phrase, you will permanently lose access to the wallet and any funds contained therin! Click 'Ok' to continue");
      if(userConfirmedSignout){
        this.logout();
        console.log("Pagename == 'Sign Out'. Logging out.");
      }
    } else {
      console.log("Setting currentSitePage to " + pageName);
      this.setState({
        currentSitePage: pageName
      });
    }
  }
  
  cancelImport(){
    this.userCancelledWalletImport = true;
    this.logout();
  }
  
  cancelConfirmation(){
    /*
     * If the user cancels the wallet import by hitting "or go back", this.wallet will remain a promise
     * to the cancelled wallet. "stopSyncing" must be run on this wallet, but cannot until the promise resolves
     * by which point the value of this.wallet may have changed do to the user generating a new phrase or 
     * importing a different wallet in the meantime.
     * Thus, userCancelledWalletConfirmation allows the app to keep track of the wallet and run "stopSyncing" 
     * on it when ready.
     */
    if(this.state.isAwaitingWalletVerification){
      this.userCancelledWalletConfirmation = true;
      this.setState({
        isAwaitingWalletVerification: false
      });
    };
  }
  
  notifyIntentToDeposit() {
    this.setState({
      isAwaitingDeposit: true
    });
    this.setCurrentSitePage("/deposit");
  }
  
  handleNetworkChange(network){
    console.log("Handling network change to network: " + network);
    this.currentNetwork = network;
  }
  
  render(){
    let notificationBar = null;
    
    if(this.state.walletIsSynced && !(this.state.balance > 0) && this.state.currentSitePage != "/deposit"){
      notificationBar = (
	      <Notification_Bar content = {
	        <>
            No funds deposited
            &thinsp;
            <Link 
              onClick = {this.notifyIntentToDeposit.bind(this)}
              to = "/deposit"	
            >
              click to deposit
            </Link>
          </>
	      } />
      );
    }
    

      return(
        <div id="app_container">
          <Router history = {this.browserHistory}>
            <Banner 
              walletIsSynced={this.state.walletIsSynced}
              flexLogo = {this.state.flexLogo}
              notifyIntentToDeposit = {this.notifyIntentToDeposit.bind(this)}
              setCurrentSitePage = {this.setCurrentSitePage.bind(this)}
            />
            {notificationBar}
            <Routes>
    <Route path="/" element = {
          <Home
                generateWallet={this.generateWallet.bind(this)}
                confirmWallet={this.confirmWallet.bind(this)}
                restoreWallet={this.restoreWallet.bind(this)}
                setEnteredPhrase={this.setEnteredPhrase.bind(this)}
                logout={this.logout.bind(this)}
                walletSyncProgress = {this.state.walletSyncProgress}
                setRestoreHeight = {this.setRestoreHeight.bind(this)}
                walletPhrase = {this.state.walletPhrase}
                currentHomePage = {this.state.currentHomePage}
                balance = {this.state.balance}
                setCurrentHomePage = {this.setCurrentHomePage.bind(this)}
                setCurrentSitePage = {this.setCurrentSitePage.bind(this)}
                lastHomePage = {this.lastHomePage}
                availableBalance = {this.state.availableBalance}
                confirmAbortWalletSynchronization = {this.confirmAbortWalletSynchronization.bind(this)}
                coreModuleLoaded = {this.coreModuleLoaded}
                keysModuleLoaded = {this.keysModuleLoaded}
                isGeneratingTxs = {this.state.isGeneratingTxs}
                startGeneratingTxs = {this.startGeneratingTxs.bind(this)}
                stopGeneratingTxs = {this.stopGeneratingTxs.bind(this)}
                transactionsGenerated = {this.state.transactionsGenerated}
                totalFees = {this.state.totalFees}
                createDateConversionWallet = {this.createDateConversionWallet.bind(this)}
                enteredMnemonicIsValid = {this.state.enteredMnemonicIsValid}
                enteredHeightIsValid = {this.state.enteredHeightIsValid}
                cancelImport = {this.cancelImport.bind(this)}
                cancelConfirmation = {this.cancelConfirmation.bind(this)}
                forceWait = {this.state.isAwaitingWalletVerification}
                transactionStatusMessage = {this.state.transactionStatusMessage}
                handleNetworkChange = {this.handleNetworkChange.bind(this)}
            />}
          />
          <Route path="/backup" element = {
              <Save_Phrase_Page 
                omit_buttons = {true} 
                text = {this.state.walletPhrase}
                verificationUrl = {this.state.currentSitePage}
              />
          }/>
          <Route path="/deposit" element = {
              <Deposit
                depositQrCode = {this.state.depositQrCode}
                walletAddress = {this.walletAddress}
                xmrWasDeposited = {!this.state.isAwaitingDeposit}
                setCurrentSitePage = {this.setCurrentSitePage.bind(this)}
                verificationUrl = {this.state.currentSitePage}
              />
          }/>
          <Route path="/withdraw" element = {
             <Withdraw
               availableBalance = {this.state.availableBalance}
               totalBalance = {this.state.balance}
               wallet = {this.wallet}
               isGeneratingTxs = {this.state.isGeneratingTxs}
             />
          }/> 
        </Routes>
      </Router>
    </div>
      );
  }
}

function default_page(){
  return <h1>ERROR - invalid url path!</h1>
}
            
/*
 * Print sync progress every X blocks.
 */
class walletListener extends MoneroWalletListener {
              
  constructor(callingComponent) { // callingComponent is "App" in this case
    super();
    this.callingComponent = callingComponent;
    this.syncResolution = 0.05;
    this.lastIncrement = 0;
    this.walletIsSynchronized = false;
  }
              
  onSyncProgress(height, startHeight, endHeight, percentDone, message) {
    this.callingComponent.setCurrentSyncProgress(percentDone*100); 
    if (percentDone >= this.lastIncrement + this.syncResolution) {
      this.lastIncrement += this.syncResolution;
    }
  }
  
  onBalancesChanged(newBalance, newUnlockedBalance){
    this.callingComponent.setBalances(newBalance, newUnlockedBalance); 
  }
  
  setWalletIsSynchronized(value) {
    this.walletIsSynchronized = value;
  }
}

export default App;
