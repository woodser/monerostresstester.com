import React from 'react';
import ReactDOM from 'react-dom';
import "./banner.css";
import "../app.css";
import { BrowserRouter as Link, NavLink } from "react-router-dom";

function convertLinkNameToUrl(name){
  if (name=="Home")
    return "";
  else
    return "/" + name.toLowerCase().split(' ').join('_');
}

export default function Banner(props) {
  let links = [
    "Home",
    "Backup",
    "Deposit",
    "Withdraw",
    "Sign Out",
  ];
  
  /*
   * Store banner links in an array and style as actual links or dead links
   * based on props.className
   */
  if (props.walletIsSynced){ // Nav links are now active
    links = links.map(
      link => <NavLink 
        key={link}
        exact
        to={convertLinkNameToUrl(link)} 
        className="link nav_link" 
        activeClassName="current_nav"
        onClick={link==="Deposit" ? props.notifyIntentToDeposit : undefined}>
          {link + (link==="Sign Out" ? "" : "   ")}
      </NavLink>);
  } else {
    links = links.map(
      link => <span 
        key={link}  
        className={"link " + (link==="Home" ? "current_nav" : "inactive_nav_link")}>
          {link + (link==="Sign Out" ? "" : "   ")}
      </span>);
  }
  
  return(
    <div id="banner-container">
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
          {links}
        </div>
      </div>
    </div>
  );
}
