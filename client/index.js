import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// make eslint happy:
/* global io */

window.socket = io({
  query: {
    type: new URLSearchParams(window.location.search).get('type'),
    roomName: window.location.hash,
  },
});

window.socket.on('connect', () => {
  ReactDOM.render(
    <App roomName={window.location.hash} socketId={window.socket.id} />,
    document.getElementById('root'),
  );
});
