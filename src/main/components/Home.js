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
      <button className="blue_button" label="Create New Wallet" />
      <button className="clear_button" label="Or Import Existing" />
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
    <div id="home">
      <Home_Welcome_box />
    </div>
  );
}
