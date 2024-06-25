import React from "react";
import "./sectionChartItem.scss";
import Skeleton from "react-loading-skeleton";

const listMusic = [
  {
    Title: "Super Shy Super Shy Super Shy Super Shy Super Shy",
    Artist: "NewJeans",
    Quantity: "432,329,228",
    Time: "3:21",
    Poster: "https://picsum.photos/200/300",
  },
  {
    Title: "OMG",
    Artist: "NewJeans",
    Quantity: "432,329,228",
    Time: "3:21",
    Poster: "https://picsum.photos/200/300",
  },
  {
    Title: "Ditto",
    Artist: "NewJeans",
    Quantity: "432,329,228",
    Time: "3:21",
    Poster: "https://picsum.photos/200/300",
  },
  {
    Title: "GODS",
    Artist: "NewJeans",
    Quantity: "432,329,228",
    Time: "3:21",
    Poster: "https://picsum.photos/200/300",
  },
];

interface SectionChartItemProps {
  title: string;
  className: string;
  loading?: boolean;
}

export default function SectionChartItem({
  className,
  title,
  loading = false,
}: SectionChartItemProps) {
  return (
    <div className={`SectionChartItem ${className}`}>
      <div className="SectionChartItem__banner ">
        <div className="SectionChartItem__banner__image">
          {loading ? <Skeleton height="100%" /> : <img src={listMusic[0]?.Poster} alt="" />}
        </div>
        <h4 className="SectionChartItem__banner__title">{title}</h4>
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
              {loading ? <Skeleton height="100%" /> : <img src={item?.Poster} alt="" />}
            </div>
            <div className="SectionChartItem__list__item__main">
              <h4 className="SectionChartItem__list__item__main__title">
                {loading ? <Skeleton count={1} /> : item.Title}
              </h4>
              {loading ? (
                <Skeleton count={1} />
              ) : (
                <div className="SectionChartItem__list__item__main__desc">
                  <span>{item.Artist}</span>
                  <i className="fa-solid fa-circle"></i>
                  <span>{item.Time}</span>
                </div>
              )}
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
