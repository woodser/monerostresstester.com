import React from 'react';
import ReactDOM from 'react-dom';
import "./App.css";
import Banner from "./components/Banner.js";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <div id="app_container">
        <Banner />
      </div>
    );
  }
}

export default App;
