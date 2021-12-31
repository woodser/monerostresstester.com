import React from 'react';
import "./banner.css";
import "../app.css";
import { NavLink, useNavigate } from "react-router-dom";

function convertLinkNameToUrl(name){
  if (name=="Home")
    return "";
  else
    return "/" + name.toLowerCase().split(' ').join('_');
}

export default function Banner(props) {
  
  const navigate = useNavigate();
  
  let linkDisplayValues = [
    "Home",
    "Backup",
    "Deposit",
    "Withdraw",
    "Sign Out",
  ];
  
  // convert link names to functional URLs
  let linkUrlValues = linkDisplayValues.map(
    linkDisplayValue => linkDisplayValue === "Home" ? "/" : convertLinkNameToUrl(linkDisplayValue)
  );
  
  /*
   * Store banner linkDisplayValues in an array and style as actual linkDisplayValues or dead linkDisplayValues
   * based on props.className
   */
  if (props.walletIsSynced){ // Nav links are now active
  
    linkDisplayValues = linkDisplayValues.map((link, index) => {
      let linkCopy = link.slice();
      let onClickFunction;
      
      if(link === "Sign Out") {
        // There is no "Sign Out" route. Return user to the home page.
        linkCopy = "";
        onClickFunction = () => {
          let userConfirmedSignout = confirm("Are you sure you want to sign out of this wallet? If you did not record the seed phrase, you will permanently lose access to the wallet and any funds contained therin! Click 'Ok' to continue");
          if(userConfirmedSignout){
            navigate("/");
            props.logout(true);
          }
        }

      } else if(link === "Deposit"){
        onClickFunction = props.notifyIntentToDeposit;
      } else {
        onClickFunction = () => props.setCurrentSitePage(linkUrlValues[index]);
      }
      return (<NavLink 
        key={linkCopy}
        to={convertLinkNameToUrl(linkCopy)} 
        className="link nav_link" 
        activeclassname="current_nav"
        onClick={onClickFunction}>
          {link + (link==="Sign Out" ? "" : "   ")}
      </NavLink>)});
  } else {
    linkDisplayValues = linkDisplayValues.map(
      link => <span 
        key={link}  
        className={"link " + (link==="Home" ? "current_nav" : "inactive_nav_link")}>
          {link + (link==="Sign Out" ? "" : "   ")}
      </span>);
  }
  
  return(
    <div id="banner_container">
      <div id="header_link_container" className="vertically_centered_item_container">
        <NavLink to="/" className="header_link vertical_center">
          MoneroStressTester.com
        </NavLink>
      </div>
      <div id="logo_container" className="vertically_centered_item_container">
        <img 
          src={props.flexLogo} 
          alt="Monero Muscle Logo" 
          className="vertical_center"
          id="muscle_logo">
        </img>
      </div>
      <div id="nav_container" className="vertically_centered_item_container">
        <div id="nav" className="vertical_center">
          {linkDisplayValues}
        </div>
      </div>
    </div>
  );
}
