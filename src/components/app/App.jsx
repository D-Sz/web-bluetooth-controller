import React from 'react';
import './App.css';
import { TouchPad } from '../touch-pad/touch-pad';
import { BleController } from '../controller/controller';

function App() {

  return (
    <div className="container">
      <BleController>
        <TouchPad />
      </BleController>
      <footer >
        #web-bluetooth-controller
      </footer>
    </div>
  );
}

export default App;
