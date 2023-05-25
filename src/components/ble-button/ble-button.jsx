import React, { useContext } from 'react';
import './ble-button.css';
import bleIcon from '../../assets/bluetooth.png';
import { DataContext } from '../controller/controller';

export function BleButton() {

  const { onStart } = useContext(DataContext);

  return (
    <img 
      src={bleIcon} 
      className="bleButton" 
      alt="bluetooth" 
      onClick={onStart}  
      />
  );
}