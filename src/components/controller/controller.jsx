import React, { createContext, useState }  from 'react';
import { connectBLE } from '../../ble-service';

export const DataContext = createContext(null);

export const  BleController =  ({children, init}) => {
  
  const [data, setData] = useState({battery:0});

  const onStart = () => {
    connectBLE({setData});
  }

  return (
    <DataContext.Provider value={{...data, onStart}} >
      {children}
    </DataContext.Provider>
  )
}