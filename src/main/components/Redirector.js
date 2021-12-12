 import {Navigate} from "react-router-dom";
 import React from "react";
//Remember to bind so that "this" points to the App component!
//"Shell" function component that simply renders 
export default function(props) {
  if(props.location === undefined){
    return <Navigate to={props.currentSitePage} />; 
  }
  let urlIsCorrect = props.location.pathname === props.currentSitePage;
  if (!urlIsCorrect) {
    return <Navigate to={props.currentSitePage} />;
  }

  return children;
}