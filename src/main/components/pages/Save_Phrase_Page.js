import React from 'react';
import ReactDOM from 'react-dom';
import './save_phrase_page.css';
import {Page_Box, Page_Box_Margin, Page_Text_Box, Main_Content, Header, Loading_Animation} from '../Widgets.js';
import {UI_Text_Link, UI_Button_Link, Text_Box_Top_Right_Link_Button} from '../Buttons.js';
import warningImage from '../../img/warning.png'

export default function Save_Phrase_Page(props) {
  
  let mainContent = null;
  let regenerateButtonSpace = undefined;
  let buttonLinks = undefined;
  
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
  
  if(!props.omit_buttons){ // The new wallet and backup pages are nearly identical EXCEPT backup lacks buttons
    regenerateButtonSpace = (
      <div style = {{width: "100%"}}>
        <Text_Box_Top_Right_Link_Button 
          handleClick = {props.handleRegenerate} 
          text = "Regenerate"
        />
      </div>
    );
    
    buttonLinks = (
      <div className="home_button_links">
        <UI_Button_Link
          destination={props.continueDestination} 
          setCurrentPage = {props.setCurrentHomePage}
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
          setCurrentPage = {props.setCurrentHomePage}/>
      </div>
    );
  }
  
  return(
    <Page_Box className = "page_box_flex">
      <Header 
        text="Save your backup phrase"
      />
      
      <Page_Box_Margin />
      
      <div className = "sub_title" style = {{display: "flex", flexDirection: "row"}}>
        <span>
        <img 
          className = "warning_image"
          src = {warningImage}
          alt = "Caution sign"
        />
        </span>
        <span>
          Do not lose your backup phrase
        </span>
      </div>
      
      <Page_Box_Margin />
      
      {regenerateButtonSpace}
      {mainContent}
      
      <Page_Box_Margin />
      
      {buttonLinks}
    </Page_Box>
  );
}

