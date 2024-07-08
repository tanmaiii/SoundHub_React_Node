import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.scss";
import HeaderSection from "../../components/HeaderSection";
import { favouriteApi } from "../../apis";
import { ResSoPaAr, TStateParams } from "../../types";
import { useAuth } from "../../context/authContext";
import { useQuery } from "react-query";
import CardPlaylist from "../../components/CardPlaylist";

const MyPlaylistPage = () => {
  const [data, setData] = useState<ResSoPaAr[] | null>(null);
  const { token } = useAuth();
  // const lastElementRef = React.useRef<HTMLDivElement>(null);

  const [state, setState] = React.useState<TStateParams>({
    page: 1,
    limit: 12,
    loading: false,
    totalPages: 1,
    totalCount: 0,
    refreshing: false,
    keyword: "",
    sort: "new",
  });

  const { limit, page, loading, sort, totalPages, keyword, refreshing } = state;

  const updateState = (newState: Partial<TStateParams>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const getAllData = async (newPage?: number) => {
    console.log("getAllData");

    updateState({ loading: true });
    try {
      const res = await favouriteApi.getPlaylists(
        token ?? "",
        newPage ?? page,
        limit,
        sort,
        keyword
      );
      if (res.pagination.page === 1) {
        setData(null);
        setData(res.data);
      } else {
        setData((prev) => [...(prev ?? []), ...res.data]);
      }
      updateState({
        loading: false,
        page: res?.pagination.page,
        totalPages: res?.pagination.totalPages,
        totalCount: res?.pagination.totalCount,
      });
    } catch (error) {}
  };

  const { data: dataAll } = useQuery({
    queryKey: ["playlists-favorites"],
    queryFn: async () => {
      return await getAllData(1);
    },
  });

  const loadMore = () => {
    page < totalPages && updateState({ page: page + 1 });
  };

  useEffect(() => {
    getAllData();
  }, [page]);

  return (
    <div className="MyPlaylistPage">
      <div className="MyPlaylistPage__container">
        <div className="MyPlaylistPage__container__header">
          <HeaderSection title="Playlist" />
          <div className="MyPlaylistPage__container__header__nav">
            <ul>
              <li>
                <button>All</button>
              </li>
              <li>
                <button>My</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="MyPlaylistPage__container__body">
          <div className="MyPlaylistPage__container__body__list">
            {data?.map((playlist, index) => {
              return (
                <div className={"pc-2 t-3 m-6"}>
                  <CardPlaylist
                    key={index}
                    id={playlist?.id}
                    title={playlist?.title}
                    image={playlist?.image_path}
                    author={playlist?.author}
                    userId={playlist?.user_id ?? ""}
                    isPublic={playlist?.public ?? 1}
                  />
                </div>
              );
            })}
          </div>
          <div className="MyPlaylistPage__container__body__loadMore">
            {page < totalPages && <button onClick={loadMore}>Load More</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlaylistPage;
