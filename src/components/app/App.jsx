import React from "react";
import "./App.css";
import { TouchPad } from "../touch-pad/touch-pad";
import { BleController } from "../controller/controller";
import * as packageJson from "../../../package.json";
import { BleButton } from "../ble-button/ble-button";

const { version } = packageJson;

function App() {
  return (
    <div className="container">
      <BleController>
        <div className="wrapper">
          <BleButton />
          <TouchPad />
        </div>
      </BleController>
      <footer>#web-bluetooth-controller v{version}</footer>
    </div>
  );
}

export default App;
