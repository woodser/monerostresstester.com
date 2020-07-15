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

export function Page_Text_Entry(props) {
  return (
    <textarea className="text_box confirm_phrase_box main_content" />
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
