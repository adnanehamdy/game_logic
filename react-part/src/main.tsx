// import React from 'react'
import  ReactDOM  from 'react-dom/client'
import GameApp from './GameApp'
import './index.css'
import { socket, SocketProvider } from './contexts/SocketContext';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <SocketProvider value={socket}>  
    <GameApp/>
    </SocketProvider>
)
