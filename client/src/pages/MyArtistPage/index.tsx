import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.scss";
import HeaderSection from "../../components/HeaderSection";
import { favouriteApi, playlistApi } from "../../apis";
import { ResSoPaAr, TPlaylist, TStateParams } from "../../types";
import { useAuth } from "../../context/authContext";
import { useQuery } from "react-query";
import CardPlaylist from "../../components/CardPlaylist";
import CardArtist from "../../components/CardArtist";

type TFilter = "all" | "my";

const MyArtistPage = () => {
  const [filter, setFilter] = useState<TFilter>("all");

  useEffect(() => {
    window.scroll(0, 0);
  }, [filter]);

  const [data, setData] = useState<ResSoPaAr[] | null>(null);
  const { token } = useAuth();

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
    updateState({ loading: true });
    try {
      const res = await favouriteApi.getArtists(
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
    queryKey: ["artists-follow"],
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
    <div className="MyArtistPage">
      <div className="MyArtistPage__container">
        <div className="MyArtistPage__container__header">
          <HeaderSection title="Artist" />
        </div>
        <div className="MyArtistPage__container__body">
          <div className="MyArtistPage__container__body__list">
            {data?.map((artist, index) => {
              return (
                <div className={"pc-2 t-3 m-6"}>
                  <CardArtist
                    key={index}
                    id={artist?.id}
                    name={artist?.name ?? ""}
                    image={artist?.image_path ?? ""}
                  />
                </div>
              );
            })}
          </div>
          <div className="MyArtistPage__container__body__loadMore">
            {page < totalPages && <button onClick={loadMore}>Load More</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyArtistPage;
