import React from 'react';
import ReactDOM from 'react-dom';
import './home.css';
import './new_wallet.css';
import {Page_Box, Page_Text_Box, Main_Content, Header, Loading_Animation} from '../Widgets.js';
import {UI_Text_Link, UI_Button_Link} from '../Buttons.js';

export default function New_Wallet(props) {
  
  let mainContent = null;
  
  if (props.text) {
    mainContent = (
      <Main_Content>
        <Page_Text_Box box_text={props.text} />
      </Main_Content>
    );
  } else {
  
    mainContent = (
      <Main_Content>
        <div className="page_text_box_space">
          <Loading_Animation />
        </div>
      </Main_Content>
    );
  }
  
  return(
    <Page_Box className = "home_subpage_box_flex">
      <Header 
        text="Save your backup phrase" 
        margin_content=<Regenerate_Phrase_Button handleClick={props.handleRegenerate}/>
      />
      {mainContent}
      <div className="save_phrase_box_bottom_margin"></div>
      <div className="home_button_links">
        <UI_Button_Link
          destination={props.continueDestination} 
          setCurrentHomePage = {props.setCurrentHomePage}
          isActive = {props.text ? true : false}
        >
          <>
            Continue
          </>
        </UI_Button_Link>
        <UI_Text_Link 
          link_text="Or Go Back" 
          destination={props.backDestination} 
          handleClick={props.handleBack} 
          setCurrentHomePage = {props.setCurrentHomePage}/>
      </div>
    </Page_Box>
  );
}

//Component for the unique "Regenerate" button in the wallet generation sub-page
function Regenerate_Phrase_Button(props) {
  return(
      <a className="regenerate_button" onClick={props.handleClick}>Regenerate</a>
  );
}