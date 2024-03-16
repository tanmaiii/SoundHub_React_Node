import React from "react";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import "./songPage.scss";
import Section from "../../components/Section/Section";
import Card from "../../components/Card/Card";
import TrackArtist from "../../components/TrackArtist/TrackArtist";

import CommentItem from "../../components/CommentItem/CommentItem";

import avt from "../../assets/images/poster.png";
import img from "../../assets/images/poster.png";
import CommentInput from "../../components/CommentInput/CommentInput";

export default function SongPage() {
  return (
    <div className="songPage">
      <HeaderPage
        avt={avt}
        title="Thằng điên"
        author="JustaTee"
        avtAuthor={avt}
        time="2022"
        listen="18,714,210"
        category="Song"
      />
      <div className="songPage__content">
        <div className="songPage__content__header">
          <button className="btn__play">
            <i className="fa-solid fa-play"></i>
          </button>
          <button>
            <i className="fa-light fa-heart"></i>
          </button>
          <button>
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>

        <div className="songPage__content__body row">
          <div className="songPage__content__body__comment col pc-7 t-12">
            <CommentInput avatarUrl={avt} />

            <div className="songPage__content__body__comment__header">
              <div className="quantity">
                <i className="fa-light fa-comment"></i>
                <span>123 comments</span>
              </div>
              <div className="dropdown">
                <div className="dropdown__header">
                  <i className="fa-light fa-bars-sort"></i>
                  <span>Mới nhất</span>
                  <i className="fa-light fa-chevron-down"></i>
                </div>
                <div className={`dropdown__content`}>
                  <ul>
                    <li>Mới nhất</li>
                    <li>Phổ biến</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="songPage__content__body__comment__list">
              <CommentItem avatarUrl={avt} name="Tấn Mãi" time="2 hours ago" />
              <CommentItem avatarUrl={avt} name="Tấn Mãi" level={1} time="2 hours ago" />
              <CommentItem avatarUrl={avt} name="Tấn Mãi" level={2} time="2 hours ago" />
              <CommentItem avatarUrl={avt} name="Tấn Mãi" level={3} time="2 hours ago" />
              <CommentItem avatarUrl={avt} name="Tấn Mãi" time="2 hours ago" />
            </div>
          </div>
          <div className="songPage__content__body__artist col pc-5 t-12">
            <TrackArtist name="Phương Ly" avatarUrl={avt} className="col pc-12" />
            <TrackArtist name="Phương Ly" avatarUrl={avt} className="col pc-12" />
            <TrackArtist name="Phương Ly" avatarUrl={avt} className="col pc-12" />
          </div>
        </div>

        {/* <Section title={"Recommended"}>
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
          <Card id={1} title={"Nấu ăn cho em"} artist={["Đen"]} image={img} />
        </Section> */}
      </div>
    </div>
  );
}
