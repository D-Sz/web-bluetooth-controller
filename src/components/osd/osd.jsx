import React, { useContext } from "react";
import "./osd.css";
import { DataContext } from "../controller/controller";

export function Osd() {
  const { batteryLevel, power, deviceName } = useContext(DataContext);
  return (
    <div className="osd">
      <label className="power"> {`power: ${power | 0}%`}</label>
      <label className="deviceName"> {deviceName}</label>
      <label className="battery"> {`battery: ${batteryLevel | 0}%`}</label>
    </div>
  );
}
