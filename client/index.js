import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// make eslint happy:
/* global io */

const urlParams = new URLSearchParams(window.location.search);

window.socket = io({
  query: {
    type: urlParams.get('type'),
    tiles: urlParams.get('tiles'),
    roomName: window.location.hash,
  },
});

window.socket.on('connect', () => {
  ReactDOM.render(
    <App roomName={window.location.hash} socketId={window.socket.id} />,
    document.getElementById('root'),
  );
});
