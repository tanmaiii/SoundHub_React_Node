import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { playlistApi, songApi, userApi } from "../../apis";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import PlaylistMenu from "../../components/Menu/PlaylistMenu";
import Modal from "../../components/Modal";
import ModalEditPlaylist from "../../components/ModalPlaylist/EditPlaylist";
import TableTrack from "../../components/TableTrack";
import Images from "../../constants/images";
import { useAudio } from "../../context/AudioContext";
import { useAuth } from "../../context/AuthContext";
import "./style.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDispatch } from "react-redux";
import { openMenu } from "../../slices/menuPlaylistSlide";

export default function PlaylistPage() {
  const navigation = useNavigate();
  const { id } = useParams();
  const { token, currentUser } = useAuth();
  const [totalCount, setTotalCount] = useState(0);
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { t } = useTranslation("playlist");
  const menuPlaylist = useSelector((state: RootState) => state.menuPlaylist);
  const dispatch = useDispatch();
  const btnMenuRef = React.createRef<HTMLButtonElement>();

  const { updateQueue } = useAudio();

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

  const handleClickMenu = () => {
    const rect = btnMenuRef.current?.getBoundingClientRect();

    rect &&
      playlist &&
      dispatch(
        openMenu({
          open: true,
          id: playlist?.id ?? "",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        })
      );
  };

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
          time={playlist?.created_at ?? ""}
          category="Playlist"
          like={playlist?.count_like ?? 0}
          song={totalCount ?? 0}
          userId={playlist?.user_id}
          isPublic={playlist?.public ?? 1}
          desc={playlist?.desc ?? ""}
          fnOpenEdit={() => setOpenModal(true)}
          genreId={playlist?.genre_id ?? ""}
        />
      </div>
      <div className="playlistPage__content">
        <div className="playlistPage__content__header">
          <div className="playlistPage__content__header__left">
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
            <button
              ref={btnMenuRef}
              className={`btn__menu ${menuPlaylist.open ? "active" : ""}`}
              onClick={handleClickMenu}
            >
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
        </div>

        <TableTrack
          songs={songs || []}
          isLoading={true}
          userId={playlist?.user_id}
          playlistId={playlist?.id}
        />
      </div>
      <Modal
        title={t("EditPlaylist.EditPlaylist")}
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <ModalEditPlaylist
          openEdit={openModal}
          playlist={playlist ?? {}}
          closeModal={() => setOpenModal(false)}
        />
      </Modal>
    </div>
  );
}
