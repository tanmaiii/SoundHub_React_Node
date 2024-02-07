import React, { Children } from "react";
import Card from "../Card/Card";
import img from "../../assets/images/poster2.png";
import "./section.scss";
import HeaderSection from "../HeaderSection/HeaderSection";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import "./slick-theme.scss";
// import "./slick.scss";

import Slider from "react-slick";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 6, // Số lượng hiển thị item mỗi lần
  slidesToScroll: 6,
  nextArrow: <></>,
  prevArrow: <></>,
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};

interface SectionProps {
  children: React.ReactNode;
  title: string;
  to?: string,
}

function Section({ children, title, to }: SectionProps) {
  return (
    <div className="section">
      <HeaderSection title={title} to={to} />
      <div className="section__main">
        <div className="section__main__slide">
          <Slider {...settings}>{children}</Slider>
        </div>
      </div>
    </div>
  );
}

export default Section;
