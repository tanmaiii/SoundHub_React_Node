import React, { useEffect, useState } from "react";
import "./style.scss";
import HeaderSection from "../../components/HeaderSection";
import { useAuth } from "../../context/AuthContext";
import { TSong, TStateParams } from "../../types";
import { favouriteApi, playApi } from "../../apis";
import { useQuery } from "react-query";
import CardSong from "../../components/CardSong";
import { useTranslation } from "react-i18next";

export default function RecentlyPage() {
  const [songs, setSongs] = useState<TSong[] | null>(null);
  const { token, currentUser } = useAuth();
  const { t } = useTranslation("home");

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

  const getAllData = async (newPage?: number) => {
    updateState({ loading: true });
    try {
      const res = await playApi.getAllSongRecently(
        token ?? "",
        newPage ?? page,
        limit,
        keyword,
        sort
      );
      console.log(res);
      
      if (res.pagination.page === 1 && res.data) {
        setSongs(null);
        setSongs(res.data);
      } else {
        setSongs((prev) => [...(prev ?? []), ...res.data]);
      }
      updateState({
        loading: false,
        page: res?.pagination.page,
        totalPages: res?.pagination.totalPages,
        totalCount: res?.pagination.totalCount,
      });
    } catch (error) {}
  };

  const { isLoading } = useQuery({
    queryKey: ["songs-recently", currentUser?.id],
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
    <div className="recently">
      <div className="recently__container">
        <div className="recently__container__header">
          <HeaderSection title={t("navbar.recently")} />
        </div>
        <div className="recently__container__body">
          <div className="recently__container__body__list row sm-gutter">
            {songs?.map((song, index) => {
              return (
                <div key={index} className={"col pc-2 t-3 m-6"}>
                  <CardSong
                    id={song?.id}
                    title={song?.title}
                    author={song?.author}
                    image={song?.image_path}
                    userId={song?.user_id ?? ""}
                    isPublic={song?.public}
                  />
                </div>
              );
            })}
          </div>
          <div className="recently__container__body__loadMore">
            {page < totalPages && <button onClick={loadMore}>Load More</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
