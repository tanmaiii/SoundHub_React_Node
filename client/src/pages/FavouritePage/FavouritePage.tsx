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
      <div style={{ zIndex: 1 }}>
        <HeaderPage
          avt={Images.LIKED_SONGS}
          fbAvt={Images.LIKED_SONGS}
          title="Liked songs"
          // /https://picsum.photos/200/300
          avtAuthor={apiConfig.imageURL(currentUser?.image_path || "")}
          author={currentUser?.name || ""}
          category="Playlist"
          song={songs?.length.toString() ?? ""}
        />
      </div>
      <div style={{ zIndex: 2 }}>
        <TableTrack songs={songs} isLoading={isLoading} />
      </div>
    </div>
  );
}
