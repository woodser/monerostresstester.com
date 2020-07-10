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
    <Router>
      <div id="home">
        <Home_Welcome_Box />
      </div>
      <Switch>
        <Route path="/new_wallet" exact render={() => <New_Wallet />} />
        <Route path="/import_wallet" exact render={() => <New_Wallet />} />
      </Switch>
    </Router>
  );
}

function Page_Box(props) {
  return (
    <div className="page_box">
      {props.children}
    </div>
  );
}

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

//buttons
function UI_Button_Link(props) {
  return(
    <Link to={props.destination} className={"link_button " + props.className}>
      <div className="button_text">
        {props.buttonText}
      </div>
    </Link>
  );
}

function Save_Phrase_Box(props) {
  return(
    <div className="save_phrase_box">
      {props.phrase}
    </div>
  );
}

function Regenerate_Phrase_Button() {
  return(
    <div className="button regenerate_button">Regenerate</div>
  );
}

function New_Wallet(props) {
  //Save your backup phrase
  return(
    <Page_Box>
      <div className="header">Save your backup phrase</div>
      <Regenerate_Phrase_Button />
      <Save_Phrase_Box phrase="tamper tutor urgent satin sanity slower union germs itself bagpipe obnoxious otherwise jerseys viewpoint daily abyss elope locker skew putty river tether amaze betting sanity"/>
      <UI_Button_Link className="blue_button" buttonText="Continue" destination="/new_wallet" />
      <UI_Button_Link className="clear_button" buttonText="Or Go Back" destination="/import_walet" />
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
