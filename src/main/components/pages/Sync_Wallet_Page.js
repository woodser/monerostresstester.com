import React from "react";
import ReactDOM from "react-dom";

import {Page_Box, Page_Box_Margin, Header, Main_Content, Progress_Bar, Loading_Animation} from '../Widgets.js';
import {UI_Text_Link} from '../Buttons.js';

export default function Sync_Wallet_Page(props) {
  
  let headerAndContent = null;
  
  headerAndContent = (
    <Page_Box className="page_box_flex">
      <Header text="Synchronizing Wallet" />" +
      <Page_Box_Margin />
      <Main_Content>
        <Progress_Bar progress={props.progress}/>
      </Main_Content>
      <Page_Box_Margin height="30px" />
      <div className="home_button_links">
        <UI_Text_Link 
          link_text="Go Back"
          destination={props.backDestination}
          setCurrentHomePage={props.setCurrentHomePage}
        />
      </div>	
    </Page_Box>
  );
  
  return (
    <>
    {headerAndContent}
    </>
  );
}