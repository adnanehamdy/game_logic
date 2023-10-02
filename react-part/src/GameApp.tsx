// import React from 'react';

import GameCanvas from './components/Sketch';
import { socket, SocketProvider } from './contexts/SocketContext';
import { useState } from 'react';
import "./App.css"  
// import { ReactP5Wrapper } from 'react-p5-wrapper';
function GameApp() {
  const [isPlayerConnected, setPlayerConnected] = useState(false);
  const [gameState, setGameState] = useState('pending');
  socket.on('GameStarted', ()=>
  {
    setPlayerConnected(true);
    setGameState('playing');
  });
  socket.on('GameState', (State) =>
  {
    setGameState(State);
  });
  console.log(isPlayerConnected);
  return isPlayerConnected ? (<GameCanvas/>) : (<h1>waiting ... </h1>);

}
export default GameApp;