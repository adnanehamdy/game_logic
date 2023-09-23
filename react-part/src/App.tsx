// import React from 'react';

import Sketch from './components/Sketch';
import { socket, SocketProvider } from './contexts/SocketContext';

function App() {
  return (<div className='App'>
    <SocketProvider value={socket}> 
    
      <Sketch />
    </SocketProvider>
  </div>);
}


export default App;