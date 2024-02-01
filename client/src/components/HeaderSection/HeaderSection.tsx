import React from "react";
import './headerSection.scss'

export default function HeaderSection(props: any) {
  return (
    <div className="HeaderSection">
      <h4 className="HeaderSection__title">{props?.title}</h4>
      <button className="HeaderSection__button">
        <a href="">View all</a>
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
}
