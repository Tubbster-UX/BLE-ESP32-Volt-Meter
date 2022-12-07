import React, { useState, useEffect } from 'react';
import './index.css'

let device: any, server: any, service: any, characteristic: any;

function App() {
  let [connected, setConnected] = useState<string | null>(null)

  let [volts, setVolts] = useState<string | null>(null)

  async function connectBluetooth() {
    // Connect Device
    // @ts-ignore
    device = await navigator.bluetooth.requestDevice(
      {
        filters: [{
          services: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"]
        }],

      }
    );
    server = await device.gatt.connect();

    setConnected("Connected to: " + device.name)

    service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
    characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
    setInterval(async function(){
      var thing = await characteristic.readValue();
      var decoder = new TextDecoder("utf-8");
      console.log(decoder.decode(thing));
      setVolts(decoder.decode(thing));
      // console.log(thing);
    }, 250);

  }

  useEffect(() => {
    setConnected("Disconnected")
  }, []);
  
  return (
    <div className="text-white" onLoad={() => connectBluetooth()}>
      <header className="App-header">
        <div>

        <h2 className="text-center text-5xl font-semibold mt-4">BLE Volt Meter</h2>

        <div className='text-center'>
          <button className='rounded-full p-4 px-8 text-black bg-gray-400 hover:bg-gray-300 mt-10' id="ble" onClick={() => connectBluetooth()}>Connect Bluetooth</button>
        </div>
        <div className="mt-4 text-center">
          <label className="font-bold text-lg">{connected}</label>
        </div>
        <div className='grid mt-32 place-items-center'>
        <h1 className="text-5xl">Voltage = {volts}</h1>
        </div>
        </div>
      </header>
    </div>
  )
}

export default App;
