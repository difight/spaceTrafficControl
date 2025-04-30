import { useRef, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { DebugProvider } from './game/ui/DebugProvider';
import DebugPanel from './game/ui/DebugPanel';
import { useGlobalDebug } from './game/hooks/useDebug';
import ShipInfo from './components/ShipInfo';

function App ()
{
    const phaserRef = useRef();


    return (
      
      <DebugProvider>
        <DebugInitializer/>
        <div id="app">
          <ShipInfo/>
          <PhaserGame ref={phaserRef}/>
          <DebugPanel/>
        </div>    
      </DebugProvider>
    )
}

const DebugInitializer = () => {
  const debug = useGlobalDebug();
  window.globalDebug = debug;
  return null;
};

export default App
