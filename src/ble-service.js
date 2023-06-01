import { DeviceState, Direction } from "./enums";

const refs = {};
export const BleInstance = { control: () => {}, isInitialized: false };
let isConnected = false;
let device = null;

// const sleep = (time) =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve(), time);
//   });

export const initBle = async (args) => {
  Object.assign(refs, args);
};

const disconnect = () => {
  device = null;
  isConnected = false;
  console.log(`disconnected`);
  refs.setDeviceState(DeviceState.DISCONNECTED);
  refs.setBatteryLevel(0);
};

export const autoConnectBLE = async () => {
  // if (BleInstance.isInitialized) return;
  // BleInstance.isInitialized = true;
  let devices;
  try {
    devices = await navigator.bluetooth.getDevices();
    console.log(`devices:`, devices);
  } catch (error) {
    console.log(`error:`, error);
    refs.setDeviceState(DeviceState.FAILED);
  }
  if (devices?.length) {
    // device = devices[0];
    // connectBLE();
    return devices[0];
  }
  return null;
};

export const scanBLE = async () => {
  if (device && isConnected) {
    device.gatt.disconnect();
    disconnect();
    return;
  }

  device = await autoConnectBLE();

  if (!device) {
    device = await navigator.bluetooth.requestDevice({
      // acceptAllDevices: true,
      filters: [
        {
          namePrefix: "S",
        },
      ],
      optionalServices: [
        0x180f, // battery service
        0xfff0, // control service
      ],
    });
  }

  if (device) {
    connectBLE();
  }
};

export const connectBLE = async () => {
  const { setBatteryLevel, setDeviceState } = refs;
  console.log(`started`);

  try {
    setDeviceState(DeviceState.CONNECTING);

    console.log("device connected:", device.name, device);

    device.addEventListener("gattserverdisconnected", (e) => {
      console.log("device disconnected:", e);
      disconnect();
    });

    const server = await device.gatt.connect();

    console.log("gatt server:", server);

    const services = await server.getPrimaryServices();
    console.log("services:", services);

    const batteryService = (await server.getPrimaryServices(0x180f))[0];
    const characteristics = await batteryService.getCharacteristics();

    console.log("battery characteristics:", characteristics);

    const batteryNotification = await characteristics[0].startNotifications();

    batteryNotification.addEventListener("characteristicvaluechanged", (e) => {
      const value = e.target.value;
      console.log("battery notification:", value, value.getInt8(0));
      setBatteryLevel(value.getInt8(0));
    });

    const controlService = (await server.getPrimaryServices(0xfff0))[0];

    const controlCharacteristics = await controlService.getCharacteristics();

    const controlCharacteristic = controlCharacteristics[0];

    let isWriteInProgress = false;
    BleInstance.control = async function control({ direction, power }) {
      if (isWriteInProgress || !isConnected) return;
      const payload = new Uint8Array([
        0x01, 0x00 /* fw */, 0x00 /* rev */, 0x00 /* left */, 0x00 /* right */,
        0x01 /* lamp */, 0x00 /* turbo */,
      ]);
      if (direction === Direction.LEFT) payload[3] = 0x01;
      else if (direction === Direction.RIGHT) payload[4] = 0x01;
      if (power > 0) payload[1] = 0x01;
      if (power < 0) payload[2] = 0x01;
      isWriteInProgress = true;
      await controlCharacteristic.writeValue(payload);
      isWriteInProgress = false;
    };

    setDeviceState(DeviceState.CONNECTED);
    isConnected = true;
  } catch (error) {
    console.log(`error:`, error);
    refs.setDeviceState(DeviceState.FAILED);
  }
};
