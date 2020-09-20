import React from 'react';
import ReactDOM from 'react-dom';
import {Page_Box, Header, Main_Content, Page_Text_Entry} from '../Widgets.js';
import {UI_Button_Link, UI_Text_Link} from '../Buttons.js';

import './home.css';

export default function Enter_Phrase_Page(props) {
  //Save your backup phrase
  return(
    <Page_Box className="home_subpage_box">
      <Header text={props.header}/>
      <Main_Content>
      	<Page_Text_Entry 
      	  isDefault={true} 
      	  className="enter_phrase_box "
	  placeholder="Enter backup phrase..." 
	  handleTextChange={props.handleTextChange}
	/>
	{props.children}
      </Main_Content>
      <div className="save_phrase_box_bottom_margin"></div>
      <div className="home_button_links">
      	<UI_Button_Link 
      	  link_text="Continue" 
      	  destination={props.continueDestination} 
      	  handleClick={props.handleContinue}
      	  setCurrentHomePage={props.setCurrentHomePage}
      	/>
      	<UI_Text_Link 
      	  link_text="Or Go Back" 
      	  destination={props.backDestination} 
      	  handleClick={props.handleBack} 
      	  setCurrentHomePage={props.setCurrentHomePage}
      	/>
      </div>
    </Page_Box>
  );
}