import React from "react";
import SectionChartItem from "../SectionChartItem/SectionChartItem";
import HeaderSection from "../HeaderSection";
import "./sectionChartHome.scss";

export default function SectionChartHome(props: any) {
  return (
    <div className="SectionChartHome">
      <HeaderSection title={props.title} />
      <div className="SectionChartHome__main">
        <div className="SectionChartHome__main__slide row">
          <SectionChartItem title={"100 TOP Hits "} className={"col pc-6 t-6 m-12"} />
          <SectionChartItem title={"NEW RELEASE"} className={"col pc-6 t-6 m-12"} />
        </div>
      </div>
    </div>
  );
}
