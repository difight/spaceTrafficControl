import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';

function App ()
{
    const phaserRef = useRef();


    return (
        <div id="app">
            <PhaserGame ref={phaserRef}/>
            <div class="debug-panel">
                debug
            </div>
        </div>
    )
}

export default App
