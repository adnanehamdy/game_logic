// import React from 'react';

import GameCanvas from './components/Sketch';
import { socket, SocketProvider } from './contexts/SocketContext';
import { ReactP5Wrapper } from 'react-p5-wrapper';
function GameApp() {
  return (
    <SocketProvider value={socket}>
      <GameCanvas/>
      {/* <Sketch /> */}
    </SocketProvider>);
}


export default GameApp;