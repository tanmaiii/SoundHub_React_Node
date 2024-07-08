import React, { useState } from "react";
import { useQuery } from "react-query";
import { favouriteApi } from "../../apis";
import Track from "../../components/Track";
import { useAuth } from "../../context/authContext";
import { TSong, TStateParams } from "../../types";
import "./favouritePage.scss";
import TableTrack from "../../components/TableTrack";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import Images from "../../constants/images";
import { apiConfig } from "../../configs";
import { Helmet } from "react-helmet-async";

export default function FavouritePage() {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [songs, setSongs] = useState<TSong[] | null>(null);
  const { token, currentUser } = useAuth();

  const [state, setState] = React.useState<TStateParams>({
    page: 1,
    limit: 0,
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
      <Helmet>
        <title>{`Favourite | Sound hub`}</title>
      </Helmet>

      <div className="favourite__header">
        <HeaderPage
          avt={Images.LIKED_SONGS}
          fbAvt={Images.LIKED_SONGS}
          title="Liked songs"
          avtAuthor={apiConfig.imageURL(currentUser?.image_path || "")}
          author={currentUser?.name || ""}
          category="Playlist"
          userId={currentUser?.id || ""}
          song={songs?.length ?? 0}
        />
      </div>
      <div className="favourite__content">
        <div className="favourite__content__header">
          <div className="favourite__content__header__left">
            {songs && songs?.length > 0 && (
              <button className="btn__play">
                <i className="fa-solid fa-play"></i>
              </button>
            )}
            <button>
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          {/* <div className="favourite__content__header__right">
            {songs && songs?.length > 0 && (
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
            )}
          </div> */}
        </div>
        <TableTrack songs={songs} isLoading={isLoading} />
      </div>
    </div>
  );
}
