import React from 'react';
import ReactDOM from 'react-dom';
import './widgets.css';

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
    enteredPhrase: e.target.value
  })
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
