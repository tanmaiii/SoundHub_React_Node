import React, { useState } from "react";
import { useQuery } from "react-query";
import { favouriteApi } from "../../apis";
import Track from "../../components/Track/Track";
import { useAuth } from "../../context/authContext";
import { TSong, TStateParams } from "../../types";
import "./favouritePage.scss";

export default function FavouritePage() {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [songs, setSongs] = useState<TSong[] | null>(null);
  const { token, currentUser } = useAuth();

  const [state, setState] = React.useState<TStateParams>({
    page: 1,
    limit: 10,
    loading: false,
    totalPages: 1,
    totalCount: 0,
    refreshing: false,
    keyword: "",
    sort: "new",
  });

  const {
    limit,
    page,
    loading,
    sort,
    totalPages,
    keyword,
    refreshing,
    totalCount,
  } = state;

  const updateState = (newValue: Partial<TStateParams>) => {
    setState((prevState) => ({ ...prevState, ...newValue }));
  };

  const getData = async (newPage?: number) => {
    newPage && updateState({ page: newPage });
    const res = await favouriteApi.getSongs(
      token,
      newPage || page,
      limit,
      sort
    );
    if (res.pagination.page === 1) {
      setSongs(null);
      updateState({ totalPages: res.pagination.totalPages });
      updateState({ totalCount: res.pagination.totalCount });
      setSongs(res.data);
    } else {
      setSongs((prevSongs) => prevSongs && [...prevSongs, ...res.data]);
    }
    return res;
  };

  const { isLoading } = useQuery({
    queryKey: ["songs-favorites", currentUser?.id],
    queryFn: async () => {
      return await getData(1);
    },
  });

  return (
    <div className="favourite">
      <div className="favourite__container">
        <div className="favourite__container__header">
          <div className="favourite__container__header__left">
            <h4>Favourite</h4>
          </div>
          <div className="favourite__container__header__right">
            <div className="dropdown">
              <div
                className="dropdown__header"
                onClick={() => setActiveDropdown(!activeDropdown)}
              >
                <i className="fa-light fa-bars-sort"></i>
                <span>Mới nhất</span>
                <i className="fa-light fa-chevron-down"></i>
              </div>
              <div
                className={`dropdown__content ${
                  activeDropdown ? "active" : ""
                }`}
              >
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
                <Track song={song} loading={isLoading} />
                // <Card key={index} song={song} className="col pc-2 t-3 m-6" loading={loading} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
