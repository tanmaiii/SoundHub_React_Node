import React from "react";
import img from "../../assets/images/poster.png";
import "./sectionChartItem.scss";

const listMusic = [
  {
    Title: "Super Shy Super Shy Super Shy Super Shy Super Shy",
    Artist: "NewJeans",
    Quantity: "432,329,228",
    Time: "3:21",
    Poster: img,
  },
  {
    Title: "OMG",
    Artist: "NewJeans",
    Quantity: "432,329,228",
    Time: "3:21",
    Poster: img,
  },
  {
    Title: "Ditto",
    Artist: "NewJeans",
    Quantity: "432,329,228",
    Time: "3:21",
    Poster: img,
  },
  {
    Title: "GODS",
    Artist: "NewJeans",
    Quantity: "432,329,228",
    Time: "3:21",
    Poster: img,
  },
];

export default function SectionChartItem(props: any) {
  return (
    <div className={`SectionChartItem ${props?.className}`}>
      <div className="SectionChartItem__banner ">
        <div className="SectionChartItem__banner__image">
          <img src={listMusic[0]?.Poster} alt="" />
        </div>
        <h4 className="SectionChartItem__banner__title">{props?.title}</h4>
      </div>
      <div className="SectionChartItem__list ">
        {listMusic.map((item, index) => (
          <div className="SectionChartItem__list__item" key={index}>
            <div className="SectionChartItem__list__item__quantity">
              <button>
                <i className="fa-duotone fa-play"></i>
              </button>
              <span>{index + 1}</span>
            </div>
            <div className="SectionChartItem__list__item__image">
              <img src={item?.Poster} alt="" />
            </div>
            <div className="SectionChartItem__list__item__main">
              <h4 className="SectionChartItem__list__item__main__title">{item.Title}</h4>
              <div className="SectionChartItem__list__item__main__desc">
                <span>{item.Artist}</span>
                <i className="fa-solid fa-circle"></i>
                <span>{item.Time}</span>
              </div>
            </div>
            <div className="SectionChartItem__list__item__control">
              <button>
                <i className="fa-light fa-heart"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
