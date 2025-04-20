import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';

import { DebugProvider } from './game/ui/DebugProvider';
import Debug from './game/ui/Debug';

function App ()
{
    const phaserRef = useRef();


    return (
        <div id="app">
            <DebugProvider>
              <PhaserGame ref={phaserRef}/>
              <Debug/>
            </DebugProvider>
        </div>
    )
}

export default App
