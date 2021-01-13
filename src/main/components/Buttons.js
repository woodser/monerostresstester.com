import React from 'react';
import ReactDOM from 'react-dom';
import './buttons.css';

// Component for the common "button link" used in the bottom of the page_box home pages
export function UI_Button_Link(props) {
  
  if(props.style){
    console.log("UI_Button_Link inline style: " + JSON.stringify(props.style));
  }
  
  if(props.isactive || props.isactive == null) {
    return(
      <a
        className={"ui_link_container ui_button_link " + props.className} 
        style={props.style}
        onClick = {function () {
          if(props.handleClick){
            props.handleClick();
          }
          if(props.destination && props.setCurrentHomePage){
            props.setCurrentHomePage(props.destination);
          }
        }}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
      >
        <div className="button_contents_container">
          {props.children}
        </div>
      </a>
    );
  } else {
    return(
      <div className={"ui_link_container ui_button_link_inactive " + props.className}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
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
