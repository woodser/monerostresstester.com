import React from 'react';
import ReactDOM from 'react-dom';

// Import home sub-pages
import Welcome from './Welcome.js';
import Save_Phrase_Page from './Save_Phrase_Page.js';
import Sync_Wallet_Page from './Sync_Wallet_Page.js';
import Enter_Phrase_Page from './Enter_Phrase_Page.js';
import Wallet from "./Wallet.js";

import {UI_Button_Link, UI_Text_Link} from '../Buttons.js';
import {Page_Box, Page_Text_Box, Page_Text_Entry, Header, Progress_Bar, Main_Content, Loading_Animation} from '../Widgets.js';

const DEFAULT_BACKUP_PHRASE_STRING = "Enter backup phrase";

function Home(props) {
  let renderItem = null;
  let buttonContents = null;
  switch(props.currentHomePage){
    case "Welcome":
      renderItem =
        <Welcome
          handleContinue={props.generateWallet}
          handleBack={props.createDateConversionWallet}
          setCurrentHomePage={props.setCurrentHomePage}
          continueDestination="Save_Phrase_Page"
          backDestination="Import_Wallet"
        />;
      break;
    case "Save_Phrase_Page":
      renderItem =
        <Save_Phrase_Page 
          text={props.walletPhrase}
          handleRegenerate={props.generateWallet}
          handleBack={props.resetState}
          continueDestination="Confirm_Wallet"
          backDestination="Welcome"
          setCurrentHomePage = {props.setCurrentHomePage}
        />;
      break;
    case "Confirm_Wallet":
      if(props.forceWait){
        buttonContents=
          <div className="center_double_elements_container">
            <span className="center_double_elements_item_1">Creating wallet...</span>
            <span className="center_double_elements_item_2"><Loading_Animation /></span>
          </div>
	} else {
	  buttonContents = <>Continue</>
	}
        renderItem = 
  	<Enter_Phrase_Page
          header="Confirm your backup phrase" 
          handleTextChange={props.setEnteredPhrase} 
          handleContinue={props.confirmWallet}
          backDestination="Save_Phrase_Page"
          handleBack={props.cancelConfirmation}
          setCurrentHomePage={props.setCurrentHomePage}
          buttonsAreActive={props.enteredMnemonicIsValid && !props.forceWait}
          isValid={props.enteredMnemonicIsValid}
          buttonContents = {buttonContents}
        />;
      break;
    case "Import_Wallet": 
      if(props.forceWait){
        buttonContents =
          <div className="center_double_elements_container">
            <span className="center_double_elements_item_1">Importing wallet...</span>
            <span className="center_double_elements_item_2"><Loading_Animation /></span>
          </div>
      } else {
        buttonContents = <>Continue</>
      }
      renderItem = 
        <Enter_Phrase_Page
          header="Import existing wallet" 
          handleTextChange={props.setEnteredPhrase} 
          handleContinue={props.restoreWallet}
          handleBack={props.cancelImport}
          backDestination="Welcome"
          textEntryIsActive={!props.importPageForceWait}
          buttonsAreActive={!props.forceWait && props.enteredMnemonicIsValid && props.enteredHeightIsValid}
          isValid={props.enteredMnemonicIsValid}
          setCurrentHomePage = {props.setCurrentHomePage}
          buttonContents={buttonContents}
        >
          <Page_Text_Entry 
            isDefault={true} 
            isSingleLineEntry={true}
            className="enter_restore_height_box"
            placeholder="Enter restore height or date (YYYY-MM-DD)" 
            handleTextChange={props.setRestoreHeight}
            isactive={!props.importPageForceWait}
            isValid={props.enteredHeightIsValid}
          />
        </Enter_Phrase_Page>;
      break;
    case "Sync_Wallet_Page":
      renderItem =
        <Sync_Wallet_Page
          progress={props.walletSyncProgress}
          backDestination={props.lastHomePage}
          setCurrentHomePage={props.confirmAbortWalletSynchronization}
        />;
      break;
    case "Wallet":
      renderItem =
        <Wallet
          balance={props.balance}
          availableBalance={props.availableBalance}
          isGeneratingTxs = {props.isGeneratingTxs}
          startGeneratingTxs = {props.startGeneratingTxs}
          stopGeneratingTxs = {props.stopGeneratingTxs}
          transactionsGenerated = {props.transactionsGenerated}
          totalFees = {props.totalFees}
          transactionStatusMessage = {props.transactionStatusMessage}
        />;
      break;
    }
  return (
    <div id="home">   
      {renderItem} 
    </div>
  );
}

/*
function Confirm_Phrase() {
  return (

  );
}

function Backup_Phrase() {
  return (

  );
}

function Synchronize_Wallet() {
  return (

  );
}

function Generate_Transactions() {
  return (

  );
}
*/

export default Home;