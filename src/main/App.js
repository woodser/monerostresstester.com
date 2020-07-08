import React from 'react';
import ReactDOM from 'react-dom';
import "./App.css";
import Banner from "./components/Banner.js";
import Home from "./components/Home.js";
import Deposit from "./components/Deposit.js";
import SignOut from "./components/SignOut.js";
import Backup from "./components/Backup.js";
import Withdraw from "./components/Withdraw.js";
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
