import React, { useContext, useEffect } from "react";
import { useCallback } from "react";
import "./touch-pad.css";
import { Osd } from "../osd/osd";
import { DataContext } from "../controller/controller";
import { Direction } from "../../enums";

const POWER_PADDING = 30;
const LEFT_THRESHOLD = 34;
const RIGHT_THRESHOLD = 66;

export function TouchPad() {
  const { onSetPower, direction, onSetDirection } = useContext(DataContext);

  const onPointerUp = useCallback(() => {
    onSetPower(0);
    onSetDirection(Direction.NONE);
  }, []);

  const onMove = useCallback(({ pageX, pageY, target }) => {
    const { offsetWidth, offsetHeight } = target;
    const { offsetTop, offsetLeft } = target.parentElement;

    let power = Math.floor(
      ((offsetHeight - pageY + offsetTop - offsetHeight / 2 - POWER_PADDING) /
        (offsetHeight - 2 * POWER_PADDING)) *
        100 *
        2
    );
    power = power < -100 ? -100 : power;
    power = power > 100 ? 100 : power;
    if (power < 20 && power > -20) power = 0;
    onSetPower(power);

    const x = Math.floor(((pageX - offsetLeft) / offsetWidth) * 100);
    let direction = Direction.NONE;
    direction = x > RIGHT_THRESHOLD ? Direction.RIGHT : direction;
    direction = x < LEFT_THRESHOLD ? Direction.LEFT : direction;
    onSetDirection(direction);
  }, []);

  const onMouseMove = useCallback((event) => {
    if (!event.buttons) return;
    onMove({ pageX: event.pageX, pageY: event.pageY, target: event.target });
  }, []);

  const onTouchMove = useCallback((event) => {
    event.preventDefault();
    onMove({
      pageX: event.touches[0].pageX,
      pageY: event.touches[0].pageY,
      target: event.target,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div
      className="touchPad"
      onMouseMove={onMouseMove}
      onMouseUp={onPointerUp}
      onMouseOut={onPointerUp}
      onTouchEnd={onPointerUp}
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
      <Osd />
      <div className="hints">
        <label>forward</label>
        <label>&#x2191;</label>
        <label>&#x2B05; turn &#x27A1;</label>
        <label>&#x2193; </label>
        <label>reverse</label>
      </div>
    </div>
  );
}
