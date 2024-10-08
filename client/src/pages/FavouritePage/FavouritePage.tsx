import React, { useState } from "react";
import { useQuery } from "react-query";
import { favouriteApi } from "../../apis";
import Track from "../../components/Track";
import { useAuth } from "../../context/AuthContext";
import { TSong, TStateParams } from "../../types";
import "./favouritePage.scss";
import TableTrack from "../../components/TableTrack";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import Images from "../../constants/images";
import { apiConfig } from "../../configs";
import { Helmet } from "react-helmet-async";
import { useAudio } from "../../context/AudioContext";

export default function FavouritePage() {
  const [songs, setSongs] = useState<TSong[] | null>(null);
  const { token, currentUser } = useAuth();
  const { queue, updateQueue } = useAudio();

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
          category="Playlist"
          userId={currentUser?.id || ""}
          song={songs?.length ?? 0}
        />
      </div>
      <div className="favourite__content">
        <div className="favourite__content__header">
          <div className="favourite__content__header__left">
            {songs && songs?.length > 0 && (
              <button
                className="btn__play"
                onClick={() =>
                  updateQueue(
                    songs
                      .filter((song) => song?.id)
                      .map((song) => song!.id!)
                      .filter(Boolean)
                  )
                }
              >
                <i className="fa-solid fa-play"></i>
              </button>
            )}
            {/* <button>
              <i className="fa-solid fa-ellipsis"></i>
            </button> */}
          </div>
        </div>
        <TableTrack songs={songs} isLoading={isLoading} />
      </div>
    </div>
  );
}
