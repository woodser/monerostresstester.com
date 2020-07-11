import React from 'react';
import ReactDOM from 'react-dom';
import "./App.css";

import Banner from "./components/Banner.js";
import Home from "./components/pages/Home.js";
import Deposit from "./components/pages/Deposit.js";
import SignOut from "./components/pages/SignOut.js";
import Backup from "./components/pages/Backup.js";
import Withdraw from "./components/pages/Withdraw.js";

import { BrowserRouter as Router, Route, NavLink, Switch} from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <div id="app_container">
        <Router>
          <Banner />
          <Switch>
            <Route path="/" exact render={() => <Home />} />
            <Route path="/deposit" render={() => <Deposit />} />
            <Route path="/signOut" render={() => <SignOut />} />
            <Route path="/backup" render={() => <Backup />} />
            <Route path="/withdraw" render={() => <Withdraw />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
