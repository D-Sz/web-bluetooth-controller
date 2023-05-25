import React, { useContext } from "react";
import './osd.css';
import { DataContext } from "../controller/controller";

export function Osd({power}) {
  const {battery} = useContext(DataContext);
  return (
    <div className="osd">
        <label className="power" >  { `power: ${power}%` }</label>
        <label className="battery" >  { `battery: ${battery}%` }</label>
      </div>
  )
}