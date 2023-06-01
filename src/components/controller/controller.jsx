import React, { createContext, useEffect, useRef, useState } from "react";
import {
  BleInstance,
  autoConnectBLE,
  initBle,
  scanBLE,
} from "../../ble-service";
import { DeviceState, Direction } from "../../enums";

export const DataContext = createContext(null);

export const BleController = ({ children }) => {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [power, setPower] = useState(0);
  const [direction, setDirection] = useState(Direction.NONE);
  const [deviceState, setDeviceState] = useState(DeviceState.DISCONNECTED);

  BleInstance.control({ direction, power });

  const onStart = () => {
    scanBLE();
  };

  useEffect(() => {
    console.log(`initBle`);
    initBle({ setBatteryLevel, setDeviceState });
  }, []);

  return (
    <DataContext.Provider
      value={{
        batteryLevel,
        onStart,
        onSetPower: setPower,
        onSetDirection: setDirection,
        power,
        direction,
        deviceState,
        setDeviceState,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
