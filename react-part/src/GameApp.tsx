import GameCanvas from './components/Sketch';
import { socket } from './contexts/SocketContext';
import { useState } from 'react';
import "./App.css"  
function GameApp() {
  let custom_msg : string;
  const [RenderCanvas, setRenderCanvas] = useState(false);
  const [gameState, setGameState] = useState('pending'); 
  const gameMode = 'botMode';
  socket.emit('gameMode', gameMode);
  socket.on('GameStarted', ()=>
  {
    setRenderCanvas(true);
    setGameState('playing');
  });
  socket.on('Game result', (result_msg)=>
  {
    setGameState(result_msg + "Won");
    setRenderCanvas(false);
  });
  custom_msg = gameState;
  // socket.on('connect', () =>
  // { 
  // })
  return RenderCanvas ? (<GameCanvas/>) : (<h1> {custom_msg} </h1>);

}
export default GameApp;