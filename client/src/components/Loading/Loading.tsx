import React from "react";
import "./loading.scss";

function Loading(props: any) {
  return (
    <div className="loading">
      <div className="loading__wrapper">
        {/* <i className="fa-thin fa-compact-disc"></i> */}
        <span className="loader"></span>
      </div>
    </div>
  );
}

export default Loading;
