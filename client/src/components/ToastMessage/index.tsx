import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import "./style.scss";
import { useToast } from "../../context/ToastContext";

type props = {
  description: string;
  timeout?: number;
  type?: "success" | "error" | "warning";
  showToast: () => void;
};

const ToastMessage = forwardRef(({
  timeout = 4000,
  description,
  type = "warning",
}: props, ref) => {
  const [isVisible, setIsVisible] = useState(true);
  const { setToastMessage } = useToast();

  const showToast = () => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setToastMessage("");
      clearTimeout(timer);
    }, timeout);
  };

  useImperativeHandle(ref, () => ({
    show: showToast,
  }));

  return (
    <>
      {description && isVisible && (
        <div className={`toast-messages ${type}`}>
          <div className="toast-messages__body">
            {/* <div className="toast-messages__body__icon">
              {type === "success" && (
                <i className="fa-solid fa-circle-check"></i>
              )}
              {type === "warning" && (
                <i className="fa-solid fa-circle-exclamation"></i>
              )}
              {type === "error" && (
                <i className="fa-solid fa-triangle-exclamation"></i>
              )}
            </div> */}
            <p>{description}</p>
          </div>
          <button onClick={() => setIsVisible(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
    </>
  );
});

export default ToastMessage;
