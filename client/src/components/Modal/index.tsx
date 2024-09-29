import React, { useEffect, useRef, useState } from "react";
import "./style.scss";

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

export default function Modal({
  children,
  title,
  openModal,
  setOpenModal,
}: ModalProps) {
  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openModal === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openModal]);

  useEffect(() => {
    const handleMousedown = (event: MouseEvent) => {
      if (!modalBodyRef.current?.contains(event.target as Node)) {
        setOpenModal(false);
      }
    };
    document.addEventListener("mousedown", handleMousedown);
    return () => document.removeEventListener("mousedown", handleMousedown);
  });

  return (
    <div className={`Modal ${openModal ? "active" : ""}`}>
      <div ref={modalBodyRef} className="Modal__wrapper">
        <div className={`Modal__wrapper__header ${!title ? "not-title" : ""}`}>
          <h3>{title && title}</h3>
          <button
            className={`btn_close ${!title ? "not-title" : ""}`}
            onClick={() => setOpenModal(false)}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="Modal__wrapper__body">{children}</div>
      </div>
    </div>
  );
}
