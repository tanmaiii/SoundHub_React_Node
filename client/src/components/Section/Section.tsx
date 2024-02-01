import React from "react";
import Card from "../Card/Card";
import img from "../../assets/images/poster2.png";
import "./section.scss";
import HeaderSection from "../HeaderSection/HeaderSection";

function Section(props: any) {
  return (
    <div className="section">
      <HeaderSection title={props.title} />
      <div className="section__main">
        <div className="section__main__slide">
          <div className="row">
            <Card
              title={"Nấu ăn cho em"}
              artist={"Đen"}
              image={img}
              className={"col pc-2 t-4 m-6"}
            />
            <Card
              title={"Nấu ăn cho em"}
              artist={"Đen"}
              image={img}
              className={"col pc-2 t-4 m-6"}
            />
            <Card
              title={"Nấu ăn cho em"}
              artist={"Đen"}
              image={img}
              className={"col pc-2 t-4 m-6"}
            />
            <Card
              title={"Nấu ăn cho em"}
              artist={"Đen"}
              image={img}
              className={"col pc-2 t-4 m-6"}
            />
            <Card
              title={"Nấu ăn cho em"}
              artist={"Đen"}
              image={img}
              className={"col pc-2 t-4 m-6"}
            />
            <Card
              title={"Nấu ăn cho em"}
              artist={"Đen"}
              image={img}
              className={"col pc-2 t-4 m-6"}
            />
            <Card
              title={"Nấu ăn cho em"}
              artist={"Đen"}
              image={img}
              className={"col pc-2 t-4 m-6"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section;
