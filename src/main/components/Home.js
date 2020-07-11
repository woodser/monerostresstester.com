import React from 'react';
import ReactDOM from 'react-dom';
import './home.css';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

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

// A generic container for the common "box format" of most of the home sub-pages
function Page_Box(props) {
  return (
    <div className="page_box">
      {props.children}
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
      <UI_Button_Link className="clear_button" buttonText="Or Import Existing" destination="/import_walet" />
    </Page_Box>
  );
}

function Save_Phrase_Box(props) {
  return(
    <div className="save_phrase_box main_content">
      {
      /*
       * Add top and bottom padding to space top and bottom edges of the text
       * box specific distances from the text within
       */
      }
      <div className="save_phrase_box_padding">
        {props.phrase}
      </div>
    </div>
  );
}

/*
 * home page box buttons
 */

// Component for the common "button link" used in the bottom of the page_box home pages
function UI_Button_Link(props) {
  return(
    <Link to={props.destination} className={"link_button " + props.className}>
      <div className="button_text">
        {props.buttonText}
      </div>
    </Link>
  );
}

// Component for the unique "Regenerate" button in the wallet generation sub-page
function Regenerate_Phrase_Button() {
  return(
    <div className="regenerate_button_container">
      <div className="regenerate_button_left_spacer"></div>
      <div className="regenerate_button">
        Regenerate
      </div>
    </div>
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
      <div className="regenerate_phrase_button_bottom_margin"></div>
      <Save_Phrase_Box phrase="tamper tutor urgent satin sanity slower union germs itself bagpipe obnoxious otherwise jerseys viewpoint daily abyss elope locker skew putty river tether amaze betting sanity"/>
      <div className="save_phrase_box_bottom_margin"></div>
      <UI_Button_Link className="sub_page_link_button blue_button" buttonText="Continue" destination="/new_wallet" />
      <UI_Button_Link className="sub_page_link_button clear_button" buttonText="Or Go Back" destination="/" />
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
