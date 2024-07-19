import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.scss";
import HeaderSection from "../../components/HeaderSection";
import { favouriteApi, playlistApi } from "../../apis";
import { ResSoPaAr, TPlaylist, TStateParams } from "../../types";
import { useAuth } from "../../context/authContext";
import { useQuery } from "react-query";
import CardPlaylist from "../../components/CardPlaylist";
import Images from "../../constants/images";
import Modal from "../../components/Modal";
import ModalAddPlaylist from "../../components/Modal/ModalAddPlaylist";

type TFilter = "all" | "my";

const MyPlaylistPage = () => {
  const [filter, setFilter] = useState<TFilter>("all");
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    window.scroll(0, 0);
  }, [filter]);

  return (
    <div className="MyPlaylistPage">
      <div className="MyPlaylistPage__container">
        <div className="MyPlaylistPage__container__header">
          {/* <HeaderSection title="Playlist" /> */}
          <div className="MyPlaylistPage__container__header__title">
            <h2>Playlist</h2>
            <button onClick={() => setOpenModal(true)}>
              <i className="fa-regular fa-plus"></i>
            </button>
          </div>
          <div className="MyPlaylistPage__container__header__nav">
            <ul>
              <li>
                <button
                  onClick={() => setFilter("all")}
                  className={`${filter === "all" ? "active" : ""}`}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  onClick={() => setFilter("my")}
                  className={`${filter === "my" ? "active" : ""}`}
                >
                  My
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="MyPlaylistPage__container__body">
          {filter === "all" ? <AllPlaylists /> : <MyPlaylists />}
        </div>

        <Modal
          title="Add Playlist"
          openModal={openModal}
          setOpenModal={setOpenModal}
        >
          <ModalAddPlaylist
            openModal={openModal}
            closeModal={() => setOpenModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default MyPlaylistPage;

const AllPlaylists = () => {
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
    <div>
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
  );
};

const MyPlaylists = () => {
  const [data, setData] = useState<TPlaylist[] | null>(null);
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
      const res = await playlistApi.getMe(
        token ?? "",
        newPage ?? page,
        limit,
        sort,
        keyword
      );
      if (res.pagination.page === 1) {
        setData(null);
        setData(res.data);
        console.log(res.data);
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
    <div>
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
  );
};
