// import React from 'react'
import  ReactDOM  from 'react-dom/client'
import GameApp from './GameApp'
import './index.css'
import { SocketProvider } from './contexts/SocketContext';

const gameMode = "simple";
ReactDOM.createRoot(document.getElementById('root')!).render(
    // setCustomParam(gameMode)
    <SocketProvider customParam={gameMode}>  
    <GameApp/>
    </SocketProvider>);