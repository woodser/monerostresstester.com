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
  
  // Vars
  const withdrawAmountSendAllText = "All available funds";
  const withdrawAmountTextPrompt = 'Enter amount to withdraw or click "Send all" to withdraw all funds';
  const withdrawAddressTextPrompt = "Enter destination wallet address..";
  
  // Declare state
  const [enteredWithdrawAddressIsValid, setEnteredWithdrawAddressIsValid] = useState(true);
  const [enteredWithdrawAmountIsValid, setEnteredWithdrawAmountIsValid] = useState(true);
  
  const [enteredWithdrawAddress, setEnteredWithdrawAddress] = useState("");
  const [enteredWithdrawAddressText, setEnteredWithdrawAddressText] = useState("");
  const [enteredWithdrawAmount, setEnteredWithdrawAmount] = useState("");
  const [enteredWithdrawAmountText, setEnteredWithdrawAmountText] = useState("");  
  
  const [withdrawTxStatus, setWithdrawTxStatus] = useState("");
  const [withdrawTxIsCompleted, setWithdrawTxIsCompleted] = useState(false);
  const [withdrawInfo, setWithdrawInfo] = useState([]);
  
  const [usingAllFunds, setUsingAllFunds] = useState(false);
  
  const changeWithdrawAddress = function(address){
      // Validate the address
      if(address.match(/[45][0-9AB][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{93}/)){
        setEnteredWithdrawAddressIsValid(true);
      } else {
        setEnteredWithdrawAddressIsValid(false);
      }
      
      console.log("Entered address: " + address);
      console.log("Entered address is valid? " + enteredWithdrawAddressIsValid);
      
      setEnteredWithdrawAddress(address);
      setEnteredWithdrawAddressText(address);

  }
  
  const changeWithdrawAmount = function(amount) {
    
    console.log("The XMR value the user typed (converted to number via Number()): " + Number(amount));
    console.log("The value converted by XMR_Au_Converter: " + XMR_Au_Converter.xmrToAtomicUnits(amount));
    
    //Re-add checking for invalid values (non-numbers, <1AU or >availBal, etc
    let convertedAmount = 0;
    try {
      convertedAmount = XMR_Au_Converter.xmrToAtomicUnits(amount);
    } catch(e){
      console.log("Error converting entered amount to atomic units: " + e);
      return;
    }
    setEnteredWithdrawAmount(convertedAmount),
    setEnteredWithdrawAmountText(amount)

  }
  
  const changeWithdrawAmountWithText = function(amount, text) {
    
    console.log("The XMR value the user typed (converted to number via Number()): " + Number(amount));
    console.log("The value converted by XMR_Au_Converter: " + XMR_Au_Converter.xmrToAtomicUnits(amount.toString()));
    
    //Re-add checking for invalid values (non-numbers, <1AU or >availBal, etc
    let convertedAmount = 0;
    try {
      convertedAmount = XMR_Au_Converter.xmrToAtomicUnits(amount);
    } catch(e){
      console.log("Error converting entered amount to atomic units: " + e);
      return;
    }
    setEnteredWithdrawAmount(convertedAmount),
    setEnteredWithdrawAmountText(text)

  }
  
  // Runs when the user clicks "Send all" above the withdraw send amount field
  const prepareToSendAllFunds = function() {
    changeWithdrawAmountWithText(props.availableBalance, withdrawAmountSendAllText);
    setUsingAllFunds(true);
    console.log("setUsingAllFunds to true");
  }
  
  const createWithdrawTx = async function() {
    
    // someFunctionToSetWithdrawPageButtonToSpinnyWheel()
    
    let withdraw = null;
    
    setWithdrawTxStatus("creating");
    let txCreationWasSuccessful = true;
    
    try {
      if(usingAllFunds) {
        withdrawTx = await props.wallet.sweepUnlocked({
          address: enteredWithdrawAddress,
          accountIndex: 0
        });
      } else {
	
	console.log("Attempting to send partial balance");
	/* withdrawTx will always be an array of length 1 if the user did not press the "send all" button
	 * However, use an array just the same for consistency with a full balance withdraw
	 * as sweepUnlocked returns an array of Txs
	 * 
	 * Later code will then need not distinguish between a withdrawTx created by createTx vs sweepUnlocked
	 */
	withdrawTx = new Array(1);
	withdrawTx[0] = await props.wallet.createTx({
	  address: enteredWithdrawAddress,
	  amount: enteredWithdrawAmount,
	  accountIndex: 0
	});

      }
    } catch(e) {
      console.log("Error creating tx: " + e);
      setWithdrawTxStatus("");
      txCreationWasSuccessful = false;  
    }
    
    if(txCreationWasSuccessful){
      
      console.log("withdrawTx: " + this.withdrawTx.toString());
      
      console.log("this.withdrawTx is an object of type: " + this.withdrawTx.constructor.toString());
      console.log("LLKJSLKFJSLKFJSLKFSLKFSKLJDF");
      console.log("");
      console.log("The withdraw fee is " + this.withdrawTx[0].getFee());
      console.log("");
      console.log("lkajsf;lkajsdf;ljsdlkfjas;lkfjsa;lkfjs;alkjsdaf");
      let newWithdrawInfo = new Array(this.withdrawTx.length);
      for(let i = 0; i < newWithdrawInfo.length; i++){
        newWithdrawInfo[i] = {
          withdrawAddress: enteredWithdrawAddress,
          withdrawAmount: XMR_Au_Converter.atomicUnitsToXmr(withdrawTx[i].getOutgoingAmount()),
          withdrawFee: XMR_Au_Converter.atomicUnitsToXmr(BigInteger(withdrawTx[i].getFee().toString())),
          withdrawHash: withdrawTx[i].getHash(),
          withdrawKey: withdrawTx[i].getKey()
        };
      }
      console.log("Successfully created Tx! : " + JSON.stringify(newWithdrawInfo));
      setwithdrawInfo(newWithdrawInfo);
      setWithdrawTxStatus("");
    }
  }
  
  const relayWithdrawTx = async function() {
    setWithdrawTxStatus("relaying");
    
    let relayTxWasSuccessful = true;
    let newWithdrawInfo = [...withdrawInfo];
    
    for (let i = 0; i < newWithdrawInfo.length; i++){
      await this.wallet.relayTx(this.withdrawTx[i]).catch (
        function(e) {
          relayTxWasSuccessful = false;
          console.log("Error relaying Tx: " + e);
        }
      );
    }  
    
    if (relayTxWasSuccessful) {
      console.log("Transaction was successfully relayed!");
      setWithdrawTx(null);
      setWithdrawTxStatus("");
      setEnteredWithdrawAddressIsValid(true);
      setEnteredWithdrawAmountIsValid(true);
      setEnteredWithdrawAddress("");
      setEnteredWithdrawAddressText("Enter destination wallet address..");
      setEnteredWithdrawAmount("");
      setEnteredWithdrawAmountText('Enter amount or click "send all" to send all funds');
      setWithdrawTxIsCompleted(true);
    }
  }  
  
  const resetWithdrawPage = function() {
    setWithdrawTx(null);
    setCurrentWithdrawInfo([]);
    setEnteredWithdrawAddress("");
    setEnteredWithdrawAddressText("Enter destination wallet address..");
    setEnteredWithdrawAmountText('Enter amount or click "send all" to send all funds');
    setWithdrawTxIsCompleted(false);
    setEnteredWithdrawAmount("");
    withdrawTxStatus("");
    setEnteredWithdrawAmountIsValid(true);
    setEnteredWithdrawAddressIsValid(true);
  }  
  
  const setWithdrawAddressAndAmount = function() {
    let newWithdrawInfo = {};
    newWithdrawInfo = Object.assign(newWithdrawInfo, withdrawInfo);
    newWithdrawInfo.withdrawAddress = enteredWithdrawAddress;
    newWithdrawInfo.withdrawAmount = enteredWithdrawAmount;
    setWithdrawInfo(newWithdrawInfo);
  }
  
  const handleAmountFieldClick = function(){
    if(
      enteredWithdrawAmountText === withdrawAmountTextPrompt || 
      usingAllFunds
    ) { // Only clear on click if field is default or "send all" value
      console.log("Clearing entered amount text");
      setEnteredWithdrawAmount("");
      setEnteredWithdrawAmountText("");
      setUsingAllFunds(false);
      console.log("set usingAllFunds to false due to amountfield click");
    }
  }
  
  const handleAddressFieldClick = function(){
    setEnteredWithdrawAddress("");
    setEnteredWithdrawAddressText("");
  }
  
  let XMR_AU_RATIO = 0.000000000001;
  
  let withdrawPageBox = null;
  let buttonIsActive = enteredWithdrawAddressIsValid && enteredWithdrawAmountIsValid;
  
  let withdrawTx = null;
  
  if(withdrawInfo.length < 1) {
    // User has not yet entered TX details. Show TX detail entry page
    
    // The strings/values to be inserted into the text fields by App.js (as these fields are parent-controlled)
    let amountValue = enteredWithdrawAmount;
    let addressValue = enteredWithdrawAddress;
    
    let amountTextAlignStyle = {textAlign: "left"};
    // If the user clicked "Send all" above the amount box, right align text
    if(enteredWithdrawAmountText === withdrawAmountSendAllText){
      amountTextAlignStyle = {textAlign: "right"}
    }
    
    // check if entered amount and entered amount text are equal. If not, override amount field text with "Send all"
    let amountOverrideValue = null;
    if (usingAllFunds) {
      amountOverrideValue = withdrawAmountSendAllText;  
    } else {
      amountOverrideValue = null;
    }
    let withdrawButtonText = "Withdraw";
    if(withdrawTxStatus === "creating"){
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
	  handleTextChange = {changeWithdrawAddress}
          handleClick = {handleAddressFieldClick}
      	  isactive = {withdrawTxStatus === ""}
      	  isValid = {enteredWithdrawAddressIsValid}
          defaultValue = {withdrawAddressTextPrompt}
	/>
        <Page_Box_Margin />
        
        <span style = {{fontSize: "24px"}}>Amount</span>
        <Text_Box_Top_Right_Link_Button
          style = {{float: "right"}}
          handleClick = {prepareToSendAllFunds}
          text = "Send all"
        / > 
        <Page_Text_Entry 
          isSingleLineEntry={true}
          handleTextChange={changeWithdrawAmount}
          isValid = {enteredWithdrawAmountIsValid}
          isactive = {true}
          style = {amountTextAlignStyle}
          handleClick = {handleAmountFieldClick}
          overrideValue = {amountOverrideValue}
          defaultValue = {withdrawAmountTextPrompt}
        />
        <UI_Button_Link 
          link_text = "Withdraw" 
          handleClick = {createWithdrawTx}
          isactive = {buttonIsActive}
        >
          {withdrawButtonText}
        </UI_Button_Link>
        </Main_Content>
      </Page_Box>
    );
  } else if (!withdrawTxIsCompleted) {
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
              value={withdrawInfo[0].withdrawAddress}
              field_style = "vertical" 
            />
            <Page_Box_Line_Field 
              label = "Amount" 
              value = {withdrawInfo[0].withdrawAmount + " XMR"} 
              field_style = "vertical"
            />
            <Page_Box_Line_Field 
              label = "Fee" 
              value = {withdrawInfo[0].withdrawFee + " XMR"} 
              field_style = "vertical"
            />
            <Page_Box_Margin />
            <UI_Button_Link 
              link_text = "Confirm withdraw" 
              handleClick = {relayWithdrawTx}
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
            value={withdrawInfo[0].withdrawAddress}
            field_style = "vertical" 
          />
          <Page_Box_Line_Field 
            label = "Amount" 
            value = {withdrawInfo[0].withdrawAmount + " XMR"} 
            field_style = "vertical"
          />
          <Page_Box_Line_Field
            label = "Fee"
            value = {withdrawInfo[0].withdrawFee + " XMR"} 
            field_style = "vertical"
          />
          <Page_Box_Line_Field
            label = "Transaction Hash"
            value={withdrawInfo[0].withdrawHash}
            field_style = "vertical"
          />
          <Page_Box_Line_Field
            label = "Transaction Key"
            value={withdrawInfo[0].withdrawKey + " XMR"} 
            field_style = "vertical"
          />
          <Page_Box_Margin />
          <UI_Text_Link 
            link_text="Start another withdraw" 
            handleClick={resetWithdrawPage} 
          />
        </div>
        </Main_Content>
      </Page_Box>
    );
  }
  
  return withdrawPageBox;
}
