import React, {useState } from "react";
import { useCallback } from "react";
import './touch-pad.css';
import bleIcon from '../../assets/bluetooth.png';

const POWER_PADDING = 30;

export function TouchPad() {

  const [power, setPower] = useState(0);
  const [direction, setDirection] = useState('none');
  const battery = 99 ;

  const onTouchEnd = useCallback(() => {
    setPower(0);
    setDirection('none');
  }, []);

  const onTouchMove = useCallback((event) => {
    const  {offsetTop, offsetLeft,offsetWidth, offsetHeight } = event.nativeEvent.target;
    const {pageX, pageY} = event.nativeEvent.touches[0];
    let power = Math.floor( (offsetHeight - pageY + offsetTop - POWER_PADDING) / (offsetHeight-2 * POWER_PADDING) * 100);
    power = power < 0 ? 0 : power;
    power = power > 100 ? 100 : power;
    setPower(power);

    const x = Math.floor( ( pageX - offsetLeft ) / (offsetWidth) * 100);
    let direction = 'none';
    direction = x > 66 ? 'right' : direction;
    direction = x < 34 ? 'left' : direction;
    setDirection(direction);
  }, []);


  return (
    <div className="touchPad" 
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      >
      <div></div>
      <div className="arrows">
        {/* <label style={{visibility: direction == 'left' ? 'visible' : 'hidden' }}>	&#x2B05; </label>
        <label style={{visibility: direction == 'right' ? 'visible' : 'hidden' }}>	&#x27A1; </label> */}
        <label style={{visibility: direction == 'left' ? 'visible' : 'hidden' }}> turn left </label>
        <label style={{visibility: direction == 'right' ? 'visible' : 'hidden' }}>	turn right </label>
      </div>
     
       <img src={bleIcon} className="bleButton" alt="bluetooth" />
    
      <div className="osd">
        <label className="power" >  { `power: ${power}%` }</label>
        <label className="battery" >  { `battery: ${battery}%` }</label>
      </div>
    </div>
  );

}

