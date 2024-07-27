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
import { AddSongToPlaylist } from "../../ModalSong";
import { use } from "i18next";
import { TStateParams } from "../../../types";

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

  const [openModalAddSongToPlaylist, setOpenModalAddSongToPlaylist] =
    useState<boolean>(false);

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
              <div className="SongMenu__submenu" data-placement={placement}>
                <div className="SongMenu__submenu__search">
                  <i className="fa-light fa-magnifying-glass"></i>
                  <input type="text" placeholder="Tìm playlist..." />
                  <button>
                    <i className="fa-light fa-xmark"></i>
                  </button>
                </div>
                <button className="SongMenu__submenu__item">
                  <i className="fa-light fa-plus"></i>
                  <span>Thêm playlist</span>
                </button>
                <hr />
                {playlists?.map((playlist, index) => {
                  return (
                    <button className="SongMenu__submenu__item">
                      <i className="fa-solid fa-compact-disc"></i>
                      <span>{playlist?.title}</span>
                    </button>
                  );
                })}
              </div>
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
      <Modal
        title="Add song to playlist"
        openModal={openModalAddSongToPlaylist}
        setOpenModal={() => setOpenModalAddSongToPlaylist(false)}
      >
        <AddSongToPlaylist />
      </Modal>
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
