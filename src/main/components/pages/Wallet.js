import React from 'react';
import {Page_Box} from "../Widgets.js";
import "./wallet.css";
import {UI_Button_Link} from "../Buttons.js";

export default function Wallet(props){
  /*
   * PROPS:
   *   balance
   *   available_balance
   *   transactions
   *   fees
   */
  return(
    <Page_Box className="wallet_page_box">
      <div className="wallet_page_sections_container">
        <Wallet_Page_Section label = "Balance" value={props.balance + " XMR"} />
        <Wallet_Page_Section label = "Available balance" value={props.availableBalance + " XMR"} />
        <Wallet_Page_Section label = "Transactions generated" value="0" />
        <Wallet_Page_Section label = "Total fees" value="0 XMR" />
        <UI_Button_Link link_text="Start generating transactions" destination="/" className="ui_wallet_button_link ui_inactive_wallet_button" />
      </div>
    </Page_Box>
  );
}

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