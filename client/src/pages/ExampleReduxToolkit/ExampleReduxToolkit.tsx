import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../store";
import { increment, decrement } from "./counterSlide";

export const ExampleReduxToolkit = (prop: any) => {
  const counter = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const handleClickAdd = () => {
    dispatch(increment());
  };

  const handleClickRemove = () => {
    dispatch(decrement());
  };

  return (
    <div>
      <button onClick={handleClickRemove}>-</button>
      <div>{counter}</div>
      <button onClick={handleClickAdd}>+</button>
    </div>
  );
};
