import React from 'react';
import ReactDOM from 'react-dom';
import "./banner.css";
import logo from "../img/monero_muscle_logo.gif";
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
  if (props.walletIsSynced){
    links = links.map(link => <NavLink key={link} to={convertLinkNameToUrl(link)} className="link nav_link" activeClassName="current_nav">{link + (link==="Sign Out" ? "" : "   ")}</NavLink>);
  } else {
    links = links.map(link => <span key={link} className={"link " + (link==="Home" ? "current_nav" : "inactive_nav_link")}>{link + (link==="Sign Out" ? "" : "   ")}</span>);
  }
  return(
    <div id="banner-container">
      <NavLink to="/" className="header_link">
        MoneroStressTester.com
      </NavLink>
      <div id="logo_container">
        <img src={logo} alt="Monero Muscle Logo"></img>
      </div>
      <div id="nav">
        {links}
      </div>
    </div>
  );
}
