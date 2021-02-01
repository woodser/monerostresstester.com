import React, {useState} from 'react';
import {Page_Box, Page_Box_Margin, Page_Box_Line_Field, Main_Content, Header, Page_Text_Entry} from "../Widgets.js";
import {UI_Button_Link, UI_Text_Link, Text_Box_Top_Right_Link_Button} from "../Buttons.js";

/*
 * --- TODO ---
 * This component needs to be divided into three separate "pages" (in the same way that Home is divided into pages)
 * 1. Specify withdraw information
 * 2. Confirm withdraw information
 * 3. completed transaction info display
 * 
 * The work below represents only #3.
 */

const XMR_AU_RATIO = 0.000000000001;

export default function Withdraw(props){  
  
  let XMR_AU_RATIO = 0.000000000001;
  
  console.log("props.withdrawInfo: ");
  for(const property in props.withdrawInfo){
    console.log(`${property}: ${props.withdrawInfo.property}`);
  }
  console.log("withdrawInfo stringified: " + JSON.stringify(props.withdrawInfo));
  
  let withdrawPageBox = null;
  console.log("enteredAddressIsValid: " + props.enteredAddressIsValid + "; enteredAmountIsValid: " + props.enteredAmountIsValid);
  let buttonIsActive = props.enteredAddressIsValid && props.enteredAmountIsValid;
  
  if(props.withdrawInfo.withdrawAddress == null) {
    // User has not yet entered TX details. Show TX detail entry page
    console.log("User has not yet entered TX details. Show TX detail entry page");    
    
    withdrawPageBox = (
      <Page_Box>
        <Main_Content>
        <Header 
          text="Withdraw" 
          omit_bottom_margin={true}
        />
        <div className="lines_page_container">
          <Page_Box_Line_Field 
            label = "Available balance" 
            value={props.availableBalance * XMR_AU_RATIO + " XMR"}
            field_style = "horizontal" 
          />
          <Page_Box_Line_Field 
            label = "Total balance" 
            value = {props.totalBalance * XMR_AU_RATIO + " XMR"} 
            field_style = "horizontal"
          />
          <Page_Box_Margin />
        </div>
        
        <div style = {{
          display: "flex",
          flexDirection: "row"
        }}>
          <span style = {{float: "left", fontSize: "24px"}}>Address</span>
        </div>
        <Page_Text_Entry 
      	  isDefault={true}
	  placeholder="Enter destination wallet address..." 
	  handleTextChange={props.handleAddressChange}
      	  isactive={props.textEntryIsActive === undefined ? true : props.textEntryIsActive}
      	  isValid={props.enteredAddressIsValid}
	/>
        <Page_Box_Margin />
        
        <span style = {{fontSize: "24px"}}>Amount</span>
        <Text_Box_Top_Right_Link_Button
          style = {{float: "right"}}
          handleClick = {props.handleSendAllFunds}
          text = "Send all"
        / > 
        <Page_Text_Entry 
          isDefault={true} 
          isSingleLineEntry={true}
          placeholder='Enter amount or click "send all" to send all funds' 
          handleTextChange={props.handleAmountChange}
          isValid = {props.enteredAmountIsValid}
          isactive = {true}
        />
        <UI_Button_Link 
          link_text = "Withdraw" 
          handleClick = {props.submitWithdrawInfo}
          isactive = {buttonIsActive}
        >
          Withdraw
        </UI_Button_Link>
        </Main_Content>
      </Page_Box>
    );
  } else if (props.withdrawInfo.withdrawHash == null) {
    console.log("Address defined but withdraw hash NOT defined; showing withdraw confirmation page...");
    withdrawPageBox = (
      <Page_Box>
        <Main_Content>
          <Header 
            text = "Confirm Withdraw" 
            useBottomMargin = {false}
          />
          <div className="lines_page_container">
            <Page_Box_Line_Field 
              label = "Address" 
              value={props.withdrawInfo.withdrawAddress}
              field_style = "vertical" 
            />
            <Page_Box_Line_Field 
              label = "Amount" 
              value = {props.withdrawInfo.withdrawAmount * XMR_AU_RATIO + " XMR"} 
              field_style = "vertical"
            />
            <Page_Box_Line_Field 
              label = "Fee" 
              value = {props.withdrawInfo.withdrawFee * XMR_AU_RATIO + " XMR"} 
              field_style = "vertical"
            />
            <Page_Box_Margin />
            <UI_Button_Link 
              link_text = "Confirm withdraw" 
              handleClick = {props.confirmWithdraw}
              isactive = {true}
            >
              Withdraw
            </UI_Button_Link>
          </div>
        </Main_Content>
      </Page_Box>
    );
  } else {
    console.log("All withdraw info defined. Showing TX details");
    withdrawPageBox = (
      <Page_Box>
        <Main_Content>
        <Header>Withdraw sent!</Header>
        <div className="lines_page_container">
          <Page_Box_Line_Field 
            label = "Address" 
            value={props.withdrawInfo.withdrawAddress}
            field_style = "vertical" 
          />
          <Page_Box_Line_Field 
            label = "Amount" 
            value = {props.withdrawInfo.withdrawAmount * XMR_AU_RATIO + " XMR"} 
            field_style = "vertical"
          />
          <Page_Box_Line_Field
            label = "Fee"
            value = {props.withdrawInfo.withdrawFee * XMR_AU_RATIO + " XMR"} 
            field_style = "vertical"
          />
          <Page_Box_Line_Field
            label = "Transaction Hash"
            value={props.withdrawInfo.withdrawHash}
            field_style = "vertical"
          />
          <Page_Box_Line_Field
            label = "Transaction Key"
            value={props.withdrawInfo.withdrawKey + " XMR"} 
            field_style = "vertical"
          />
          <Page_Box_Margin />
          <UI_Text_Link 
            link_text="Start another withdraw" 
            handleClick={props.resetWithdrawPage} 
          />
        </div>
        </Main_Content>
      </Page_Box>
    );
  }
  
  return withdrawPageBox;
}
