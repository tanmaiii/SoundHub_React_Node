import React from "react";
import "./artistPage.scss";
import Slider from "react-slick";

import avt from "../../assets/images/artistHoa.jpg";
import img from "../../assets/images/artistHoa.jpg";

import Track from "../../components/Track/Track";
import Section from "../../components/Section/Section";
import Card from "../../components/Card/Card";
import CardArtist from "../../components/CardArtist/CardArtist";
import { PATH } from "../../constants/paths";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1, // Số lượng hiển thị item mỗi lần
  slidesToScroll: 1,
  nextArrow: <></>,
  prevArrow: <></>,
};

export default function ArtistPage() {
  return (
    <div className="artist">
      <div className="artist__container">
        <div className="artist__container__hero">
          <div className="artist__container__hero__blur">
            <div className="bg-alpha"></div>
            <div className="blur" style={{ backgroundImage: `url(${avt})` }}></div>
          </div>
          <div className="artist__container__hero__body">
            <div className="avatar">
              <img src={avt} alt="" />
            </div>
            <div className="info">
              <div className="info__check">
                <i className="fa-duotone fa-badge-check"></i>
                <span>Verify</span>
              </div>
              <h2 className="info__name">Hòa Minzy</h2>
              <div className="info__desc">
                <span>270.314 followers</span>
                <button className="">
                  <span>Follow</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="artist__content">
        <div className="artist__content__top__section row">
          <div className="top__section__new col pc-4 t-12 m-12">
            <h4>New release</h4>
            <div className="top__section__new__list row">
              <div className="col pc-12 t-12 m-12">
                <Track
                  time="3:03"
                  title="Thằng điên 1"
                  image={avt}
                  artist={["Phương Ly", "Phương Ly"]}
                />
                <Track time="3:03" title="Thằng điên 2" image={avt} artist={["Phương Ly"]} />
              </div>
            </div>
          </div>
          <div className="top__section__popular col pc-8 t-12 m-12">
            <h4>Popular</h4>
            <div className="top__section__popular__list row">
              <div className="col pc-6 t-6 m-12">
                <Track time="3:03" title="Thằng điên" image={avt} artist={["Phương Ly"]} />
                <Track time="3:03" title="Thằng điên" image={avt} artist={["Phương Ly"]} />
                <Track time="3:03" title="Thằng điên" image={avt} artist={["Phương Ly"]} />
              </div>
              <div className="col pc-6 t-6 m-12">
                <Track time="3:03" title="Thằng điên" image={avt} artist={["Phương Ly"]} />
                <Track time="3:03" title="Thằng điên" image={avt} artist={["Phương Ly"]} />
                <Track time="3:03" title="Thằng điên" image={avt} artist={["Phương Ly"]} />
              </div>
            </div>
          </div>
        </div>

        <Section title={"Singles"} to={`${PATH.ARTIST + "/phuong-ly" + PATH.DISCOGRAPHY}`} >
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
        </Section>

        <Section title={`Featuring ${"Phương Ly"}`}>
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
          <Card title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
        </Section>

        <Section title={"Fans also like"}>
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
          <CardArtist name={"Mono"} image={avt} followers={"3456K"} />
        </Section>
      </div>
    </div>
  );
}
