import React, { useState } from "react";
import "./style.scss";
import HeaderSection from "../../components/HeaderSection";
import { useAuth } from "../../context/authContext";
import { TSong, TStateParams } from "../../types";
import { favouriteApi } from "../../apis";
import { useQuery } from "react-query";
import CardSong from "../../components/CardSong";

export default function RecentlyPage() {
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
    <div className="recently">
      <div className="recently__container">
        <div className="recently__container__header">
          <HeaderSection title={"Recently"} />
        </div>
        <div className="recently__container__body">
          <div className="recently__container__body__list row">
            {songs?.map((song, index) => {
              return (
                <div key={index} className={"pc-2 t-3 m-6"}>
                  <CardSong
                    id={song?.id}
                    title={song?.title}
                    author={song?.author}
                    image={song?.image_path}
                    userId={song?.user_id ?? ""}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
