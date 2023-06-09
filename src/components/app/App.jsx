import React from "react";
import "./App.css";
import { TouchPad } from "../touch-pad/touch-pad";
import { BleController } from "../controller/controller";
import packageJson from "../../../package.json";
import { BleButton } from "../buttons/ble-button";

const packageData = packageJson;
const { version } = packageData;

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
