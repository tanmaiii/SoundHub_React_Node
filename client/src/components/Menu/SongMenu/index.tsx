import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
  JSXElementConstructor,
} from "react";
import "./style.scss";
import { useTranslation } from "react-i18next";
import playlistApi from "../../../apis/playlist/playlistApi";
import { useAuth } from "../../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { songApi } from "../../../apis";
import Modal from "../../Modal";
import { TPlaylist, TStateParams } from "../../../types";
import { useToast } from "../../../context/ToastContext";

type Props = {
  id: string;
  playlistId?: string;
  active: boolean;
  placement?: "top-start" | "bottom-start" | "top-end" | "bottom-end";
  onOpen: () => void;
  onClose: () => void;
};

const SongMenu = ({
  id,
  playlistId,
  active,
  onOpen,
  onClose,
  placement = "bottom-end",
}: Props) => {
  const { t } = useTranslation("song");
  const SongMenuRef = useRef<HTMLDivElement>(null);
  const { currentUser, token } = useAuth();
  const queryClient = useQueryClient();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleMousedown = (e: MouseEvent) => {
      if (
        SongMenuRef.current &&
        !SongMenuRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleMousedown);
    return () => document.removeEventListener("mousedown", handleMousedown);
  });

  // Xử lí xóa bài hát khỏi playlist
  const mutationRemoveSongFromPlaylist = useMutation({
    mutationFn: async () => {
      try {
        await playlistApi.removeSong(playlistId ?? "", id, token);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlist-songs", playlistId],
      });
    },
  });

  const { data: isLike, refetch: refetchLike } = useQuery({
    queryKey: ["like-song", id],
    queryFn: async () => {
      const res = await songApi.checkLikedSong(id ?? "", token);
      return res.isLiked;
    },
  });

  //Xử lí like bài hát
  const mutationLike = useMutation({
    mutationFn: (like: boolean) => {
      if (like) return songApi.unLikeSong(id ?? "", token);
      return songApi.likeSong(id ?? "", token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["like-song", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["songs-favorites", currentUser?.id],
      });
    },
  });

  useEffect(() => {
    // active
    //   ? (document.body.style.overflow = "hidden")
    //   : (document.body.style.overflow = "auto");
  });

  return (
    <>
      <div ref={SongMenuRef} className={`SongMenu`}>
        <button
          className="SongMenu__button"
          onClick={() => {
            active ? onClose() : onOpen();
          }}
        >
          <i className="fa-solid fa-ellipsis"></i>
        </button>

        <div
          className={`SongMenu__context ${active ? "active" : ""}`}
          data-placement={placement}
        >
          <ul className="SongMenu__context__list">
            <ItemMenu
              title={t("Menu.Add to playlist")}
              icon={<i className="fa-solid fa-plus"></i>}
              itemFunc={() => console.log("Add to playlist")}
            >
              <AddSongToPlaylist songId={id} placement={placement} />
            </ItemMenu>
            {playlistId && (
              <ItemMenu
                title={t("Menu.Remove to playlist")}
                icon={<i className="fa-light fa-trash-can"></i>}
                itemFunc={() => mutationRemoveSongFromPlaylist.mutate()}
              />
            )}
            {!isLike ? (
              <ItemMenu
                title={t("Menu.Add to favorites list")}
                icon={<i className="fa-regular fa-circle-plus"></i>}
                itemFunc={() => mutationLike.mutate(isLike ?? false)}
              />
            ) : (
              <ItemMenu
                title={t("Menu.Remove to favorites list")}
                icon={<i className="fa-light fa-trash-can"></i>}
                itemFunc={() => mutationLike.mutate(isLike)}
              />
            )}
            <ItemMenu
              title={t("Menu.Add to waiting list")}
              icon={<i className="fa-regular fa-list-music"></i>}
              itemFunc={() => console.log("Add to playlist")}
            />
            <hr />
            <ItemMenu
              title={t("Menu.See details")}
              icon={<i className="fa-regular fa-music"></i>}
              itemFunc={() => console.log("Add to playlist")}
            />
            <ItemMenu
              title={t("Menu.Artist Access")}
              icon={<i className="fa-regular fa-user"></i>}
              itemFunc={() => console.log("Add to playlist")}
            />
            <ItemMenu
              title={t("Menu.Share")}
              icon={<i className="fa-solid fa-share"></i>}
              itemFunc={() => console.log("Add to playlist")}
            />
          </ul>
        </div>
      </div>
    </>
  );
};

export default SongMenu;

type PropsItemMenu = {
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  title: string;
  itemFunc: () => void;
  children?: React.ReactNode;
  placement?: "top-start" | "bottom-start" | "top-end" | "bottom-end";
};

const ItemMenu = ({ children, placement, ...props }: PropsItemMenu) => {
  const SongMenuItemRef = useRef<HTMLLIElement>(null);
  const [openSubMenu, setOpenSubMenu] = useState<boolean>(false);

  useEffect(() => {
    if (SongMenuItemRef.current) {
      SongMenuItemRef.current.addEventListener("mouseenter", () => {
        setOpenSubMenu(true);
      });
      SongMenuItemRef.current.addEventListener("mouseleave", () => {
        setOpenSubMenu(false);
      });
    }
  }, []);

  return (
    <li ref={SongMenuItemRef} className="SongMenu__context__list__item">
      <button onClick={props.itemFunc}>
        {props?.icon}
        <span>{props.title}</span>
        {children && <i className="icon-subMenu fa-solid fa-chevron-right"></i>}
      </button>
      {children && openSubMenu && <ul>{children}</ul>}
    </li>
  );
};

type props = {
  songId: string;
  placement: "top-start" | "bottom-start" | "top-end" | "bottom-end";
};

const AddSongToPlaylist = ({ songId, placement }: props) => {
  const { currentUser, token } = useAuth();
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

  const { limit, page, loading, sort, totalPages, keyword, refreshing } = state;

  const updateState = (newState: Partial<TStateParams>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const { data: playlists } = useQuery({
    queryKey: ["playlists", currentUser?.id ?? "", keyword],
    queryFn: async () => {
      try {
        const res = await playlistApi.getMe(
          token ?? "",
          page,
          limit,
          sort,
          keyword
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <ul>
      <div className="SongMenu__submenu" data-placement={placement}>
        <div className="SongMenu__submenu__search">
          <i className="fa-light fa-magnifying-glass"></i>
          <input
            type="text"
            value={keyword}
            placeholder="Tìm playlist..."
            onChange={(e) => updateState({ keyword: e.target.value })}
          />
          {keyword.length > 0 && (
            <button
              className="btn_clear"
              onClick={() => updateState({ keyword: "" })}
            >
              <i className="fa-light fa-xmark"></i>
            </button>
          )}
        </div>
        <button className="SongMenu__submenu__item">
          <i className="fa-light fa-plus"></i>
          <span>Thêm playlist</span>
        </button>
        <hr />
        {playlists?.map((playlist, index) => {
          return <ItemPlaylist playlist={playlist} songId={songId} />;
        })}
      </div>
    </ul>
  );
};

const ItemPlaylist = ({
  playlist,
  songId,
}: {
  playlist: TPlaylist;
  songId: string;
}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { setToastMessage } = useToast();

  const { data: countSongs } = useQuery({
    queryKey: ["count-songs", playlist.id],
    queryFn: async () => {
      const res = await songApi.getAllByPlaylistId(
        token,
        playlist?.id ?? "",
        1,
        0
      );
      return res.pagination.totalCount;
    },
  });

  const { data: isAdd } = useQuery({
    queryKey: ["check-song", songId, playlist.id],
    queryFn: async () => {
      try {
        const res = await playlistApi.checkSongInPlaylist(
          playlist.id ?? "",
          songId,
          token
        );
        return res.isAdd;
      } catch (error: any) {
        console.log(error.response.data);
        return false;
      }
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (isAdd: boolean) => {
      if (isAdd) {
        setToastMessage(`Đã xóa bài hát khỏi danh sách phát ${playlist.title}`);
        return await playlistApi.removeSong(playlist.id ?? "", songId, token);
      }
      if (countSongs && countSongs < 10) {
        setToastMessage("Playlist đã đầy, không thể thêm bài hát");
      }
      setToastMessage(`Đã thêm bài hát vào danh sách phát ${playlist.title} thành công`);
      return await playlistApi.addSong(playlist.id ?? "", songId, token);
      // setOpenModal(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-song", songId, playlist.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["count-songs", playlist.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["songs", playlist.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["playlist-songs", playlist.id],
      });
    },
  });

  return (
    <button
      className="SongMenu__submenu__item"
      onClick={() => mutationAdd.mutate(isAdd ?? false)}
    >
      {isAdd ? (
        <i className="fa-solid fa-compact-disc"></i>
      ) : (
        <i className="fa-solid fa-plus"></i>
      )}
      <span>{playlist?.title}</span>
    </button>
  );
};
