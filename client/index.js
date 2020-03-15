import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.socket = io({
  query: {
    roomName: location.hash
  }
});

ReactDOM.render(
  <App roomName={location.hash} />,
  document.getElementById("root")
);
