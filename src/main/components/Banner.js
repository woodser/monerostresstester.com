import React from 'react';
import ReactDOM from 'react-dom';
import "./banner.css";
import logo from "../img/monero_muscle_logo.gif";

export default function Banner() {
  return(
    <div id="banner-container">
      <div id="title" className="vertical_center">
        <h1>MoneroStressTester.com</h1>
        <div>
          <img id="monero_muscle_logo" className="vertical_center" src={logo} alt="Monero Muscle Logo"></img>
        </div>
      </div>
      <div id="nav">
      <a href="www.dot.com" className="nav_link current_nav">Home</a>
      &nbsp;|&nbsp;
      <a href="www.dot.com" className="nav_link unselected_nav">Backup</a>
      &nbsp;|&nbsp;
      <a href="www.dot.com" className="nav_link unselected_nav">Deposit</a>
      &nbsp;|&nbsp;
      <a href="www.dot.com" className="nav_link unselected_nav">Withdraw</a>
      &nbsp;|&nbsp;
      <a href="www.dot.com" className="nav_link unselected_nav">Sign Out</a>
      </div>
    </div>
  );
}
