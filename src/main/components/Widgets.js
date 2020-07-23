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
    <div className="save_phrase_box main_content">
      {
      /*
       * Add top and bottom padding to space top and bottom edges of the text
       * box specific distances from the text within
       */
      }
      <div className="save_phrase_box_padding">
        {props.boxText}
      </div>
    </div>
  );
}
