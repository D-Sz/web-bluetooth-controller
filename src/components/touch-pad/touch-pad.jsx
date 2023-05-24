import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import './touch-pad.css';

const THROTTLE_PADDING = 30;

export function TouchPad() {

  const [throttle, setThrottle] = useState(0);
  const [direction, setDirection] = useState('none');
  const battery = 99 ;

  const onTouchEnd = useCallback((event) => {
    setThrottle(0);
    setDirection('none');
  }, []);

  const onTouchMove = useCallback((event) => {
    const  {offsetTop, offsetLeft,offsetWidth, offsetHeight } = event.nativeEvent.target;
    const {pageX, pageY} = event.nativeEvent.touches[0];
    let throttle = Math.floor( (offsetHeight - pageY + offsetTop - THROTTLE_PADDING) / (offsetHeight-2 * THROTTLE_PADDING) * 100);
    throttle = throttle < 0 ? 0 : throttle;
    throttle = throttle > 100 ? 100 : throttle;
    setThrottle(throttle);

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
      <div className="arrows">
        <label style={{visibility: direction == 'left' ? 'visible' : 'hidden' }}>	&#x2B05; </label>
        <label style={{visibility: direction == 'right' ? 'visible' : 'hidden' }}>	&#x27A1; </label>
      </div>
      <div className="osd">
        <label className="throttle" >  { `throttle: ${throttle}%` }</label>
        <label className="battery" >  { `battery: ${battery}%` }</label>
      </div>
    </div>
  );

}

