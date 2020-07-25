import React from 'react';
import ReactDOM from 'react-dom';
import "./banner.css";
import logo from "../img/monero_muscle_logo.gif";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

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
        <NavLink to="/home" className="nav_link" activeClassName="current_nav">Home</NavLink>
        &nbsp;&nbsp;&nbsp;
        <NavLink to="/backup" className="nav_link" activeClassName="current_nav">Backup</NavLink>
        &nbsp;&nbsp;&nbsp;
        <NavLink to="/deposit" className="nav_link" activeClassName="current_nav">Deposit</NavLink>
        &nbsp;&nbsp;&nbsp;
        <NavLink to="/withdraw" className="nav_link" activeClassName="current_nav">Withdraw</NavLink>
        &nbsp;&nbsp;&nbsp;
        <NavLink to="/sign_out" className="nav_link" activeClassName="current_nav">Sign Out</NavLink>
      </div>
    </div>
  );
}
