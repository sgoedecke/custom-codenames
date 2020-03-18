import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// make eslint happy:
/* global io */

window.socket = io({
  query: {
    roomName: window.location.hash,
  },
});

ReactDOM.render(
  <App roomName={window.location.hash} />,
  document.getElementById('root'),
);
