import React from "react";
import "./style.scss";

function Loading(props: any) {
  return (
    <div className="loading">
      <div className="loading__wrapper">
        <span className="loader"></span>
      </div>
    </div>
  );
}

export default Loading;
