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
    <Link to={props.destination} className={"link_button " + props.className}>
      <div className="button_text">
        {props.buttonText}
      </div>
    </Link>
  );
}

// Component for the unique "Regenerate" button in the wallet generation sub-page
export function Regenerate_Phrase_Button() {
  return(
    <div className="regenerate_button_container">
      <div className="regenerate_button_left_spacer"></div>
      <div className="regenerate_button">
        Regenerate
      </div>
    </div>
  );
}
