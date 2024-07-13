import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import TableTrack from "../../components/TableTrack";
import Images from "../../constants/images";
import "./playlistPage.scss";
import { useEffect, useState } from "react";
import { TPlaylist } from "../../types";
import { playlistApi, songApi, userApi } from "../../apis";
import { useAuth } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiConfig } from "../../configs";
import { use } from "i18next";
import { Helmet } from "react-helmet-async";
import SongMenu from "../../components/Menu/SongMenu";
import PlaylistMenu from "../../components/Menu/PlaylistMenu";
import Modal from "../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import { log } from "console";

export default function PlaylistPage() {
  const navigation = useNavigate();
  const { id } = useParams();
  const { token, currentUser } = useAuth();
  const [totalCount, setTotalCount] = useState(0);
  const queryClient = useQueryClient();
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { t } = useTranslation("playlist");

  const {
    data: playlist,
    isLoading: loadingPlaylist,
    refetch: refetchPlaylist,
    error: errorPlaylist,
  } = useQuery({
    queryKey: ["playlist", id],
    queryFn: async () => {
      try {
        const res = await playlistApi.getDetail(id ?? "", token);
        return res;
      } catch (error) {
        navigation("/");
        return null;
      }
    },
  });

  const { data: author } = useQuery({
    queryKey: ["author", playlist?.user_id],
    queryFn: async () => {
      try {
        const res = await userApi.getDetail(playlist?.user_id ?? "");
        return res;
      } catch (error) {
        return null;
      }
    },
  });

  const {
    data: songs,
    refetch: refetchSongs,
    isLoading: loadingSongs,
  } = useQuery({
    queryKey: ["playlist-songs", id],
    queryFn: async () => {
      const res = await songApi.getAllByPlaylistId(token, id || "", 1, 0);
      setTotalCount(res.pagination.totalCount);
      return res.data;
    },
  });

  const { data: isLike } = useQuery({
    queryKey: ["like-playlist", id],
    queryFn: async () => {
      const res = await playlistApi.checkLikedPlaylist(id ?? "", token);
      return res.isLiked;
    },
  });

  // const { data: countLikes } = useQuery({
  //   queryKey: ["playlist-count", id],
  //   queryFn: async () => {
  //     const res = await playlistApi.countLikes(id ?? "", token);
  //     return res;
  //   },
  // });

  const mutationLike = useMutation({
    mutationFn: (like: boolean) => {
      if (like) return playlistApi.unLikePlaylist(id ?? "", token);
      return playlistApi.likePlaylist(id ?? "", token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", id] });
      queryClient.invalidateQueries({ queryKey: ["like-playlist", id] });
      queryClient.invalidateQueries({ queryKey: ["all-favorites"] });
      queryClient.invalidateQueries({ queryKey: ["playlists-favorites"] });
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="playlistPage">
      <Helmet>
        <title>{`${playlist?.title} | Sound hub`}</title>
      </Helmet>

      <div className="playlistPage__header">
        <HeaderPage
          fbAvt={Images.PLAYLIST}
          avt={playlist?.image_path ?? ""}
          title={playlist?.title ?? ""}
          author={author?.name ?? ""}
          avtAuthor={author?.image_path ?? ""}
          time={playlist?.created_at ?? ""}
          category="Playlist"
          like={playlist?.count_like ?? 0}
          song={totalCount ?? 0}
          userId={playlist?.user_id}
          fnOpenEdit={() => setOpenModal(true)}
        />
      </div>
      <div className="playlistPage__content">
        <div className="playlistPage__content__header">
          <div className="playlistPage__content__header__left">
            {songs && songs?.length > 0 && (
              <button className="btn__play">
                <i className="fa-solid fa-play"></i>
              </button>
            )}
            {playlist?.user_id && currentUser?.id !== playlist?.user_id && (
              <button
                className={`btn__like ${isLike ? "active" : ""}`}
                onClick={() => mutationLike.mutate(isLike ?? false)}
              >
                {isLike ? (
                  <i className="fa-solid fa-heart"></i>
                ) : (
                  <i className="fa-light fa-heart"></i>
                )}
              </button>
            )}
            <button className={`btn__menu ${activeMenu ? "active" : ""}`}>
              <PlaylistMenu
                id={id || ""}
                active={activeMenu}
                placement="bottom-start"
                onOpen={() => setActiveMenu(true)}
                onClose={() => setActiveMenu(false)}
              />
            </button>
          </div>
          {/* <div className="playlistPage__content__header__right">
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

        <TableTrack
          songs={songs || []}
          isLoading={true}
          userId={playlist?.user_id}
        />
      </div>

      <Modal
        title={t("EditPlaylist.EditPlaylist")}
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <div className="ModalEdit">
          <div className="ModalEdit__top">
            <div className="ModalEdit__top__image">
              <img
                src={apiConfig.imageURL(playlist?.image_path ?? "")}
                alt=""
              />
              <div className="ModalEdit__top__image__edit">
                <i className="fa-regular fa-pen-to-square"></i>
                <span>Edit playlist</span>
              </div>
            </div>
            <div className="ModalEdit__top__body">
              <div className="ModalEdit__top__body__title">
                <input
                  type="text"
                  id="title"
                  value={playlist?.title}
                  placeholder="Add title"
                />
                <label htmlFor="title">{t("EditPlaylist.Title")}</label>
              </div>
              <div className="ModalEdit__top__body__desc">
                <textarea
                  id="title"
                  value={playlist?.desc}
                  placeholder="Add description"
                />
                <label htmlFor="title">{t("EditPlaylist.Description")}</label>
              </div>
              {/* dropdown genre */}
              <div className="select">
                <div className="select__header">
                  <input
                    type="text"
                    placeholder="  "
                    onFocus={() => setActiveDropdown(!activeDropdown)}
                  />
                  <label>{t("EditPlaylist.Genre")}</label>
                  <button
                    className={`${activeDropdown ? "active" : ""}`}
                    onClick={() => {
                      console.log(!activeDropdown);

                      setActiveDropdown(!activeDropdown);
                    }}
                  >
                    <i className="fa-regular fa-chevron-down"></i>
                  </button>
                </div>
                <div
                  className={`select__body ${activeDropdown ? "active" : ""}`}
                >
                  <div className="select__body__item">
                    <input type="radio" />
                    <span>akdjhaskdhkas</span>
                  </div>
                  <div className="select__body__item">
                    <input type="radio" />
                    <span>akdjhaskdhkas</span>
                  </div>
                  <div className="select__body__item">
                    <input type="radio" />
                    <span>akdjhaskdhkas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ModalEdit__bottom">
            <button>{t("EditPlaylist.Cancel")}</button>
            <button>{t("EditPlaylist.Save")}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
