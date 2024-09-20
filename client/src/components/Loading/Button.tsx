import React from "react";

const Button = ({ size = "S" }: { size?: "L" | "M" | "S" }) => {
  return (
    <div className="button-loading">
      <div className={`spinner ${size}`}></div>
    </div>
  );
};

export default Button;
