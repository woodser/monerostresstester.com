import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import './buttons.css';

// Component for the common "button link" used in the bottom of the page_box home pages
export function UI_Button_Link(props) {
  
  if(props.style){
    //console.log("UI_Button_Link inline style: " + JSON.stringify(props.style));
  }
  
  if(props.isactive || props.isactive == null) {
    
    
    if(!(props.setCurrentPage || props.handleClick) && props.destination){
      // Only a destination was supplied; in order to navigate to it on clicking, we need to use a router "Link" component.
      return(
        <Link
          className={"ui_link_container ui_button_link " + props.className} 
          style={props.style}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          to={props.destination}
        >
          <div className="button_contents_container">
            {props.children}
          </div>
        </Link>
      );
    }
    return(
      <a
        className={"ui_link_container ui_button_link " + props.className} 
        style={props.style}
        onClick = {function () {
          if(props.handleClick){
            props.handleClick();
          }
          if(props.destination && props.setCurrentPage){
            props.setCurrentPage(props.destination);
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
      &nbsp;
      <a 
        className="ui_text_link"
        style = {props.overrideStyle}
	onClick={function () {
	  if(props.handleClick) {
	    props.handleClick();
	  }
	  if(props.setCurrentPage){
	    props.setCurrentPage(props.destination);
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

export function Text_Box_Top_Right_Link_Button(props) {
  return(
      <a className="text_box_top_right_button" onClick={props.handleClick}>{props.text}</a>
  );
}
