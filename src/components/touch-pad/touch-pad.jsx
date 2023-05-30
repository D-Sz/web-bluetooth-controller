import React, { useContext } from "react";
import { useCallback } from "react";
import "./touch-pad.css";
import { Osd } from "../osd/osd";
import { DataContext } from "../controller/controller";
import { Direction } from "../../enums";

const POWER_PADDING = 30;
const LEFT_THRESHOLD = 34;
const RIGHT_THRESHOLD = 66;

export function TouchPad() {
  const { power, onSetPower, direction, onSetDirection } =
    useContext(DataContext);

  const onPointerUp = useCallback(() => {
    onSetPower(0);
    onSetDirection(Direction.NONE);
  }, []);

  const onPointerMove = useCallback((event) => {
    if (event.buttons === 0) return;

    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } =
      event.nativeEvent.target;
    const { pageX, pageY } = event;
    console.log(event);
    let power = Math.floor(
      ((offsetHeight - pageY + offsetTop - POWER_PADDING) /
        (offsetHeight - 2 * POWER_PADDING)) *
        100
    );
    power = power < 0 ? 0 : power;
    power = power > 100 ? 100 : power;
    onSetPower(power);

    const x = Math.floor(((pageX - offsetLeft) / offsetWidth) * 100);
    let direction = Direction.NONE;
    direction = x > RIGHT_THRESHOLD ? Direction.RIGHT : direction;
    direction = x < LEFT_THRESHOLD ? Direction.LEFT : direction;
    onSetDirection(direction);
  }, []);

  return (
    <div
      className="touchPad"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="direction">
        <label
          style={{
            visibility: direction == Direction.LEFT ? "visible" : "hidden",
          }}
        >
          turn left
        </label>
        <label
          style={{
            visibility: direction == Direction.RIGHT ? "visible" : "hidden",
          }}
        >
          turn right
        </label>
      </div>
      <Osd power={power} />
      <div className="hints">
        <label>accelerate</label>
        <label>&#x2191;</label>
        <label>&#x2B05; turn &#x27A1;</label>
        <label>&#x2193; </label>
        <label>break</label>
      </div>
    </div>
  );
}
