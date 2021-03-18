/*
 * nOTE/TODO: 
 * 
 * Apparently router link elements override/inactivate "onClick" event
 * Thus we need to find an alternate solution
 * 
 * Here is the (pending) commit messag eto use when this is achieved:
 * 
 * Fix inline styles not applying to generate button
 * 
 * Also remove unneeded "walletIsFunded" state var from App.js
 */

import React, {useState} from 'react';
import {Page_Box, Page_Box_Margin, Page_Box_Line_Field} from "../Widgets.js";
import "./wallet.css";
import {UI_Button_Link} from "../Buttons.js";


/* TODO: implement button colors:
 *Start generating - Green (30de00)
 *Stop generating - Orange (f96749)
 *No Funds available - grey (939393)
 */

const XMR_AU_RATIO = 0.000000000001;

export default function Wallet(props){
  /*
   * PROPS:
   *   balance
   *   available_balance
   *   transactions
   *   fees
   *   isGeneratingTxs
   *   startGeneratingTxs
   *   stopGeneratingTxs
   */
  
  /* button cases
   * 1. Wallet has no available or pending funds
   *   -color:  grey
   *   -active: false
   *   -msg:    "Fund wallet before generating"
   * 2. Wallet has funds 
   *   -active: true
   *   2a. and is NOT "generating"
   *     -color:  green
   *     -msg:    "Start generating transactions"
   *   2b. and IS "generating" 
   *     2b1. and mouse is NOT hovering
   *       -color: grey
   *       -msg:    props.transactionStatusMessage
   *     2b2. and mouse IS hovering
   *       -color:  orange
   *       -msg:    "Pause transaction generation"
   */
  
  const buttonColors = {
      startGeneratingButtonColor: "#30de00",
      stopGeneratingButtonColor: "#f96749",
      stopGeneratingButtonClickColor: "#d74527",
      noFundsButtonColor: "#939393",
      startGeneratingButtonHoverColor: "#52ff22",
      startGeneratingButtonClickColor: "#10bc00"
  };
  
  // Define state for functional component
  const [mouseIsInButton, setMouseIsInButton] = useState(false);
  const [mouseIsClicked, setMouseIsClicked] = useState(false); 
  const [buttonColor, setButtonColor] = useState(buttonColors.noFundsButtonColor);
  
  let buttonHandleContinue = null;
  let buttonTextElement = null;
  let buttonIsActive = false;
  
  // Wallet has available or pending fuds
  if(props.balance > 0){
    /*
     * 2. Wallet has funds
     */ 
    buttonIsActive = true;
    
    if(props.isGeneratingTxs){
      /*
       *   2b. and IS "generating"
       */ 
      buttonHandleContinue = props.stopGeneratingTxs;
      
      if(!mouseIsInButton){
        /*     2b1. and mouse is NOT hovering
	 *       -color: grey
	 *       -msg:    props.transactionStatusMessage
	 */
        buttonTextElement = <>{props.transactionStatusMessage}</>;
        if(buttonColor != buttonColors.noFundsButtonColor) {
          setButtonColor(buttonColors.noFundsButtonColor);
        }
      } else {
        /*     2b2. and mouse IS hovering
         *       -color:  orange
         *       -msg:    "Pause transaction generation"
         */
        buttonTextElement = <>Pause transaction generation</>
        
        if(mouseIsClicked){
          if(buttonColor != buttonColors.stopGeneratingButtonClickColor){
            setButtonColor(buttonColors.stopGeneratingButtonClickColor);
          }
        } else {
          if(buttonColor != buttonColors.stopGeneratingButtonColor) {
        
            setButtonColor(buttonColors.stopGeneratingButtonColor);
          }
        }
      }
    } else {
      buttonTextElement = <>Start generating transactions</>;
      buttonHandleContinue = props.startGeneratingTxs;
      if(mouseIsInButton){
	if(mouseIsClicked) {
	  if(buttonColor != buttonColors.startGeneratingButtonClickColor) {
	    setButtonColor(buttonColors.startGeneratingButtonClickColor);
	  }
	} else {
	  if(buttonColor != buttonColors.startGeneratingButtonHoverColor) {
	    setButtonColor(buttonColors.startGeneratingButtonHoverColor);
	  }
	}
      } else {
	if(buttonColor != buttonColors.startGeneratingButtonColor) {
          setButtonColor(buttonColors.startGeneratingButtonColor);
        }
      }
    }
  } else {
    /*
     * * 1. Wallet has no available or pending funds
   *   -color:  grey
   *   -active: false
   *   -msg:    "Fund wallet before generating"
     */
    buttonTextElement = <>Fund wallet before generating transactions</>
    buttonIsActive = false;
    if(buttonColor != buttonColors.noFundsButtonColor) {
      setButtonColor(buttonColors.noFundsButtonColor);
    }
  }
  
  return(
    <Page_Box className="wallet_page_box">
      <div 
        className="lines_page_container" 
        style = {{width: "80%"}} 
      >
        <Page_Box_Line_Field label = "Balance" value={props.balance * XMR_AU_RATIO + " XMR"} />
        <Page_Box_Line_Field label = "Available balance" value={props.availableBalance * XMR_AU_RATIO + " XMR"} />
        <Page_Box_Line_Field label = "Transactions generated" value={props.transactionsGenerated} />
        <Page_Box_Line_Field label = "Total fees" value={props.totalFees * XMR_AU_RATIO + " XMR"} />
        <Page_Box_Margin />
        <div className="wallet_page_button_container">
          <UI_Button_Link 
            handleClick = {buttonHandleContinue}
            destination="/" 
            isactive={buttonIsActive}
            style={{backgroundColor: buttonColor}}
            onMouseEnter={
              function () {
                setMouseIsInButton(true);
              }
            }
            onMouseLeave={
              function () {
                setMouseIsInButton(false);
              }
            }
            onMouseDown={
              function() {
        	setMouseIsClicked(true);
              }
            }
            onMouseUp={
              function() {
        	setMouseIsClicked(false);
              }  
            }
          >
            {buttonTextElement}
          </UI_Button_Link>
        </div>
      </div>
    </Page_Box>
  );
}