import { DeviceState } from "./enums";

const refs = {};

const sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });

const disconnect = () => {
  console.log(`disconnected`);
  refs.setDeviceState(DeviceState.DISCONNECTED);
};

const catchError = (error) => {
  console.log(`error:`, error);
  disconnect();
};

export const connectBLE = async (args) => {
  Object.assign(refs, args);
  const { setBatteryLevel, setDeviceState } = args;
  console.log(`started`);

  setDeviceState(DeviceState.CONNECTING);

  const device = await navigator.bluetooth
    .requestDevice({
      acceptAllDevices: true,
      // filters: [
      //   {
      //     namePrefix: "S",
      //     // services: ["0000fff0-0000-1000-8000-00805f9b34fb"] ,
      //   },
      // ],
      optionalServices: [
        0x180f, // battery service
      ],
    })
    .catch(catchError);

  if (!device) {
    disconnect();
    return;
  }

  setDeviceState(DeviceState.CONNECTED);

  console.log("device connected:", device.name, device);

  device.addEventListener("gattserverdisconnected", (e) => {
    console.log("device disconnected:", e);
    disconnect();
  });

  const server = await device.gatt.connect().catch(catchError);

  console.log("gatt server:", server);

  if (!server) {
    disconnect();
    return;
  }

  const services = await server.getPrimaryServices().catch(catchError);
  console.log("services:", services);

  if (!services) {
    disconnect();
    return;
  }

  const batteryService = services[0];
  const characteristics = await batteryService
    .getCharacteristics()
    .catch(catchError);

  console.log("battery characteristics:", characteristics);

  if (!characteristics) {
    disconnect();
    return;
  }

  const batteryNotification = await characteristics[0]
    .startNotifications()
    .catch(catchError);

  if (!batteryNotification) {
    disconnect();
    return;
  }

  batteryNotification.addEventListener("characteristicvaluechanged", (e) => {
    const value = e.target.value;
    console.log("battery notification:", value, value.getInt8(0));
    setBatteryLevel(value.getInt8(0));
  });

  const controlService = services[1];

  if (!controlService) {
    disconnect();
    return;
  }

  const controlCharacteristics = await controlService
    .getCharacteristics()
    .catch(catchError);

  if (!controlCharacteristics) {
    disconnect();
    return;
  }

  const controlCharacteristic = controlCharacteristics[0];

  if (!controlCharacteristic) {
    disconnect();
    return;
  }

  while (true) {
    await controlCharacteristic
      .writeValue(
        new Uint8Array([
          0x00, 0x00 /* fw */, 0x00 /* rev */, 0x00 /* left */,
          0x00 /* right */, 0x01 /* lamp */,
        ])
      )
      .catch(catchError);

    await sleep(10);
  }
};
