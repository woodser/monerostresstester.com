import React from 'react';
import ReactDOM from 'react-dom';
import './home.css';
import {BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import {UI_Button_Link, Regenerate_Phrase_Button} from '../Buttons.js';
import {Page_Box, Page_Text_Box} from '../Widgets.js';

export default function Home(){
  return (
    /*
     * Home_Welcome_Box classes:
     * title
     * sub_title
     * header
     * main_content
     * blue_button
     * clear_button
     */
    <div id="home">
      <Router>
        <Switch>
          <Route path="/" exact render={() => <Home_Welcome_Box />} />
          <Route path="/new_wallet" render={() => <New_Wallet />} />
          <Route path="/import_wallet" render={() => <New_Wallet />} />
        </Switch>
      </Router>
    </div>
  );
}

// The initial home page
function Home_Welcome_Box() {
  return (
    <Page_Box>
      <div className="title"> Welcome to <b>MoneroStressTester.com</b></div>
      <div className="sub_title">Open-source, client-side transaction generator</div>
      <UI_Button_Link className="blue_button" buttonText="Create New Wallet" destination="/new_wallet" />
      <UI_Button_Link className="clear_button" buttonText="Or Import Existing" destination="/import_wallet" />
    </Page_Box>
  );
}

/*
 * Home sub-pages
 */
function New_Wallet(props) {
  //Save your backup phrase
  return(
    <Page_Box>
      <div className="header">Save your backup phrase</div>
      <Regenerate_Phrase_Button />
      <Page_Text_Box boxText="tamper tutor urgent satin sanity slower union germs itself bagpipe obnoxious otherwise jerseys viewpoint daily abyss elope locker skew putty river tether amaze betting sanity"/>
      <div className="save_phrase_box_bottom_margin"></div>
      <UI_Button_Link className="blue_button" buttonText="Continue" destination="/new_wallet" />
      <UI_Button_Link className="clear_button" buttonText="Or Go Back" destination="/" />
    </Page_Box>
  );
}

function Import_Wallet(props) {
  return(
    <div>empty</div>
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
