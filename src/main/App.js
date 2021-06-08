import React, {useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import "./app.css";

import Banner from "./components/Banner.js";
import Home from "./components/pages/Home.js";
import Deposit from "./components/pages/Deposit.js";
import SignOut from "./components/pages/SignOut.js";
import Save_Phrase_Page from "./components/pages/Save_Phrase_Page.js";
import Withdraw from "./components/pages/Withdraw.js";
import {Notification_Bar, Loading_Animation, getLoadingAnimationFile} from "./components/Widgets.js";

import QR_Code from "./components/QR_Code.js";
import qrcode from './qrcode.js';

import {Router, Link, Route, Switch, Redirect} from 'react-router';
import { createBrowserHistory } from 'history';
//import { BrowserRouter as Link, NavLink } from "react-router-dom";
import MoneroTxGenerator from './MoneroTxGenerator.js';
import MoneroTxGeneratorListener from './MoneroTxGeneratorListener.js';

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
    networkType: "stagenet",
    serverUri: "http://localhost:38081",
    serverUsername: "superuser",
    serverPassword: "abctesting123"
}

export default function App(props) {
  
  //Create a custom browser history;
  const customHistory = createBrowserHistory();
  /*
   * There are essentially two separate histories for the app:
   * 1. The standard url/based history (/, /deposit, etc).
   * 2. History that includes navigation within sub-pages (for instance restoring wallet
   *   at "/" vs generating new wallet vs welcome page etc.
   * The browser only knows how to handle the first type of history when back/forward buttons are pressed
   * Therefore, it is necessary to manage the app/subpage history manually in order for the back/forward buttons
   * to work properly
   */
  let appHistory = [];
  let siteHistory = [];
  
  let withdrawAmountTextPrompt = 'Enter amount to withdraw or click "Send all" to withdraw all funds';
  let withdrawAmountSendAllText = "All available funds";
  let withdrawAddressTextPrompt = "Enter destination wallet address..";
  
  // Force the loading animation to preload
  const img = new Image();
  img.src = getLoadingAnimationFile();
  
  
  // print current version of monero-javascript
  
  /*
   * Member Variables
   * No need to store these in state since no components need to re-render when their values are set
   */
  let txGenerator = useRef(null);
  let walletAddress = useRef("empty");
  let wallet = useRef(null);
  let enteredText = useRef("");
  let restoreHeight = useRef(0);
  let lastHomePage = useRef("");
  let userCancelledWalletConfirmation = useRef(false);
  let userCancelledWalletSync = useRef(false);
  let userCancelledWalletImport = useRef(false);
  let dateRestoreWalletPromise = useRef(null);
  let walletUpdater = useRef(null);
  let _refreshingMainState = useRef(false);
  
  //Start loading the Keys-only and full wallet modules
  
  //First, load the keys-only wallet module  
  LibraryUtils.loadKeysModule().then(
    function() {
      setKeysModuleLoaded(true);

      // Load the full module
      LibraryUtils.loadFullModule().then(
        function() {
          setCoreModuleLoaded(true);
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
    
  const [walletPhrase, setWalletPhrase] = useState("");
  const [phraseIsConfirmed, setPhraseIsConfirmed] = useState(false);
  const [walletSyncProgress, setWalletSyncProgress] = useState(0);
  const [walletIsSynced, setWalletIsSynced] = useState(false);
  const [balance, setBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [currentHomePage, setCurrentHomePage] = useState("Welcome");
  const [isGeneratingTxs, setIsGeneratingTxs] = useState(false);
  const [transactionsGenerated, setTransactionsGenerated] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [enteredMnemonicIsValid, setEnteredMnemonicIsValid] = useState(true);
  const [enteredHeightIsValid, setEnteredHeightIsValid] = useState(true);
  const [isAwaitingWalletVerification, setIsAwaitingWalletVerification] = useState(false);
  const [flexLogo, setFlexLogo] = useState(relaxingLogo);
  const [depositQrCode, setDepositQrCode] = useState(null);
  const [isAwaitingDeposit, setIsAwaitingDeposit] = useState(false);
  const [transactionStatusMessage, setTransactionStatusMessage] = useState("");
  const [currentSitePage, setCurrentSitePage] = useState("/");
  const [keysModuleLoaded, setKeysModuleLoaded] = useState(false);
  const [coreModuleLoaded, setCoreModuleLoaded] = useState(false);
  const [animationIsLoaded, setAnimationIsLoaded] = useState(false);
  
  const createDateConversionWallet = function(){
    // Create a disposable,random wallet to prepare for the possibility that the user will attempt to restore from a date
    // At present, getRestoreHeightFromDate() is (erroneously) an instance method; thus, a wallet instance is
    // required to use it.
    
    dateRestoreWalletPromise = monerojs.createWalletFull({
      password: "supersecretpassword123",
      networkType: "stagenet",
      path: "",
      serverUri: "http://localhost:38081",
      serverUsername: "superuser",
      serverPassword: "abctesting123",
    });

  }
  
  const createTxGenerator = async function(wallet) {
    
    // create daemon with connection
    let daemonConnection = new MoneroRpcConnection(WALLET_INFO.serverUri, WALLET_INFO.serverUsername, WALLET_INFO.serverPassword);
    let daemon = await monerojs.connectToDaemonRpc({
      server: daemonConnection,
      proxyToWorker: true
    });
    
    // create tx generator
    txGenerator.current = new MoneroTxGenerator(daemon, wallet);
  }
  
  const setBalances = function(balance, availableBalance){
    setBalance(balance);
    setAvailableBalance(availableBalance);
  }
  
  const convertStringToRestoreDate = function(str){
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
  
  const setRestoreHeight = function(height){
    restoreHeight.current = height;
    setEnteredHeightIsValid(true);
  }
  
  const restoreWallet = async function(){
    
    setIsAwaitingWalletVerification(true);
    
    let alertMessage = "";  
    
    // First, determine whether the user has typed a height, a date, or something else(invalid)
    let height=Number(restoreHeight.current);
    // If the string is NOT a valid integer, check to see if it is a date and convert accordingly:
    let dateRestoreHeightWallet;
    if(!(height != NaN && height%1 === 0 && height >= 0)) {
      // Attempt to convert the string to a date in the format "YYYY-MM-DD"
      try {
        var dateParts = convertStringToRestoreDate(restoreHeight.current);
    
        // Attempt to convert date into a monero blockchain height:
        dateRestoreHeightWallet = await dateRestoreWalletPromise.current;
        height = await dateRestoreHeightWallet.getHeightByDate(dateParts[0], dateParts[1], dateParts[2]);
      } catch(e) {
        alertMessage = e;
      }
    }
    
    // If no errors were thrown, "height" is a valid restore height.
    if (alertMessage !== "") {
      //If height was invalid:
      console.log(alertMessage);
      setEnteredHeightIsValid(false,)
      setIsAwaitingWalletVerification(false);
      return;
    }
    
    let walletFull = null;
    try {
      let fullWalletInfo = Object.assign({}, WALLET_INFO);
      fullWalletInfo.path = "";
      fullWalletInfo.mnemonic = delimitEnteredWalletPhrase();
      fullWalletInfo.restoreHeight = height;
      walletFull = await monerojs.createWalletFull(fullWalletInfo);
      
    } catch(e) {
      console.log("Error: " + e);
      setEnteredMnemonicIsValid(false);
      setIsAwaitingWalletVerification(false);
      return;
    }
    
    if(userCancelledWalletImport.current){
      return;
    }
    // Both the mnemonic and restore height were valid; thus, we can remove the disposable date-conversion
    // Wallet from memory
    dateRestoreHeightWallet = null;

    setIsAwaitingWalletVerification(false);

    
    wallet.current = walletFull;
    
    // Get the mnemonic so we can store it in state and make it available to view on "Backup" page
    let mnemonic = await walletFull.getMnemonic();
    
    lastHomePage.current = "Import_Wallet";
    

    setCurrentHomePage("Sync_Wallet_Page");

    
    // Create a wallet listener to keep app.js updated on the wallet's balance etc.
    walletUpdater = new walletListener(setCurrentSyncProgress, setBalances);
    
    walletFull.sync(walletUpdater).then(async () => {
      
      if(!userCancelledWalletSync.current && !userCancelledWalletImport.current){
        // This code should only run if wallet.sync finished because the wallet finished syncing
        // And not because the user cancelled the sync
        walletUpdater.setWalletIsSynchronized(true);
        await _initMain();
        let balance = await walletFull.getBalance();
        let availableBalance = await walletFull.getUnlockedBalance();
        setWalletIsSynced(true);
        setBalance(balance);
        setAvailableBalance(availableBalance);
        setCurrentHomePage("Wallet");
        setWalletPhrase(mnemonic);
        qrcode.toDataURL(walletAddress.current, function(err, url){
            let code = <QR_Code url={url} />;

            setDepositQrCode(code);

          }
        );

      } else {
        // Reset the wallet sync cancellation indicator variable so that any syncs
        // completed in the future are not misinterpretted as cancelled syncs by default
        userCancelledWalletSync.current = false;
        userCancelledWalletImport.current = false;
      }
    });
    

  }

const setCurrentSyncProgress = function(percentDone){
  setWalletSyncProgress(percentDone);
}
  
const setEnteredPhrase = function(mnemonic){
  enteredText.current = mnemonic;
  setEnteredMnemonicIsValid(true);
}

const startGeneratingTxs = async function(){
  await txGenerator.current.start();
  setIsGeneratingTxs(true);
}

const stopGeneratingTxs = async function(){
  txGenerator.current.stop();
  setIsGeneratingTxs(false);
}

const generateWallet = async function(){
  
  let walletKeys = null
  try {
    walletKeys = await monerojs.createWalletKeys(WALLET_INFO);
  } catch(error) {
    console.log("failed to create keys-only wallet with error: " + error);
    return;
  }
  
  let newPhrase = await walletKeys.getMnemonic();
  walletAddress.current = await walletKeys.getAddress(0,0);
  
  setWalletPhrase(newPhrase);

  let fullWalletInfo = Object.assign({}, WALLET_INFO);
  fullWalletInfo.mnemonic = newPhrase;
  fullWalletInfo.path = "";
  
  // set restore height to daemon's current height
  let daemonConnection = new MoneroRpcConnection(WALLET_INFO.serverUri, WALLET_INFO.serverUsername, WALLET_INFO.serverPassword);    // TODO: factor out common daemon reference so this code is not duplicated
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
  
  wallet.current = walletPromise;

}

  /**
   * Common helper to initialize the main page after the wallet is created and synced.
   *
   * Creates the tx generator, listens for event notifications, and starts background synchronization.
   */
  const _initMain = async function() {
    
    // resolve wallet promise
    let awaitedWallet = await wallet.current;
    wallet.current = awaitedWallet;
    // Keep track of the wallet's address
    let awaitedWalletAddress = await wallet.current.getAddress(0,0);
    walletAddress.current = awaitedWalletAddress;
    // If the user hit "Or go back" before the wallet finished building, abandon wallet creation
    // and do NOT proceed to wallet page
    if (userCancelledWalletConfirmation.current) return;
        
    // create transaction generator
    await createTxGenerator(wallet.current);
            
    // register listener to handle notifications from tx generator

    await txGenerator.current.addListener(new class extends MoneroTxGeneratorListener {
      
      async onMessage(msg) {

        setTransactionStatusMessage(msg);

      }
      
      // handle transaction notifications
      async onTransaction(tx, numTxsGenerated, totalFees, numSplitOutputs) {
        
        // refresh main ui
        await refreshMainState();
      }
      
      async onNumBlocksToUnlock(numBlocksToNextUnlock, numBlocksToLastUnlock) {
        await refreshMainState();
      }
    });
    
    // listen for wallet updates to refresh main ui
    await wallet.current.addListener(new class extends MoneroWalletListener {
        
      async onBalancesChanged(newBalance, newUnlockedBalance) {
        if (newBalance > balance){

          setIsAwaitingDeposit(false,);
          setAvailableBalance(newUnlockedBalance,);
          setBalance(newBalance);

        }
        await refreshMainState();
      }
    });
    
    // start syncing wallet in background if the user has not cancelled wallet creation
    await wallet.current.startSyncing(5000);
  }
  
  const refreshMainState = async function() {
    
    // skip if already refreshing
    if (_refreshingMainState.current) return;
    _refreshingMainState.current = true;
    
    // build new state
    let state = {};
    state.balance = await wallet.current.getBalance();
    state.availableBalance = await wallet.current.getUnlockedBalance();
    state.transactionsGenerated = txGenerator.current.getNumTxsGenerated();
    state.totalFees = txGenerator.current.getTotalFees();
    
    // pump arms if new tx generated
    let armPump = state.transactionsGenerated > transactionsGenerated;
    if (armPump) playMuscleAnimation();

    setBalance(state.balance);
    setAvailableBalance(state.availableBalance);
    setTransactionsGenerated(state.transactionsGenerated);
    setTotalFees(state.totalFees);

    // TODO: update balance with time to last unlock if > 0
    
    _refreshingMainState.current = false;
  }
  
  const playMuscleAnimation = function() {
    setFlexLogo(flexingLogo);
    setTimeout(function() {
      setFlexLogo(relaxingLogo);
    }, 1000);
  }

  const logout = function() {

    setWalletPhrase("");
    setPhraseIsConfirmed(false);
    setWalletSyncProgress(0);
    setWalletIsSynced(false);
    setBalance(0);
    setAvailableBalance(0);
    setCurrentHomePage("Welcome");
    setIsGeneratingTxs(false);
    setTransactionsGenerated(0);
    setTotalFees(0);
    setEnteredMnemonicIsValid(true);
    setEnteredHeightIsValid(true);
    setIsAwaitingWalletVerification(false);
    setFlexLogo(relaxingLogo);
    setDepositQrCode(null);
    setIsAwaitingDeposit(false);
    setTransactionStatusMessage("");
    setCurrentSitePage("/");
    setWalletUpdater(null);
    setWallet(null);
    setRestoreHeight(0);
    setLastHomePage("");
    setEnteredWithdrawAmountIsValid(true);
    setEnteredWithdrawAddressIsValid(true);
    setWithdrawTransaction(null);
    setKeysModuleLoaded(false);
    setCoreModuleLoaded(false);
    setAnimationIsLoaded(false);
    
    
    txGenerator.current = null;
    walletAddress.current = "empty";
    wallet.current = null;
    enteredText.current = "";
    restoreHeight.current = 0;
    lastHomePage.current = "";
    userCancelledWalletConfirmation.current = false;
    userCancelledWalletSync.current = false;
    userCancelledWalletImport.current = false;
    dateRestoreWalletPromise.current = null;
    walletUpdater.current = null;
    _refreshingMainState.current = false;
  }
  
  const delimitEnteredWalletPhrase = function(){
    // Remove any extra whitespaces
    let enteredTextCopy = enteredText.current;
    enteredTextCopy = enteredTextCopy.replace(/ +(?= )/g,'').trim();
    return(enteredTextCopy);
  }
  
  const confirmWallet = async function() {
    
    setIsAwaitingWalletVerification(true);

    let awaitedWalletPhrase = await walletPhrase;
    
    if (delimitEnteredWalletPhrase() === awaitedWalletPhrase) {
      
      // Create a wallet event listener
      walletUpdater = new walletListener(setCurrentSyncProgress, setBalances);
      walletUpdater.setWalletIsSynchronized(true);
      
      // initialize main page with listening, background sync, etc
      await _initMain();
      
      // If the user hit "Or go back" before the wallet finished building, abandon wallet creation
      // and do NOT proceed to wallet page
      if(userCancelledWalletConfirmation.current){
        userCancelledWalletConfirmation.current = false;
        setIsAwaitingWalletVerification(false);
        return;
      }
      
     lastHomePage.current = "Confirm_Wallet";
      
      setPhraseIsConfirmed(true,);
      setWalletIsSynced(true,);
      setCurrentHomePage("Wallet",);
      setIsAwaitingWalletVerification(false);
      
      qrcode.toDataURL(walletAddress.current, function(err, url){
          let code = <QR_Code url={url} />;
          setDepositQrCode(code);
        }
      );
    } else {
      setEnteredMnemonicIsValid(false);
      setIsAwaitingWalletVerification(false);
    }
  }
  
  const confirmAbortWalletSynchronization = async function() {
    let doAbort = confirm("All synchronization will be lost. Are you sure you wish to continue?");
    
    if (doAbort){
      setWalletPhrase("");
      setPhraseIsConfirmed(false);
      setWalletSyncProgress(0);
      setBalance(0);
      setAvailableBalance(0);
      setEnteredMnemonicIsValid(true);
      setEnteredHeightIsValid(true);
      setCurrentHomePage("Import_Wallet");

      /*
       * First, set a class variable so that the importWallet function 
       * can know that the wallet sync function finished because it was cancelled
       * and not because the wallet actually finished syncing
       */
     userCancelledWalletSync.current = true;      
      await wallet.current.stopSyncing();
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
  const gotoCurrentHomePage = function(pageName){
    customHistory.push("/");
    siteHistory.push("/");
    appHistory.push(pageName);
    setCurrentHomePage(pageName);
  }
  
  const makeCurrentSitePage = function(pageName) {
    if(pageName === "/sign_out"){
      let userConfirmedSignout = confirm("Are you sure you want to sign out of this wallet? If you did not record the seed phrase, you will permanently lose access to the wallet and any funds contained therin! Click 'Ok' to continue");
      if(userConfirmedSignout){
        logout();
      }
    } else {
      customHistory.push(pageName);
      siteHistory.push(pageName);
      appHistory.push(pageName);
      setCurrentSitePage(pageName);
    }
  }
  
  const confirmAnimationLoaded = function(){
    /*
     * For reasons I don't entirely understand, it is necessary to separate the <img>'s "onLoad" function
     * call from the change in state with a timeout delay - even if the delay is set to zero!
     * (NOTE: further research suggests that setTimeout(0) actually delays execution by about 10ms)
     * Otherwise, the imagie will not ACTUALLY finish loading 
     */
    setTimeout(() => {
      setAnimationIsLoaded(true);
    }, 0);
  }
  
  const cancelImport = function(){
    userCancelledWalletImport.current = true;
    logout();
  }
  
  const cancelConfirmation = function(){
    /*
     * If the user cancels the wallet import by hitting "or go back", wallet will remain a promise
     * to the cancelled wallet. "stopSyncing" must be run on this wallet, but cannot until the promise resolves
     * by which point the value of wallet may have changed do to the user generating a new phrase or 
     * importing a different wallet in the meantime.
     * Thus, userCancelledWalletConfirmation allows the app to keep track of the wallet and run "stopSyncing" 
     * on it when ready.
     */
    if(isAwaitingWalletVerification){
      userCancelledWalletConfirmation.current = true;
      setIsAwaitingWalletVerification(false);
    };
  }
  
  const notifyIntentToDeposit = function() {
    setIsAwaitingDeposit(true);
    setCurrentSitePage("/deposit");
  }
  
  const default_page = function(){
    return <h1>ERROR - invalid url path!</h1>
  }
  
    let notificationBar = null;
    if(walletIsSynced && !(balance > 0) && currentSitePage != "/deposit"){
      notificationBar = (
        <Notification_Bar 
          content = {
            <>
              No funds deposited.
              &thinsp;
              <Link 
                onClick = {notifyIntentToDeposit}
                to = "/deposit" 
              >
                click to deposit
              </Link>
            </>
          } 
        />
      );
    }
    
    if(animationIsLoaded){
      return(
        <div id="app_container">
          <Router history = {customHistory}>
            <Banner 
              walletIsSynced={walletIsSynced}
              flexLogo = {flexLogo}
              notifyIntentToDeposit = {notifyIntentToDeposit}
              setCurrentSitePage = {makeCurrentSitePage}
            />
            {notificationBar}
            <Switch>
            <Route exact path="/">
              {currentSitePage != "/" ? <Redirect to = {currentSitePage} /> : <Home
                generateWallet={generateWallet}
                confirmWallet={confirmWallet}
                restoreWallet={restoreWallet}
                setEnteredPhrase={setEnteredPhrase}
                logout={logout}
                walletSyncProgress = {walletSyncProgress}
                setRestoreHeight = {setRestoreHeight}
                walletPhrase = {walletPhrase}
                currentHomePage = {currentHomePage}
                balance = {balance}
                setCurrentHomePage = {gotoCurrentHomePage}
                setCurrentSitePage = {makeCurrentSitePage}
                lastHomePage = {lastHomePage.current}
                availableBalance = {availableBalance}
                confirmAbortWalletSynchronization = {confirmAbortWalletSynchronization}
                coreModuleLoaded = {coreModuleLoaded}
                keysModuleLoaded = {keysModuleLoaded}
                isGeneratingTxs = {isGeneratingTxs}
                startGeneratingTxs = {startGeneratingTxs}
                stopGeneratingTxs = {stopGeneratingTxs}
                transactionsGenerated = {transactionsGenerated}
                totalFees = {totalFees}
                createDateConversionWallet = {createDateConversionWallet}
                enteredMnemonicIsValid = {enteredMnemonicIsValid}
                enteredHeightIsValid = {enteredHeightIsValid}
                cancelImport = {cancelImport}
                cancelConfirmation = {cancelConfirmation}
                forceWait = {isAwaitingWalletVerification}
                transactionStatusMessage = {transactionStatusMessage}
            />}
          </Route>
          <Route path="/backup"> 
            {currentSitePage != "/backup" ? <Redirect to = {currentSitePage} /> : <Save_Phrase_Page 
        omit_buttons = {true} 
              text = {walletPhrase}
              verificationUrl = {currentSitePage}
            />}
          </Route>
          <Route path="/deposit">
            {currentSitePage != "/deposit" ? <Redirect to = {currentSitePage} /> : <Deposit
              depositQrCode = {depositQrCode}
              walletAddress = {walletAddress.current}
              xmrWasDeposited = {!isAwaitingDeposit}
              setCurrentSitePage = {makeCurrentSitePage}
              verificationUrl = {currentSitePage}
            />}
          </Route>
          <Route path="/withdraw">
          {currentSitePage != "/withdraw" ? <Redirect to = {currentSitePage} /> : <Withdraw
              availableBalance = {availableBalance}
              totalBalance = {balance}
              wallet = {wallet.current}
              isGeneratingTxs = {isGeneratingTxs}
            /> }
          </Route>
          <Route>
            <Redirect to = {currentSitePage} />
          </Route>
        </Switch>
      </Router>
    </div>
      );
    } else {
      return (
        <div id="spinner_loader">
          <Loading_Animation notifySpinnerLoaded = {confirmAnimationLoaded} hide={true} />
        </div>
      );
    }
}
            
/*
 * Print sync progress every X blocks.
 */
class walletListener extends MoneroWalletListener {
              
  constructor(setSyncProgressCallback, setBalancesCallback){
    super();
    this.setSyncProgressCallback = setSyncProgressCallback;
    this.setBalancesCallback = setBalancesCallback;
    this.syncResolution = 0.05;
    this.lastIncrement = 0;
    this.walletIsSynchronized = false;
  }
              
  onSyncProgress(height, startHeight, endHeight, percentDone, message) {
    this.setSyncProgressCallback(percentDone*100); 
    if (percentDone >= this.lastIncrement + this.syncResolution) {
      this.lastIncrement += this.syncResolution;
    }
  }
  
  onBalancesChanged(newBalance, newUnlockedBalance){
    this.setBalancesCallback(newBalance, newUnlockedBalance); 
  }
  
  setWalletIsSynchronized(value) {
    this.walletIsSynchronized = value;
  }
}
