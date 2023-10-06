// import React from 'react'
import  ReactDOM  from 'react-dom/client'
import GameApp from './GameApp'
import './index.css'
import { socket, SocketProvider } from './contexts/SocketContext';


const gameMode = "botMode";
const contextValue = {
    socket,
    gameMode,
};
ReactDOM.createRoot(document.getElementById('root')!).render(

    <SocketProvider contextValue>  
    <GameApp/>
    </SocketProvider>
)
