import React from "react";
import HeaderSection from "../HeaderSection";
import "./style.scss";
import CardSong from "../CardSong";

export default function SectionSkeleton() {
  return (
    <div className="section">
      <HeaderSection title={""} loading={true} />
      <div className="section__main">
        <div className="section__main__slide">
          <div className={"pc-2 t-3 m-4"}>
            <CardSong title="" author="" image="" userId="" loading={true} />
          </div>
          <div className={"pc-2 t-3 m-4"}>
            <CardSong title="" author="" image="" userId="" loading={true} />
          </div>
          <div className={"pc-2 t-3 m-4"}>
            <CardSong title="" author="" image="" userId="" loading={true} />
          </div>
          <div className={"pc-2 t-3 m-4"}>
            <CardSong title="" author="" image="" userId="" loading={true} />
          </div>
          <div className={"pc-2 t-3 m-4"}>
            <CardSong title="" author="" image="" userId="" loading={true} />
          </div>
          <div className={"pc-2 t-3 m-4"}>
            <CardSong title="" author="" image="" userId="" loading={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
