import React, { useEffect, useRef, useState } from "react";
import "./style.scss";

type props = {
  percentage?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Slider = ({ percentage = 0, onChange }: props) => {
  const [position, setPosition] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const rangeRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rangeWidth = rangeRef.current?.getBoundingClientRect().width ?? 0;
    const thumbWidth = thumbRef.current?.getBoundingClientRect().width ?? 0;
    const centerThumb = (thumbWidth / 100) * percentage * -1;
    const centerProgressBar =
      thumbWidth +
      (rangeWidth / 100) * percentage -
      (thumbWidth / 100) * percentage;
    setPosition(percentage);
    setMarginLeft(centerThumb);
    setProgressBarWidth(centerProgressBar);
  }, [percentage]);

  return (
    <div className="slider">
      <div
        className="slider__progress"
        style={{ width: `${progressBarWidth}px`}}
      ></div>
      <div
        className="slider__thumb"
        ref={thumbRef}
        style={{ left: `${position}%`, marginLeft: `${marginLeft}px` }}
      ></div>
      <input
        type="range"
        value={position}
        ref={rangeRef}
        step="0.01"
        className="slider__range"
        onChange={onChange}
      />
    </div>
  );
};

export default Slider;
