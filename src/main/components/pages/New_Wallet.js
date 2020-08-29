import React from 'react';
import ReactDOM from 'react-dom';
import './home.css';
import {Page_Box, Page_Text_Box, Main_Content, Header} from '../Widgets.js';
import {UI_Text_Link, UI_Button_Link, Regenerate_Phrase_Button} from '../Buttons.js';

export default function New_Wallet(props) {
  return(
    <Page_Box className = "home_subpage_box">
      <Header text="Save your backup phrase" margin_content=<Regenerate_Phrase_Button handleClick={props.handleRegenerate}/>/>
      <Main_Content>
      	<Page_Text_Box box_text={props.text} />
      </Main_Content>
      <div className="save_phrase_box_bottom_margin"></div>
      <div className="home_button_links">
        <UI_Button_Link link_text="Continue" destination={props.continueDestination} setCurrentHomePage = {props.setCurrentHomePage}/>
        <UI_Text_Link link_text="Or Go Back" destination={props.backDestination} handleClick={props.handleBack} setCurrentHomePage = {props.setCurrentHomePage}/>
      </div>
    </Page_Box>
  );
}