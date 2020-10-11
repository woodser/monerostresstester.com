import React from 'react';
import ReactDOM from 'react-dom';
import './home.css';

// Import home sub-pages
import Welcome from './Welcome.js';
import New_Wallet from './New_Wallet.js';
import Sync_Wallet_Page from './Sync_Wallet_Page.js';
import Enter_Phrase_Page from './Enter_Phrase_Page.js';
import Wallet from "./Wallet.js";

import {UI_Button_Link, UI_Text_Link, Regenerate_Phrase_Button} from '../Buttons.js';
import {Page_Box, Page_Text_Box, Page_Text_Entry, Header, Progress_Bar, Main_Content, Loading_Animation} from '../Widgets.js';

const DEFAULT_BACKUP_PHRASE_STRING = "Enter backup phrase";

class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      currentHomePage: "Welcome"
    }
  }
  
  render() {
    let renderItem = null;
    
    switch(this.props.currentHomePage){
      case "Welcome":
        renderItem =
  	<Welcome
  	  handleContinue={this.props.generateWallet}
          handleBack={this.props.createDateConversionWallet}
          setCurrentHomePage={this.props.setCurrentHomePage}
          continueDestination="New_Wallet"
          backDestination="Import_Wallet"
        />;
        break;
      case "New_Wallet":
        renderItem =
  	<New_Wallet 
            text={this.props.walletPhrase}
            handleRegenerate={this.props.generateWallet}
            handleBack={this.props.resetState}
            continueDestination="Confirm_Wallet"
            backDestination="Welcome"
            keysModuleLoaded = {this.props.keysModuleLoaded}
            setCurrentHomePage = {this.props.setCurrentHomePage}
          />;
        break;
      case "Confirm_Wallet":
        renderItem = 
  	<Enter_Phrase_Page
            header="Confirm your backup phrase" 
            handleTextChange={this.props.setEnteredPhrase} 
            handleContinue={this.props.confirmWallet}
            backDestination="New_Wallet"
            setCurrentHomePage={this.props.setCurrentHomePage}
            buttonsAreActive={this.props.enteredMnemonicIsValid}
            isValid={this.props.enteredMnemonicIsValid}
            buttonContents = {<>Continue</>}
          />;
        break;
      case "Import_Wallet": 
	let buttonContents = null;
	if(this.props.importPageForceWait){
	  buttonContents =
	  <div className="double_button_contents_container">
            <span className="double_button_item_1">Verifying...</span>
            <span className="double_button_item_2"><Loading_Animation /></span>
          </div>
	} else {
	  buttonContents = <>Continue</>
	}
        renderItem = 
  	<Enter_Phrase_Page
          header="Import existing wallet" 
          handleTextChange={this.props.setEnteredPhrase} 
          handleContinue={this.props.restoreWallet}
          handleBack={this.props.resetState}
          backDestination="Welcome"
          textEntryIsActive={!this.props.importPageForceWait}
          buttonsAreActive={!this.props.importPageForceWait && this.props.enteredMnemonicIsValid && this.props.enteredHeightIsValid}
          isValid={this.props.enteredMnemonicIsValid}
          setCurrentHomePage = {this.props.setCurrentHomePage}
          buttonContents={buttonContents}
        >
          <Page_Text_Entry 
            isDefault={true} 
            isSingleLineEntry={true}
            className="enter_restore_height_box"
            placeholder="Enter restore height or date (YYYY-MM-DD)" 
            handleTextChange={this.props.setRestoreHeight}
            isactive={!this.props.importPageForceWait}
            isValid={this.props.enteredHeightIsValid}
          />
        </Enter_Phrase_Page>;
        break;
      case "Sync_Wallet_Page":
        renderItem =
  	<Sync_Wallet_Page
            progress={this.props.walletSyncProgress}
            backDestination={this.props.lastHomePage}
            setCurrentHomePage={this.props.confirmAbortWalletSynchronization}
          />;
        break;
      case "Wallet":
        renderItem =
  	<Wallet
  	  balance={this.props.balance}
          availableBalance={this.props.availableBalance}
          isGeneratingTxs = {this.props.isGeneratingTxs}
          walletIsFunded = {this.props.walletIsFunded}
          startGeneratingTxs = {this.props.startGeneratingTxs}
          stopGeneratingTxs = {this.props.stopGeneratingTxs}
          transactionsGenerated = {this.props.transactionsGenerated}
          totalFee = {this.props.totalFee}
        />;
        break;
    }
    return (
      <div id="home">   
        {renderItem} 
      </div>
    );
  }
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