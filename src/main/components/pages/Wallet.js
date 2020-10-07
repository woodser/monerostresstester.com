import React from 'react';
import {Page_Box} from "../Widgets.js";
import "./wallet.css";
import {UI_Button_Link} from "../Buttons.js";

const XMR_AU_RATIO = 0.000000000001;

export default function Wallet(props){
  /*
   * PROPS:
   *   balance
   *   available_balance
   *   transactions
   *   fees
   *   isGeneratingTxs
   *   walletIsFunded
   *   startGeneratingTxs
   *   stopGeneratingTxs
   */
  
  let buttonHandleContinue = null;
  let buttonText = null;
  let buttonIsActive = false;
  
  if(props.walletIsFunded){
    buttonIsActive = true;
    if(props.isGeneratingTxs){
      buttonText = "Stop generating transactions";
      buttonHandleContinue = props.stopGeneratingTxs;
    } else {
      buttonText = "Start generating transactions";
      buttonHandleContinue = props.startGeneratingTxs;
    }
    
  } else {
    buttonText="Fund wallet before generating transactions"
    buttonIsActive=false;
  }
  
  return(
    <Page_Box className="wallet_page_box">
      <div className="wallet_page_sections_container">
        <Wallet_Page_Section label = "Balance" value={props.balance * XMR_AU_RATIO + " XMR"} />
        <Wallet_Page_Section label = "Available balance" value={props.availableBalance * XMR_AU_RATIO + " XMR"} />
        <Wallet_Page_Section label = "Transactions generated" value={props.transactionsGenerated} />
        <Wallet_Page_Section label = "Total fees" value={props.totalFee * XMR_AU_RATIO + " XMR"} />
        <UI_Button_Link 
          handleClick = {buttonHandleContinue}
          destination="/" 
          className={"ui_wallet_button_link"} 
          isactive={buttonIsActive}
        >
          {buttonText}
        </UI_Button_Link>
      </div>
    </Page_Box>
  );
}

/*
 *           isGeneratingTxs = {this.state.isGeneratingTxs}
          walletIsFunded = {this.state.walletIsFunded}
          startGeneratingTxs = {this.startGeneratingTxs}
          stopGeneratingTxs = {this.stopGeneratingTxs}
 */

function Wallet_Page_Section(props) {
  return(
    <div className="wallet_page_section">
      <div className="wallet_page_section_label wallet_page_text">
        {props.label}
      </div>
      <div className="wallet_page_section_value wallet_page_text">
        {props.value}
      </div>
      <div className="horizontal_rule">
        <hr />
      </div>
    </div>
  );
}