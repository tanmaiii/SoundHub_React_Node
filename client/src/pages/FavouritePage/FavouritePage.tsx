import React, { useEffect, useState } from "react";
import "./favouritePage.scss";
import Card from "../../components/Card/Card";
import Images from "../../constants/images";
import { songApi } from "../../apis";
import { ListResponse, TSong } from "../../model";
import Track from "../../components/Track/Track";
import { useQuery, useMutation } from "react-query";

const song: TSong = {
  id: 1,
  title: "song",
  user_id: "song",
  genre_id: "song",
  song_path: "song",
  private: 1,
  author: "song",
  created_at: "12-01-2003",
};

export default function FavouritePage() {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [songs, setSongs] = useState<TSong[] | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleGetSong = async () => {
    try {
      const res = await songApi.getAllFavoritesByUser(limit, page);
      res.data && setSongs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, error, data } = useQuery("song-favourite", handleGetSong);

  return (
    <div className="favourite">
      <div className="favourite__container">
        <div className="favourite__container__header">
          <div className="favourite__container__header__left">
            <h4>Favourite</h4>
          </div>
          <div className="favourite__container__header__right">
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
        <div className="favourite__container__body ">
          <div className="favourite__container__body__header">
            <div className="favourite__container__body__header__line1 pc-6 m-8">
              <div className="count">#</div>
              <div className="title">Title</div>
            </div>
            <div className="favourite__container__body__header__line2 pc-3 m-0">
              <div>Date Add</div>
            </div>
            <div className="favourite__container__body__header__line3 pc-3 m-4">
              <div>Time</div>
            </div>
          </div>
          <div className="favourite__container__body__list">
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
                  artist={["Phương Ly"]}
                />
                // <Card key={index} song={song} className="col pc-2 t-3 m-6" loading={loading} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
