import React from 'react';
import ReactDOM from 'react-dom';

import {Page_Box} from './Widgets.js';

export default function QR_Code (props) {
  if (props.url){
    return(
      <img src={props.url} className="qr_code_image" alt="QR Code goes here" />
    );
  } else {
    return <div>QR code error </div>
  }
}