import React, { useEffect, useRef, useState } from "react";
import "./modal.scss";
import Images from "../../constants/images";

interface ModalProps {
  children: React.ReactNode;
  title: string;
  openModal: boolean;
  setOpenModal: Function;
}

export default function Modal(props: ModalProps) {
  const modalBodyRef = useRef<HTMLInputElement>(null);
  //   const [openModal,setOpenModal] = useState(false)

  const { openModal, setOpenModal } = props;

  useEffect(() => {
    if (openModal === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openModal]);

  useEffect(() => {
    function handleMousedown(event: MouseEvent) {
      const node = event.target as Node;

      if (!modalBodyRef.current?.contains(node)) {
        setOpenModal(false);
      }
    }
    document.addEventListener("mousedown", (event) => handleMousedown(event));
    return () => document.removeEventListener("mousedown", (event) => handleMousedown(event));
  });

  return (
    <div className={`Modal ${openModal ? "active" : ""}`}>
      <div ref={modalBodyRef} className="Modal__wrapper">
        <div className="Modal__wrapper__body">{props.children}</div>
        
        <div className="Modal__wrapper__bg">
          <img src={Images.BG} alt="" />
        </div>

        <button className="btn_close" onClick={() => setOpenModal(false)}>
          <i className="fa-light fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}
