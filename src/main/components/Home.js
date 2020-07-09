import React from 'react';
import ReactDOM from 'react-dom';
import './home.css';

function Page_Box(props) {
  return (
    <div className="page_box">
      {props.children}
    </div>
  );
}

//buttons
function Blue_Button(props) {
  <button className="blue_button" label={props.text} />
}


function Home_Welcome_Box() {
  return (
    <Page_Box>
      <div className="title"> Welcome to <b>MoneroStressTester.com</b></div>
      <div className="sub_title">Open-source, client-side transaction generator</div>

        <div className="blue_button button">Create New Wallet</div>

        <div className="clear_button button">Or Import Existing</div>

    </Page_Box>
  );
}

/*
function Save_Phrase() {
  return (

  );
}

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
      <Home_Welcome_Box />
    </div>
  );
}
