import React from "react";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import "./playlistPage.scss";
import Images from "../../constants/images";
import Track from "../../components/Track";
import { TSong } from "../../types";

const data: TSong = {
    title: "asdasdasd",
    id: "1231312-1231312",
    author: "tAN mAI",
    song_path: "https:",
    image_path: "https:",
    count: 123,
    user_id: "1231232",
}


export default function PlaylistPage() {
  return (
    <div className="playlistPage">
      <HeaderPage
        avt={Images.AVATAR}
        title="Thằng điên"
        author="JustaTee"
        avtAuthor={Images.AVATAR}
        time="2022"
        // listen="18,714,210"
        category="Playlist"
        like="23,123"
        song="20 songs"
      />
      <div className="playlistPage__content">
        <div className="playlistPage__content__header">
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
        <div className="playlistPage__content__tracklist">
          <Track
           song={data}
          />
        </div>
      </div>
    </div>
  );
}
