import React from "react";
import './osd.css';

export function Osd({power, battery}) {
  return (
    <div className="osd">
        <label className="power" >  { `power: ${power}%` }</label>
        <label className="battery" >  { `battery: ${battery}%` }</label>
      </div>
  )
}