import React from "react";
import Card from "../Card/Card";
import img from "../../assets/images/1.png";
import "./section.scss";

function Section(props: any) {
  return (
    <div className="section">
      <div className="section__header">
        <h4 className="section__header__title">{props?.title}</h4>
        <button className="section__header__button">
          <a href="">View all</a>
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>
      <div className="section__main">
        <div className="section__main__slide row">
          <Card image={img} title={"Nấu ăn cho em"} artist={"Đen"} className={"col pc-2"} />
          <Card image={img} title={"Nấu ăn cho em"} artist={"Đen"} className={"col pc-2"} />
          <Card image={img} title={"Nấu ăn cho em"} artist={"Đen"} className={"col pc-2"} />
          <Card image={img} title={"Nấu ăn cho em"} artist={"Đen"} className={"col pc-2"} />
          <Card image={img} title={"Nấu ăn cho em"} artist={"Đen"} className={"col pc-2"} />
        </div>
      </div>
    </div>
  );
}

export default Section;
