import React from 'react';
import ReactDOM from 'react-dom';
import './widgets.css';

import loadingAnimation from '../img/loadingAnimation.gif';
import { BrowserRouter as Link, NavLink } from "react-router-dom";

export function Progress_Bar(props) {
  
  const progressStyle = {
    width: `${props.progress}%`
  }
  
  return(
    <div className="progress_bar_container">
      <div className="progress_bar" style={progressStyle}></div>
      <div className="progress_percentage">{`${Math.trunc(props.progress)}%`}</div>
    </div>
  );
}

// A generic container for the common box format of most of the site pages
export function Page_Box(props) {
  return (
    <div className={(props.className ? props.className + " " : "") + "page_box"}>
      {props.children}
    </div>
  );
}

export function getLoadingAnimationFile(){
  return loadingAnimation;
}

export function Loading_Animation(props) {
  
  // Remove the "onLoad" attribute if no notification function is provided - this will avoid errors
  let className = props.hide === true ? " loading_animation hidden" : "";
  let imgElement = null;
  if(props.notifySpinnerLoaded) {
    imgElement = 
      <img 
        className={"loading_animation" + className} 
        src={loadingAnimation} onLoad={props.notifySpinnerLoaded} 
        alt="Spinny wheel animation">
      </img>;
  } else {
    imgElement = 
      <img 
        className={"loading_animation" + className} 
        src={loadingAnimation} 
        alt="Spinny wheel animation">
      </img>;
  }
  return ( 
    <div className={"loading_animation_container"}>
      {imgElement}
    </div>
  );

}

export function Page_Text_Box(props) {
  return(
    <textarea 
      className="text_box save_phrase_box page_text_box main_content active_border" 
      value={props.box_text} 
      disabled 
    />
  );
}

export function Page_Box_Margin(props){
  if (props.height){
    return <div style={{minHeight: props.height, fontSize: props.height}}>&nbsp;</div>;
  } else {
    return <div className="standard_page_box_margin"></div>;
  }
}

export function Notification_Bar(props){
  return(
    <div className = "notification_bar">
      <span className = "notification_bar_contents">
        {props.content}
      </span>
    </div>
  );
}

export function Deposit_Address_Text_Box(props) {
  return(
    <textarea 
      className="text_box deposit_address_box" 
      value={props.box_text} 
      disabled 
    />
  );
}

/*
 * props.isDefault: Denotes whether the box contains the intial, unedited text;
 *   if so, set a css class to use gray text instead of black.
 * props.overrideValue:
 */
export class Page_Text_Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    }
    this.isDefault = true;
    this.setText.bind(this);
  }
  
  setText(text){
    this.setState({
      displayedText: text
    });
  }
  
  handleClick() {
    this.setState({
      value: ""
    });
    props.handleClick();
  }

  handleChange(e){
    this.setState({
      value: e.target.value
    });
    if (e.target.value === "") 
      this.isDefault = true;
    else
      this.isDefault = false;
    if(this.props.handleTextChange != undefined){
      this.props.handleTextChange(e.target.value);
    }
  }

  render() {
    
    let className = this.props.className + 
      " text_box page_text_box " + 
      ((this.state.isDefault) ? " default_value" : " new_value") +
      ((this.props.isValid ? " active_border" : " inactive_border"));
    
    let element = null;
    let newValue = "";
    if(this.props.overrideValue) {
      newValue = this.props.overrideValue;
    } else if(!(this.state.value === "")){
      if(this.props.overrideValue === null || this.props.overrideValue === undefined){
        newValue = this.state.value;
      }
    }
    
    if (this.props.isSingleLineEntry){
      className = className + " single_line_text_entry";
      element = (
        <input
          type="text"
          className={className}
          onKeyPress = {this.props.handleKeyPress}
          onChange={this.handleChange.bind(this)}
          disabled={!this.props.isactive}
          value = {newValue}
          placeholder = {this.props.defaultValue}
          onClick = {this.props.handleClick}
          style = {this.props.style}
        />
      );
    } else {
      element = (
        <textarea
          className={className}
          onKeyPress = {this.props.handleKeyPress}
          onChange={this.handleChange.bind(this)} 
          disabled={!this.props.isactive}
          value = {newValue === "" ? undefined : newValue}
          onClick = {this.props.handleClick}
          placeholder = {this.props.defaultValue}
          style = {this.props.style}
        />
      );
    }
    
    return (
      element
    );
  }
}

export function Main_Content(props) {
  return(
    <div className="main_content">
      {props.children}
    </div>
  );
}

export function Header(props) {
  return (
    <div className="header">
      {props.text}
    </div>
  );
}

export function Page_Box_Line_Field(props) {
  
  /*
   * There are two possible field styles:
   * 
   * horizontal: label and value/text are on the same line with label on left and 
   * value on right.
   * 
   * vertical: Both the label and value are left-aligned; label is on top, value on bottom
   */
  
  let fieldStyleObject = {
    display: "flex",
    flexDirection: "row"
  };
  
  // Field style defaults to horizontal layout
  let lineStyleObject = {
    width: "50%"
  }
  let labelAlignment = {float: "left"};
  let valueAlignment = {float: "right"};
  let verticalFieldsMargin = <></>;
  
  if(props.field_style == "vertical"){
    lineStyleObject.width = "100%";
    fieldStyleObject.flexDirection = "column";
    valueAlignment.float = "left";
    verticalFieldsMargin = <Page_Box_Margin height = "5px" />;
  } else if (props.field_style != "horizontal" && props.field_style != undefined) {
    throw("Invalid page box line field style: " + props.field_style);
  }
  
  return(
    <>
      <div className = "page_box_line_field" style = {fieldStyleObject}>
        <div className = "page_box_line_field_text_container" style = {lineStyleObject}>
          <div className = "page_box_line_field_text" style = {labelAlignment}>{props.label}</div>
        </div>
        {verticalFieldsMargin}
        <div className="page_box_line_field_text_container" style={lineStyleObject}>
          <div className = "page_box_line_field_text" style = {valueAlignment}>{props.value}</div>
        </div>
      </div>
      <Page_Box_Margin height = "7px" />
      <div className = "horizontal_rule">
        <hr />
      </div>
      <Page_Box_Margin height = "45px" />
    </>
  );
}
