const CONTROL_CHAR = "d44bc439-abfd-45a2-b575-925416129600"

const sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });

export const connectBLE = async ({setData}) => {
  console.log(`started`)
  
  const device = await navigator.bluetooth.requestDevice({
    // acceptAllDevices : true,
    filters: [
      {
        namePrefix: "S",
        // services: ["0000fff0-0000-1000-8000-00805f9b34fb"] ,
        // services: [0xfff0] ,
      },
    ],
    optionalServices: [
      // 0xfff0 ,
      0x180f ,
      // "0000fff0-0000-1000-8000-00805f9b34fb"
      // 0xfd00
    ], 
  });

  if (!device) return;

  console.log("device:", device.name, device);

  device.addEventListener('gattserverdisconnected', e=>{
    console.log("DISCONNECTED:", e);
    // stopped();
  });

  const server = await device.gatt.connect();

  console.log("server:", server);

  let service;

  const services = await server.getPrimaryServices(); 

  service = services[0];
  console.log("service:", services);

  const char = await service.getCharacteristics();

  console.log("char:", char);

  const noti = await char[0].startNotifications() ;
  noti.addEventListener('characteristicvaluechanged', e=>{
    const value = e.target.value;
    console.log("noti:", value, value.getInt8(0));
    setData({battery: value.getInt8(0)});
  });

 
//   const writeUUID = '88f82581-0000-01e6-aace-0002a5d5c51b' ;
//   const readUUID = '88f82584-0000-01e6-aace-0002a5d5c51b' ; 

//   const tx = await service.getCharacteristic(writeUUID);
//   console.log("tx:", tx);

//   const rx = await service.getCharacteristic(readUUID);
//   console.log("rx:", rx);

//   startTs = Date.now();
//   isRunning = true;
  const chars = await services[1].getCharacteristics();
  const tx = chars[0]
  console.log("tx:", tx, chars);

  while (true){
    // await tx.writeValue( new Uint8Array([0x00,0x43, 0x54, 0x4c, 0x00, 0x00, 0x01, 0x00, 0x50, 0x00]) ) ;
  await tx.writeValue( new Uint8Array([0x00, 0x00 /* fw */ ,0x00 /* rev */,0x00 /* left */, 0x00 /* right */, 0x01 /* lamp */  ])) ;

  await sleep(10);

}
// stopped();

};

