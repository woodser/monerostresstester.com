import React from 'react';
import ReactDOM from 'react-dom';
import './home.css';
import {Route, Switch, Link, useRouteMatch} from "react-router-dom";
import {UI_Button_Link, Regenerate_Phrase_Button} from '../Buttons.js';
import {Page_Box, Page_Text_Box, Page_Text_Entry, Header} from '../Widgets.js';

const DEFAULT_BACKUP_PHRASE_STRING = "Enter backup phrase";

export default function Home(props){
  let {path, url} = useRouteMatch();

  let generateWallet = props.generateWallet;
  let deleteWallet = props.deleteWallet;
  let walletPhrase = props.walletPhrase;
  let handleConfirm = props.handleConfirm;
  return (
    <div id="home">
      <Switch>
        <Route exact path={path} render={(props) => <Welcome
          {...props}
          handleContinue={generateWallet}
        />} />
        <Route path={`${path}/new_wallet`} render={(props) => <New_Wallet {...props}
          text={walletPhrase}
          handleRegenerate={generateWallet}
          handleBack={deleteWallet}
        />} />
        <Route path={`${path}/import_wallet`} component={Import_Wallet} />
        <Route path={`${path}/confirm_phrase`}
          text={walletPhrase}
          defaultEntryString={DEFAULT_BACKUP_PHRASE_STRING}
          handleContinue={handleConfirm}
          component={Confirm_Phrase}
        />
      </Switch>
    </div>
  );
}

// The initial home page
function Welcome(props) {
  return (
    <Page_Box>
      <div className="title"> Welcome to <b>MoneroStressTester.com</b></div>
      <div className="sub_title">Open-source, client-side transaction generator</div>
      <UI_Button_Link className="blue_button" button_text="Create New Wallet" destination={`${props.match.url}/new_wallet`} handleClick={props.handleContinue}/>
      <UI_Button_Link className="clear_button" button_text="Or Import Existing Wallet" destination={`${props.match.url}/import_wallet`} />
    </Page_Box>
  );
}

/*
 * Home sub-pages
 */
function New_Wallet(props) {
  return(
    <Page_Box>
      <Header text="Save your backup phrase" margin_content=<Regenerate_Phrase_Button handleClick={props.handleRegenerate}/>/>
      <Page_Text_Box box_text={props.text} />
      <div className="save_phrase_box_bottom_margin"></div>
      <UI_Button_Link className="blue_button" button_text="Continue" destination={`${props.match.url}/confirm_phrase`} />
      <UI_Button_Link className="clear_button" button_text="Or Go Back" destination='/home' handleClick={props.handleBack}/>
    </Page_Box>
  );
}

function Enter_Phrase_Page(props) {
  //Save your backup phrase
  return(
    <Page_Box>
      <Header text={props.header}/>
      <Page_Text_Entry isDefault={true} value="Enter backup phrase..."/>
      <div className="save_phrase_box_bottom_margin"></div>
      <UI_Button_Link className="blue_button" buttonText="Continue" destination={props.match.url} handleClick={props.handleContinue}/>
      <UI_Button_Link className="clear_button" buttonText="Or Go Back" destination={props.back_destination} handleClick={props.handleBack} />
    </Page_Box>
  );
}

function Confirm_Phrase(props) {
  //Save your backup phrase
  return(
    <Enter_Phrase_Page header="Confirm your backup phrase" back_destination={`${props.url}/new_wallet`} />
  );
}

function Import_Wallet(props) {
  return(
    <Enter_Phrase_Page header="Enter your backup phrase" back_destination='/home' />
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
