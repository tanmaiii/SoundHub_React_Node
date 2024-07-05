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

export default function PlaylistPage() {
  const navigation = useNavigate();
  const { id } = useParams();
  const { token, currentUser } = useAuth();
  const [totalCount, setTotalCount] = useState(0);
  const queryClient = useQueryClient();
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);

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
      const res = await songApi.getAllByPlaylistId(token, id || "", 1, 50);
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
      <div className="playlistPage__header">
        <HeaderPage
          fbAvt={Images.PLAYLIST}
          avt={playlist?.image_path ?? ""}
          title={playlist?.title ?? ""}
          author={author?.name ?? ""}
          avtAuthor={author?.image_path ?? ""}
          time={playlist?.created_at ?? ""}
          // listen="18,714,210"
          category="Playlist"
          like="23,123"
          song={`${totalCount.toString()} songs`}
          userId={playlist?.user_id}
          // loading={true}
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
            {playlist?.id && currentUser?.id !== playlist?.id && (
              <button
                className={isLike ? "active" : ""}
                onClick={() => mutationLike.mutate(isLike ?? false)}
              >
                {isLike ? (
                  <i className="fa-solid fa-heart"></i>
                ) : (
                  <i className="fa-light fa-heart"></i>
                )}
              </button>
            )}
            <button>
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <div className="playlistPage__content__header__right">
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
          </div>
        </div>

        <TableTrack
          songs={songs || []}
          isLoading={true}
          userId={playlist?.user_id}
        />
      </div>
    </div>
  );
}
