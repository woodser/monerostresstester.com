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
import {Page_Box, Page_Text_Box, Page_Text_Entry, Header, Progress_Bar, Main_Content} from '../Widgets.js';

const DEFAULT_BACKUP_PHRASE_STRING = "Enter backup phrase";

class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      currentHomePage: "Welcome"
    }
  }
  
  render() {
    let generateWallet = this.props.generateWallet;
    let deleteWallet = this.props.deleteWallet;
    let walletPhrase = this.props.walletPhrase;
    let confirmWallet = this.props.confirmWallet;
    let walletSyncProgress = this.props.walletSyncProgress;
    let setEnteredPhrase = this.props.setEnteredPhrase;
    let restoreWallet = this.props.restoreWallet;
    let setRestoreHeight = this.props.setRestoreHeight;
    let currentHomePage = this.props.currentHomePage;
    let setCurrentHomePage = this.props.setCurrentHomePage;
    let balance = this.props.balance;
    let availableBalance = this.props.availableBalance;
    let lastHomePage = this.props.lastHomePage;
    
    let renderItem = null;
    
    console.log("According to Home.js's render function, currentHomePage = " + currentHomePage);
    
    switch(currentHomePage){
      case "Welcome":
        renderItem =
  	<Welcome
  	  handleContinue={generateWallet}
            setCurrentHomePage={setCurrentHomePage}
            continueDestination="New_Wallet"
            backDestination="Import_Wallet"
          />;
        break;
      case "New_Wallet":
        renderItem =
  	<New_Wallet 
            text={walletPhrase}
            handleRegenerate={generateWallet}
            handleBack={deleteWallet}
            setCurrentHomePage={setCurrentHomePage}
            continueDestination="Confirm_Wallet"
            backDestination="Welcome"
          />;
        break;
      case "Confirm_Wallet":
        renderItem = 
  	<Enter_Phrase_Page
            header="Confirm your backup phrase" 
            handleTextChange={setEnteredPhrase} 
            handleContinue={confirmWallet}
            setCurrentHomePage={setCurrentHomePage}
            continueDestination="Sync_Wallet_Page"
            backDestination="New_Wallet"
          />;
        break;
      case "Import_Wallet": 
        renderItem = 
  	<Enter_Phrase_Page
          header="Import existing wallet" 
          handleTextChange={setEnteredPhrase} 
          handleContinue={restoreWallet}
          setCurrentHomePage={setCurrentHomePage}
          continueDestination="Sync_Wallet_Page"
          backDestination="Welcome"
        >
          <Page_Text_Entry 
            isDefault={true} 
            className="enter_restore_height_box"
              value="Enter restore height or date (YYYY/MM/DD)" 
              handleTextChange={setRestoreHeight}
          />
        </Enter_Phrase_Page>;
        break;
      case "Sync_Wallet_Page":
        renderItem =
  	<Sync_Wallet_Page
            progress={walletSyncProgress}
            backDestination={lastHomePage}
            setCurrentHomePage={setCurrentHomePage}
          />;
        break;
      case "Wallet":
        renderItem =
  	<Wallet
  	  balance={balance}
            availableBalance={availableBalance}
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