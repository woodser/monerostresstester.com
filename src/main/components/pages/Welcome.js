import React from 'react';
import ReactDOM from 'react-dom';
import './home.css';
import {Page_Box} from '../Widgets.js';
import {UI_Text_Link, UI_Button_Link} from '../Buttons.js';

// The initial home page
export default function Welcome(props) {
  return (
    <Page_Box className = "home_subpage_box">
      <div className="title"> Welcome to <b>MoneroStressTester.com</b></div>
      <div className="sub_title">Open-source, client-side transaction generator</div>
      <div className="home_button_links">
      	<UI_Button_Link 
      	  link_text="Create New Wallet" 
      	  destination={props.continueDestination} 
      	  handleClick={props.handleContinue}
      	  setCurrentHomePage={props.setCurrentHomePage}/>
      	<UI_Text_Link 
      	  link_text="Or Import Existing Wallet"
      	  destination={props.backDestination}
      	  setCurrentHomePage={props.setCurrentHomePage}/>
      </div>
    </Page_Box>
  );
}