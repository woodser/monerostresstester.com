import React from 'react';
import ReactDOM from 'react-dom';
import './widgets.css';

export function Progress_Bar(props) {
  const progressStyle = {
    width: `${props.progress}%`
  }
  return(
    <div className="progress_bar_container main_content">
      <div className="progress_bar" style={progressStyle}></div>
      <div className="progress_percentage">{`${props.progress}%`}</div>
    </div>
  );
}

// A generic container for the common "box format" of most of the home sub-pages
export function Page_Box(props) {
  return (
    <div className="page_box">
      {props.children}
    </div>
  );
}

export function Page_Text_Box(props) {
  return(
    <div className="text_box save_phrase_box main_content">
      {props.box_text}
    </div>
  );
}

/*
 * props.isDefault: Denotes whether the box contains the intial, unedited text;
 *   if so, set a css class to use gray text instead of black.
 * props.value:
 */
export class Page_Text_Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isDefault: true,
      enteredPhrase: ""
    }
  }

	handleChange(e){
	  this.setState({
	    isDefault: false,
	    enteredPhrase: e.target.value,
	  });
	  this.props.handleTextChange(e.target.value);
	}

  render() {
    return (
      <textarea
        className={"text_box enter_phrase_box main_content" + ((this.state.isDefault === true) ? " default_value" : " new_value")}
        defaultValue={this.props.value}
        onChange={this.handleChange.bind(this)} />
    );
  }
}

export function Restore_Height(props){
  return(
    <div className="restore_height_entry">
      <div>Restore height:</div>
      <input type="number" onChange={props.onChange} />
    </div>
  );
}

export function Header(props) {
  return (
    <div className="header">
      <div className="header_text">
        {props.text}
      </div>

      <div className="header_bottom_margin">
        {props.margin_content}
      </div>
    </div>
  );
}
