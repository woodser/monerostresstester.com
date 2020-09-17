import React from "react";
import ReactDOM from "react-dom";

import {Page_Box, Header, Main_Content, Progress_Bar, Loading_Animation} from '../Widgets.js';
import {UI_Text_Link} from '../Buttons.js';
import './home.css';

export default function Sync_Wallet_Page(props) {
  
  let headerAndContent = null;
  
  if(props.isCancellingSync){
    headerAndContent = (
      <Page_Box className="home_subpage_box">	
        <Header text="Cancelling wallet synchronization" />
        <Main_Content>
          <Loading_Animation loadingAnimation = {props.loadingAnimation} />
        </Main_Content>
      </Page_Box>
    );
  } else {
    headerAndContent = (
      <Page_Box className="home_subpage_box">
        <Header text="Synchronizing Wallet" />
        <Main_Content>
          <Progress_Bar progress={props.progress}/>
        </Main_Content>
        <div className="home_button_links">
          <UI_Text_Link link_text="Go Back"
            destination={props.backDestination}
            setCurrentHomePage={props.setCurrentHomePage}
          />
        </div>	
      </Page_Box>
    );
    
  }
  
  return (
    <>
    {headerAndContent}
    </>
  );
}