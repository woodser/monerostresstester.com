import React from 'react';
import ReactDOM from 'react-dom';
import "./banner.css";
import logo from "../img/monero_muscle_logo.gif";
import { BrowserRouter as Link, NavLink } from "react-router-dom";

function convertLinkNameToUrl(name){
  return "/" + name.toLowerCase().split(' ').join('_');
}

export default function Banner(props) {
  console.log("Rendering banner");
  console.log("props.walletIsSynced: " + props.walletIsSynced);
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
    alert("test link url: " + convertLinkNameToUrl(links[0]));
    links = links.map(link => <NavLink key={link} to={convertLinkNameToUrl(link)} className="link nav_link" activeClassName="current_nav">{link + (link==="Sign Out" ? "" : "   ")}</NavLink>);
  } else {
    if (links[0] == "Home") console.log("This is the home link");
    console.log("Home link: " + links[0]);
    links = links.map(link => <span key={link} className={"link " + (link==="Home" ? "current_nav" : "inactive_nav_link")}>{link + (link==="Sign Out" ? "" : "   ")}</span>);
  }
  return(
    <div id="banner-container">
      <NavLink to="/home" className="header_link">
        <div id="title" className="vertical_center">
          <h1>MoneroStressTester.com</h1>
          <div>
            <img id="monero_muscle_logo" className="vertical_center" src={logo} alt="Monero Muscle Logo"></img>
          </div>
        </div>
      </NavLink>
      <div id="nav">
        {links}
      </div>
    </div>
  );
}
