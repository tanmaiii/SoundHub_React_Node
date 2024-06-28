import React, { useState } from "react";
import Track from "../../components/Track/Track";
import "./discographyPage.scss";
import Card from "../../components/CardSong";
import { TSong } from "../../types";
import { songApi } from "../../apis";

import { useQuery, useMutation } from "react-query";
import { useAuth } from "../../context/authContext";

const song: TSong = {
  id: "1",
  title: "song",
  user_id: "song",
  genre_id: "song",
  song_path: "song",
  image_path: "song",
  public: 1,
  author: "song",
  created_at: "song",
};

export default function DiscographyPage() {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [songs, setSongs] = useState<TSong[] | null>(null);
  const {token} = useAuth();

  const handleGetSong = async () => {
    try {
      // const res = await songApi.getAllByUserId(token,1, 10, 10);
      // res.data && setSongs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, error, data } = useQuery(["songs"], () => handleGetSong());

  return (
    <div className="discography">
      <div className="discography__container">
        <div className="discography__container__header">
          <div className="discography__container__header__left">
            <h4>Phuong Ly</h4>
          </div>
          <div className="discography__container__header__right">
            <div className="dropdown">
              <div className="dropdown__header" onClick={() => setActiveDropdown(!activeDropdown)}>
                <i className="fa-light fa-bars-sort"></i>
                <span>Mới nhất</span>
                <i className="fa-light fa-chevron-down"></i>
              </div>
              <div className={`dropdown__content ${activeDropdown ? "active" : ""}`}>
                <ul>
                  <li>Mới nhất</li>
                  <li>Phổ biến</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="discography__container__body">
          <div className="discography__container__body__header">
            <div className="discography__container__body__header__line1 pc-6 m-8">
              <div className="count">#</div>
              <div className="title">Title</div>
            </div>
            <div className="discography__container__body__header__line2 pc-3 m-0">
              <div>Date Add</div>
            </div>
            <div className="discography__container__body__header__line3 pc-3 m-4">
              <div>Time</div>
            </div>
          </div>
          {/* <div className="discography__container__body__list">
            {songs &&
              songs.map((song, index) => (
                <Track
                  key={index}
                  loading={isLoading}
                  id={song.id}
                  number={`${index + 1}`}
                  time="3:03"
                  title={song.title}
                  created_at={song.created_at}
                  image={song.image_path}
                  artist={"Sơn Tùng M-TP"}
                />
              ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
