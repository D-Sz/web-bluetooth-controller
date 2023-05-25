import React from 'react';
import './ble-button.css';
import bleIcon from '../../assets/bluetooth.png';

export function BleButton() {

  return (
    <img src={bleIcon} className="bleButton" alt="bluetooth" />
  );
}