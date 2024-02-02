import React from "react";
import "./barPlaying.scss";
import { Link } from "react-router-dom";
import img from "../../assets/images/poster.png";

export default function BarPlaying() {
  return (
    <div className="barPlaying">
      <div className="barPlaying__left ">
        <CardSong image={img} title={"Em của ngày hôm qua"} artist={"Sơn Tùng TMP"} />
      </div>
      <div className="barPlaying__center ">
        <ControlsBar />
      </div>
      <div className="barPlaying__right ">
        <ControlsRight />
      </div>
    </div>
  );
}

const CardSong = (props: any) => {
  return (
    <div className="CardSong">
      <div className="CardSong__image">
        <img src={props?.image} alt="" />
      </div>
      <div className="CardSong__desc">
        <span className="CardSong__desc__title">{props?.title}</span>
        <div className="CardSong__desc__info">
          <Link to={"/"}>
            <span>{props?.artist}</span>
          </Link>
        </div>
      </div>
      <div className="CardSong__control">
        <button>
          <i className="fa-light fa-heart"></i>
        </button>
      </div>
    </div>
  );
};

const ControlsBar = (props: any) => {
  return (
    <div className="ControlsBar">
      <div className="ControlsBar__actions">
        <button className="active">
          <i className="fa-light fa-shuffle"></i>
        </button>
        <button>
          <i className="fa-solid fa-backward-step"></i>
        </button>
        <button className="btn_play">
          <i className="fa-solid fa-pause"></i>
          {/* <i class="fa-solid fa-play"></i> */}
        </button>
        <button>
          <i className="fa-solid fa-forward-step"></i>
        </button>
        <button className="">
          <i className="fa-light fa-repeat"></i>
        </button>
      </div>
      <div className="ControlsBar__bar">
        <span>0:00</span>
        <div className="progressbar"></div>
        <span>3:21</span>
      </div>
    </div>
  );
};

const ControlsRight = (props: any) => {
  return (
    <div className="ControlsRight">
      <div className="ControlsRight__volume">
        <button>
          <i className="fa-light fa-volume"></i>
          {/* <i className="fa-light fa-volume-xmark"></i> */}
        </button>
        <div className="ControlsRight__volume__progressbar"></div>
      </div>
      <button className="ControlsRight__list">
        <i className="fa-duotone fa-list"></i>
      </button>
    </div>
  );
};
