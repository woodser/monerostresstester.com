/*
 * TODO:
 * Spinny wheels for "continue" buttons while generating/relaying TX on respective sub-pages
 * add "sending transaction" and remove "or go back"button when user hits the "send" button
 * display the approximate time until the total balance becomes available on the TX creation page
 * Add green checkmark graphic to left of "Transaction Sent" title on TX review page
 * remove lines from "line" fields on confirmation and review pages (but not initial creation page!)
 * !!! Clicking on text field should not make it blank; placeholder text should ALWAYS be visible if input field is "blank" of user input
     Even if the user deletes previously typed input to make it "blank" again!
 */

import React, {useState} from 'react';
import {Page_Box, Page_Box_Margin, Page_Box_Line_Field, Main_Content, Header, Page_Text_Entry, Loading_Animation} from "../Widgets.js";
import {UI_Button_Link, UI_Text_Link, Text_Box_Top_Right_Link_Button} from "../Buttons.js";

const monerojs = require("monero-javascript");
const BigInteger = monerojs.BigInteger;
const MoneroUtils = monerojs.MoneroUtils;
const MoneroNetworkType = monerojs.MoneroNetworkType;

export default function Withdraw(props){  
  
  // Vars
  const withdrawAmountSendAllText = "All available funds";
  const withdrawAmountTextPrompt = 'Enter amount to withdraw or click "Send all" to withdraw all funds';
  const withdrawAddressTextPrompt = "Enter destination wallet address..";
  
  // Declare state
  const [enteredWithdrawAddressIsValid, setEnteredWithdrawAddressIsValid] = useState(true);
  const [enteredWithdrawAmountIsValid, setEnteredWithdrawAmountIsValid] = useState(true);
  
  const [enteredWithdrawAddress, setEnteredWithdrawAddress] = useState("");
  const [enteredWithdrawAddressText, setEnteredWithdrawAddressText] = useState("");
  const [enteredWithdrawAmount, setEnteredWithdrawAmount] = useState(BigInteger(0));
  const [enteredWithdrawAmountText, setEnteredWithdrawAmountText] = useState("");  
  
  const [withdrawTxsStatus, setWithdrawTxsStatus] = useState("");
  const [withdrawTxIsCompleted, setWithdrawTxIsCompleted] = useState(false);
  
  const [withdrawInfo, setWithdrawInfo] = useState([]);
  const [txHashListJsxElements, setTxHashListJsxElements] = useState([]);
  const [txKeyListJsxElements, setTxKeyListJsxElements] = useState([]);
  
  const [withdrawTxs, setWithdrawTxs] = useState(null);
  const [usingAllFunds, setUsingAllFunds] = useState(false);
  
  
  const changeWithdrawAddress = function(address){
      // Validate the address
      if(MoneroUtils.isValidAddress(address, MoneroNetworkType.STAGENET) | address === ""){ // An empty address ("") is always considered valid
        setEnteredWithdrawAddressIsValid(true);
      } else {
        setEnteredWithdrawAddressIsValid(false);
      }
      setEnteredWithdrawAddress(address);
      setEnteredWithdrawAddressText(address);

  }
  
  const changeWithdrawAmount = function(amount) {
    setEnteredWithdrawAmountIsValid(true);
    
    // Re-add checking for invalid values (non-numbers, <1AU or >availBal, etc
    
    // TODO: Make sure amount is a valid, positive number:
    if(amount === "" || usingAllFunds){
      setEnteredWithdrawAmountIsValid(true);
    } else {
    let amountAsNumber = Number(amount);
    if(amountAsNumber != NaN) {
      if(amountAsNumber >  0) {
        //TODO: make sure amount is larger than 1 AU
	
	// convert amount to AU
	let amountInAu = null;
	
	try {
	  amountInAu = MoneroUtils.xmrToAtomicUnits(amount);    
	} catch (e) {
	  setEnteredAmountIsValid(false);
	}    
	if(amountInAu != null) {
	  // make sure amount >= 1 AU
	  if(amountInAu.compare(0) > 0 && amountInAu < props.availableBalance){
            setEnteredWithdrawAmount(amountInAu);
	  } else {
	    setEnteredWithdrawAmountIsValid(false);
	  }
	}
        
      } else {
	setEnteredWithdrawAmountIsValid(false);
      }
    } else {
      setEnteredWithdrawAmountIsValid(false);
    }
    }
    setEnteredWithdrawAmountText(amount);
  }
  
  const changeWithdrawAmountWithText = function(amount, text) {
    setEnteredWithdrawAmount(amount),
    setEnteredWithdrawAmountText(text)
  }
  
  // Runs when the user clicks "Send all" above the withdraw send amount field
  const prepareToSendAllFunds = function() {
    changeWithdrawAmountWithText(props.availableBalance, withdrawAmountSendAllText);
    setUsingAllFunds(true);
  }
  
  const createWithdrawTxs = async function() {
    
    // someFunctionToSetWithdrawPageButtonToSpinnyWheel()
    
    setWithdrawTxsStatus("creating");
    let txCreationWasSuccessful = true;
    let withdraw = null;
    
    try {
      if(usingAllFunds) {
        withdraw = await props.wallet.sweepUnlocked({
          address: enteredWithdrawAddress
        });
      } else {
	
	/* withdrawTxs will always be an array of length 1 if the user did not press the "send all" button
	 * However, use an array just the same for consistency with a full balance withdraw
	 * as sweepUnlocked returns an array of Txs
	 * 
	 * Later code will then need not distinguish between a withdrawTxs created by createTx vs sweepUnlocked
	 */
	withdraw = await props.wallet.createTxs({
	  address: enteredWithdrawAddress,
	  amount: enteredWithdrawAmount,
	  accountIndex: 0
	});

      }
    } catch(e) {
      console.log("Error creating tx: " + e);
      setWithdrawTxsStatus("");
      txCreationWasSuccessful = false;  
    }
    
    if(txCreationWasSuccessful){
      
      let newWithdrawInfo = new Array(withdraw.length);
      let newWithdrawHashes = [];
      let newWithdrawKeys = [];
      
      for(let i = 0; i < newWithdrawInfo.length; i++){
        newWithdrawInfo[i] = {
          withdrawAddress: enteredWithdrawAddress,
          withdrawAmount: withdraw[i].getOutgoingAmount(),
          withdrawFee: withdraw[i].getFee().toString()
        };
        
        newWithdrawHashes.push(withdraw[i].getHash());
        newWithdrawKeys.push(withdraw[i].getKey());
      }
      
      setTxHashListJsxElements(newWithdrawHashes.map(
        hash => 
          <div key={hash}>
            {hash}
          </div>
      ));
      setTxKeyListJsxElements(newWithdrawKeys.map(
	key => 
	  <div key={key}>
	    {key}
	  </div>
      ));
      
      setWithdrawInfo(newWithdrawInfo);
      
      setWithdrawTxsStatus("");
      setWithdrawTxs(withdraw);
    }
  }
  
  const relaywithdrawTxs = async function() {
    setWithdrawTxsStatus("relaying");
    
    let relayTxWasSuccessful = true;
    
    for (let i = 0; i < withdrawInfo.length; i++){
      try {
        await props.wallet.relayTx(withdrawTxs[i]);
      } catch (e) {
        relayTxWasSuccessful = false;
        console.log("Error relaying Tx: " + e);
        break;
      }
    }  
    
    if (relayTxWasSuccessful) {
      setWithdrawTxs(null);
      setEnteredWithdrawAddressIsValid(true);
      setEnteredWithdrawAmountIsValid(true);
      setEnteredWithdrawAddress("");
      setEnteredWithdrawAddressText("Enter destination wallet address..");
      setEnteredWithdrawAmount("");
      setEnteredWithdrawAmountText('Enter amount or click "send all" to send all funds');
      setWithdrawTxIsCompleted(true);
      setWithdrawTxs(null);
    }
    setWithdrawTxsStatus("");
  }  
  
  const resetWithdrawPage = function() {
    setWithdrawTxs(null);
    setWithdrawInfo([]);
    setTxHashListJsxElements([]);
    setTxKeyListJsxElements([]);
    setEnteredWithdrawAddress("");
    setEnteredWithdrawAddressText("Enter destination wallet address..");
    setEnteredWithdrawAmountText('Enter amount or click "send all" to send all funds');
    setWithdrawTxIsCompleted(false);
    setEnteredWithdrawAmount("");
    setWithdrawTxsStatus("");
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
  
  const cancelWithdraw = function(){
    setWithdrawInfo([]);
  }
  
  let XMR_AU_RATIO = 0.000000000001;
  
  let withdrawPageBox = null;
  let withdrawButtonIsActive = 
    enteredWithdrawAddressIsValid && 
    enteredWithdrawAmountIsValid &&
    !props.isGeneratingTxs &&
    !(withdrawTxsStatus === "creating") &&
    props.isConnectedToDaemon;
  
  let totalWithdrawAmount = BigInteger();
  let totalWithdrawFee = BigInteger();
  if(withdrawInfo.length >= 1) {
    for (let i = 0; i < withdrawInfo.length; i++){
      // Get the total withdraw amount and fee for all TXs in the withdraw
      totalWithdrawAmount = totalWithdrawAmount.add(withdrawInfo[i].withdrawAmount);
      totalWithdrawFee = totalWithdrawFee.add(withdrawInfo[i].withdrawFee);
    }
  }
  
  // Label hashes and keys lists with singular/plural nouns depending on number of Txs in withdraw
  let txHashListLabel = "Withdraw hash";
  let txKeyListLabel = "Withdraw key";
  if(withdrawInfo.length > 1) {
    txHashListLabel = "Withdraw hashes";
    txKeyListLabel = "Withdraw keys";
  }
  
  /*
   * THE JSX
   * This is the actual JSX code that displays the withdraw page component.
   * It is broken into three "phases" or sub-pages
   * 
   * Page 1 - the withdraw transaction creation page takes a destination address and a send amount from the user
   * Page 2 - the withdraw confirmation page displays the details of the withdraw transaction 
   *   and gives the user the option to back out of the transaction if one or more details are incorrect or
   *   unacceptable
   * Page 3 - the withdraw review page shows all of the data for the completed withdraw transaction and allows
   *   the user to start another withdraw
   */
  
  const handleAmountFieldClick = function(){
    if(usingAllFunds){
      setUsingAllFunds(false);
      changeWithdrawAmount("");
    }
  }
  
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
    
    let createWithdrawButtonContents = "Withdraw";
    if(props.isGeneratingTxs){
      createWithdrawButtonContents = "Pause to withdraw";
    } else if(withdrawTxsStatus === "creating"){
      createWithdrawButtonContents =
        <div className="center_double_elements_container">
          <span className="center_double_elements_item_1">Creating transaction</span>
          <span className="center_double_elements_item_2"><Loading_Animation /></span>
        </div>
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
            value={MoneroUtils.atomicUnitsToXmr(BigInteger(props.availableBalance)) + " XMR"}
            field_style = "horizontal" 
          />
          <Page_Box_Line_Field 
            label = "Total balance" 
            value = {MoneroUtils.atomicUnitsToXmr(BigInteger(props.totalBalance)) + " XMR"} 
            field_style = "horizontal"
          />
        </div>
        
        <div style = {{
          display: "flex",
          flexDirection: "row"
        }}>
          <span style = {{float: "left", fontSize: "24px"}}>Address</span>
        </div>
        <Page_Text_Entry 
	  handleTextChange = {changeWithdrawAddress}
      	  isactive = {withdrawTxsStatus === ""}
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
          handleClick = {handleAmountFieldClick}
          isValid = {enteredWithdrawAmountIsValid}
          isactive = {true}
          style = {amountTextAlignStyle}
          overrideValue = {amountOverrideValue}
          defaultValue = {withdrawAmountTextPrompt}
        />
   
        <Page_Box_Margin />

        <UI_Button_Link
          handleClick = {createWithdrawTxs}
          isactive = {withdrawButtonIsActive}
        >
          {createWithdrawButtonContents}
        </UI_Button_Link>
        </Main_Content>
      </Page_Box>
    );
  } else if (!withdrawTxIsCompleted) {
    
    let cancelWithdrawLinkSection = 
      <UI_Text_Link
        handleClick = {cancelWithdraw}
        isactive = {true}
        link_text = "Or go back"
      />
        
    let confirmWithdrawButtonContents = "Confirm";
    let confirmWithdrawButtonIsActive = true;
    if(withdrawTxsStatus === "relaying"){
      confirmWithdrawButtonContents =
        <div className="center_double_elements_container">
          <span className="center_double_elements_item_1">Sending transaction</span>
          <span className="center_double_elements_item_2"><Loading_Animation /></span>
        </div>;
      cancelWithdrawLinkSection = <></>
      confirmWithdrawButtonIsActive = false;
    }
    
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
              value = {MoneroUtils.atomicUnitsToXmr(totalWithdrawAmount) + " XMR"}
              field_style = "vertical"
            />
            <Page_Box_Line_Field 
              label = "Fee" 
              value = {MoneroUtils.atomicUnitsToXmr(BigInteger(totalWithdrawFee)) + " XMR"} 
              field_style = "vertical"
            />
            <Page_Box_Line_Field
              label = {txHashListLabel}
              value={txHashListJsxElements}
              field_style = "vertical"
            />
            <Page_Box_Line_Field
              label = {txKeyListLabel}
              value={txKeyListJsxElements} 
              field_style = "vertical"
            />
            <Page_Box_Margin />
            <UI_Button_Link 
              handleClick = {relaywithdrawTxs}
              isactive = {confirmWithdrawButtonIsActive}
            >
              {confirmWithdrawButtonContents}
            </UI_Button_Link>
            {cancelWithdrawLinkSection}
          </div>
        </Main_Content>
      </Page_Box>
    );
  } else {
    withdrawPageBox = (
      <Page_Box>
        <Main_Content>
          <Header
            text="Withdraw sent!"
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
              value = {MoneroUtils.atomicUnitsToXmr(totalWithdrawAmount) + " XMR"} 
              field_style = "vertical"
            />
            <Page_Box_Line_Field
              label = "Fee"
              value = {MoneroUtils.atomicUnitsToXmr(BigInteger(totalWithdrawFee)) + " XMR"} 
              field_style = "vertical"
            />
            <Page_Box_Line_Field
              label = {txHashListLabel}
              value={txHashListJsxElements}
              field_style = "vertical"
            />
            <Page_Box_Line_Field
              label = {txKeyListLabel}
              value={txKeyListJsxElements} 
              field_style = "vertical"
            />
            <Page_Box_Margin />
            <UI_Text_Link 
              link_text="Start another withdraw" 
              handleClick={resetWithdrawPage} 
              overrideStyle = {{fontSize: "34px"}}
            />
          </div>
        </Main_Content>
      </Page_Box>
    );
  }
  
  return withdrawPageBox;
}
