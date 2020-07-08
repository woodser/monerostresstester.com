import React from 'react';
import ReactDOM from 'react-dom';
import Home_Welcome from './Home_Welcome.css';

export default function Home(){
  return(
    <>
      <Home_Welcome_Box />
    </>
  );
}

function Home_Welcome_Box (){
  return(
    <div id="welcome_box" >
      stuff
    </div>
  );
}
