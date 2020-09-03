import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import './buttons.css';

/*
 * home page box buttons
 */

// Component for the common "button link" used in the bottom of the page_box home pages
export function UI_Button_Link(props) {
  return(
    <a
      className={"ui_link_container ui_button_link " + props.className} 
      onClick = {function () {
	if(props.handleClick){
	  props.handleClick();
	}
	props.setCurrentHomePage(props.destination);
      }}
    >
      <div className="button_text">
        {props.link_text}
      </div>
    </a>
  );
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
	  props.setCurrentHomePage(props.destination);
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
