import React, {useState} from 'react';
import {Page_Box, Page_Box_Margin, Page_Box_Line_Field, Main_Content, Header, Page_Text_Entry} from "../Widgets.js";
import {UI_Button_Link, UI_Text_Link, Text_Box_Top_Right_Link_Button} from "../Buttons.js";
import XMR_Au_Converter from '../../XMR_Au_Converter.js';

const monerojs = require("monero-javascript");
const BigInteger = monerojs.BigInteger;


/*
 * --- TODO ---
 * This component needs to be divided into three separate "pages" (in the same way that Home is divided into pages)
 * 1. Specify withdraw information
 * 2. Confirm withdraw information
 * 3. completed transaction info display
 * 
 * The work below represents only #3.
 */

export default function Withdraw(props){  
  
  /*
   * NOTE: both of these functions should only run if their corresponding text fields are either
   * 1. The default value or
   * 2. A special value - in this case amountField set to "All available funds"
   */
  
  const handleAmountFieldClick = function(){
      props.clearEnteredAmountText();
  }
  const handleAddressFieldClick = function(){
    props.clearEnteredAddressText();
    
  }
  
  let XMR_AU_RATIO = 0.000000000001;
  
  let withdrawPageBox = null;
  let buttonIsActive = props.enteredWithdrawAddressIsValid && props.enteredWithdrawAmountIsValid;
  
  if(props.withdrawInfo.length < 1) {
    // User has not yet entered TX details. Show TX detail entry page
    
    // The strings/values to be inserted into the text fields by App.js (as these fields are parent-controlled)
    let amountValue = props.enteredWithdrawAmount;
    let addressValue = props.enteredWithdrawAddress;
    
    let amountTextAlignStyle = {textAlign: "left"};
    // If the user clicked "Send all" above the amount box, right align text
    if(props.overrideWithdrawAmountText != null){
      amountTextAlignStyle = {textAlign: "right"}
    }
    
    let withdrawButtonText = "Withdraw";
    if(props.withdrawTxStatus === "creating"){
      let withdrawButtonText = "Creating transaction";
    }
    
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
            value={XMR_Au_Converter.atomicUnitsToXmr(BigInteger(props.availableBalance)) + " XMR"}
            field_style = "horizontal" 
          />
          <Page_Box_Line_Field 
            label = "Total balance" 
            value = {XMR_Au_Converter.atomicUnitsToXmr(BigInteger(props.totalBalance)) + " XMR"} 
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
	  handleTextChange={props.handleAddressChange}
          handleClick={handleAddressFieldClick}
      	  isactive={props.textEntryIsActive === undefined ? true : props.textEntryIsActive}
      	  isValid={props.enteredWithdrawAddressIsValid}
          value = {addressValue}
	/>
        <Page_Box_Margin />
        
        <span style = {{fontSize: "24px"}}>Amount</span>
        <Text_Box_Top_Right_Link_Button
          style = {{float: "right"}}
          handleClick = {props.sendAllFunds}
          text = "Send all"
        / > 
        <Page_Text_Entry 
          isSingleLineEntry={true}
          handleTextChange={props.handleAmountChange}
          isValid = {props.enteredWithdrawAmountIsValid}
          isactive = {true}
          parentControlledText = {props.overrideWithdrawAmountText}
          style = {amountTextAlignStyle}
          handleClick = {handleAmountFieldClick}
          value = {amountValue}
        />
        <UI_Button_Link 
          link_text = "Withdraw" 
          handleClick = {props.submitWithdrawInfo}
          isactive = {buttonIsActive}
        >
          {withdrawButtonText}
        </UI_Button_Link>
        </Main_Content>
      </Page_Box>
    );
  } else if (!props.withdrawTxIsCompleted) {
    console.log("The user has entered withdraw info and the TX was created, however it has not been relayed yet");
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
              value={props.withdrawInfo[0].withdrawAddress}
              field_style = "vertical" 
            />
            <Page_Box_Line_Field 
              label = "Amount" 
              value = {props.withdrawInfo[0].withdrawAmount + " XMR"} 
              field_style = "vertical"
            />
            <Page_Box_Line_Field 
              label = "Fee" 
              value = {props.withdrawInfo[0].withdrawFee + " XMR"} 
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
            value={props.withdrawInfo[0].withdrawAddress}
            field_style = "vertical" 
          />
          <Page_Box_Line_Field 
            label = "Amount" 
            value = {props.withdrawInfo[0].withdrawAmount + " XMR"} 
            field_style = "vertical"
          />
          <Page_Box_Line_Field
            label = "Fee"
            value = {props.withdrawInfo[0].withdrawFee + " XMR"} 
            field_style = "vertical"
          />
          <Page_Box_Line_Field
            label = "Transaction Hash"
            value={props.withdrawInfo[0].withdrawHash}
            field_style = "vertical"
          />
          <Page_Box_Line_Field
            label = "Transaction Key"
            value={props.withdrawInfo[0].withdrawKey + " XMR"} 
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
