import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import './buttons.css';

// Component for the common "button link" used in the bottom of the page_box home pages
export function UI_Button_Link(props) {
  if(props.isactive || props.isactive == null) {
    return(
      <a
        className={"ui_link_container ui_button_link " + props.className} 
        onClick = {function () {
  	if(props.handleClick){
  	  props.handleClick();
  	}
  	if(props.destination && props.setCurrentHomePage){
  	  props.setCurrentHomePage(props.destination);
  	}
        }}
      >
        <div className="button_contents_container">
          {props.children}
        </div>
      </a>
    );
  } else {
    return(
      <div className={"ui_link_container ui_button_link_inactive " + props.className}>
        <div className="button_contents_container">
          {props.children}
        </div>
      </div>
    );
  }
}

export function UI_Text_Link(props) {
  return(
    <div className="ui_link_text_container">
      <a 
        className="ui_text_link" 
	onClick={function () {
	  if(props.handleClick) {
	    props.handleClick();
	  }
	  if(props.setCurrentHomePage){
	    props.setCurrentHomePage(props.destination);
	  }
	}}
      >
        <div>
          {props.link_text}
        </div>
      </a>
    </div>
  )
}

// Component for the unique "Regenerate" button in the wallet generation sub-page
export function Regenerate_Phrase_Button(props) {
  return(
    <div className="regenerate_button_container">
      <div className="regenerate_button_left_spacer"></div>
      <a className="regenerate_button" onClick={props.handleClick}>Regenerate</a>
    </div>
  );
}
