import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import TableTrack from "../../components/TableTrack";
import Images from "../../constants/images";
import "./playlistPage.scss";
import { useEffect, useState } from "react";
import { TPlaylist } from "../../types";
import { playlistApi, songApi, userApi } from "../../apis";
import { useAuth } from "../../context/authContext";
import { useQuery } from "react-query";
import { apiConfig } from "../../configs";

export default function PlaylistPage() {
  const { pathname } = useLocation();
  const navigation = useNavigate();
  // const [playlist, setPlaylists] = useState<TPlaylist>();
  const { id } = useParams();
  const { token } = useAuth();
  const [totalCount, setTotalCount] = useState(0);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="playlistPage">
      <HeaderPage
        fbAvt={Images.PLAYLIST}
        avt={apiConfig.imageURL(playlist?.image_path ?? "")}
        title={playlist?.title ?? ""}
        author={author?.name ?? ""}
        avtAuthor={apiConfig.imageURL(author?.image_path || "") ?? ""}
        time={playlist?.created_at ?? ""}
        // listen="18,714,210"
        category="Playlist"
        like="23,123"
        song={`${totalCount.toString()} songs`}
      />
      <div className="playlistPage__content">
        <TableTrack
          songs={songs || []}
          isLoading={true}
          userId={playlist?.user_id}
        />
      </div>
    </div>
  );
}
