import React, {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import "./style.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { closeMenu } from "../../../slices/menuPlaylistSlide";
import { useDispatch } from "react-redux";
import { useAudio } from "../../../context/AudioContext";
import { playlistApi, songApi } from "../../../apis";
import { useAuth } from "../../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TPlaylist } from "../../../types";
import Modal from "../../Modal";
import { EditPlaylist } from "../../ModalPlaylist";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PlaylistMenu = () => {
  const { t } = useTranslation("playlist");
  const dispatch = useDispatch();
  const PlaylistMenuRef = useRef<HTMLDivElement>(null);
  const {
    id,
    open,
    left,
    top,
    width: widthBtn,
    height: heightBtn,
  } = useSelector((state: RootState) => state.menuPlaylist);
  const { updateQueue, addQueue, addPlaylistQueue } = useAudio();
  const { token, currentUser } = useAuth();
  const [playlist, setPlaylist] = useState<TPlaylist | null>(null);
  const queryClient = useQueryClient();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const { id: paramSongId } = useParams();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleMousedown = (e: MouseEvent) => {
      if (
        PlaylistMenuRef.current &&
        !PlaylistMenuRef.current.contains(e.target as Node)
      ) {
        dispatch(closeMenu());
      }
    };
    document.addEventListener("mousedown", handleMousedown);
    return () => document.removeEventListener("mousedown", handleMousedown);
  });

  useEffect(() => {
    const get = async () => {
      try {
        const res = id && (await playlistApi.getDetail(id, token));
        res && setPlaylist(res);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, [id, token]);

  useEffect(() => {
    if (PlaylistMenuRef.current && left) {
      if (
        left + PlaylistMenuRef.current.clientWidth >
        window.innerWidth - 200
      ) {
        if (
          top + PlaylistMenuRef.current.clientHeight <
          window.innerHeight - 200
        ) {
          // setPlacement("bottom-end");
          PlaylistMenuRef.current.style.top = `${top + (heightBtn ?? 200)}px`;
          PlaylistMenuRef.current.style.left = `${
            left - PlaylistMenuRef.current.clientWidth + (widthBtn ?? 200)
          }px`;
        } else {
          // setPlacement("top-end");
          PlaylistMenuRef.current.style.left = `${
            left - PlaylistMenuRef.current.clientWidth + (widthBtn ?? 200)
          }px`;
          PlaylistMenuRef.current.style.bottom = `${
            window.innerHeight - top
          }px`;
        }
      } else {
        if (
          top + PlaylistMenuRef.current.clientHeight >
          window.innerHeight - 200
        ) {
          // setPlacement("top-start");
          PlaylistMenuRef.current.style.top = `${
            top - PlaylistMenuRef.current.clientHeight
          }px`;
          PlaylistMenuRef.current.style.left = `${left}px`;
        } else {
          // setPlacement("bottom-start");
          PlaylistMenuRef.current.style.top = `${top + (heightBtn ?? 200)}px`;
          PlaylistMenuRef.current.style.left = `${left}px`;
        }
      }
    }
  }, [PlaylistMenuRef, left, top, heightBtn, widthBtn]);


  const handleAddToQueue = async () => {
    try {
      const res = await songApi.getAllByPlaylistId(token, id || "", 1, 0);

      res.data &&
        addPlaylistQueue(
          res.data
            .filter((song) => song?.id)
            .map((song) => song!.id!)
            .filter(Boolean)
        );
    } catch (error) {
      console.log(error);
    }
    dispatch(closeMenu());
  };

  // Kiểm tra đã like chưa
  const { data: isLike } = useQuery({
    queryKey: ["like-playlist", id],
    queryFn: async () => {
      const res = id && (await playlistApi.checkLikedPlaylist(id, token));
      return res && res.isLiked;
    },
  });

  //Xử lí like
  const mutationLike = useMutation({
    mutationFn: (like: boolean) => {
      if (like) return playlistApi.unLikePlaylist(id ?? "", token);
      return playlistApi.likePlaylist(id ?? "", token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["like-playlist", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["playlists-favorites"],
      });
    },
  });

  const mutationDelete = useMutation({
    mutationFn: () => {
      return playlistApi.deletePlaylist(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists", currentUser?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["playlists-favorites"],
      });
      dispatch(closeMenu());
      if (paramSongId === id) {
        window.history.back();
      }
    },
  });

  return (
    <div
      ref={PlaylistMenuRef}
      className={`PlaylistMenu ${open ? "active" : ""}`}
    >
      <div className={`PlaylistMenu__context`}>
        <Helmet>
          <title>{`${playlist?.title ?? "Untitled"} | Sound hub`}</title>
        </Helmet>
        <ul className="PlaylistMenu__context__list">
          <ItemMenu
            title={t("Menu.AddToWaitingList")}
            icon={<i className="fa-light fa-rectangle-history-circle-plus"></i>}
            itemFunc={() => handleAddToQueue()}
          />
          {currentUser?.id !== playlist?.user_id && (
            <ItemMenu
              title={isLike ? t("Menu.UnLike") : t("Menu.Like")}
              icon={
                isLike ? (
                  <i className="fa-solid fa-heart"></i>
                ) : (
                  <i className="fa-light fa-heart"></i>
                )
              }
              itemFunc={() => mutationLike.mutate(!!isLike)}
            />
          )}
          <ItemMenu
            title={t("Menu.EditPlaylist")}
            icon={<i className="fa-regular fa-pen"></i>}
            itemFunc={() => setOpenModalEdit(true)}
          />
          {currentUser?.id === playlist?.user_id && (
            <ItemMenu
              title={t("Menu.Delete")}
              icon={<i className="fa-regular fa-trash"></i>}
              itemFunc={() => setOpenModalDelete(true)}
            />
          )}
          <hr />
          <ItemMenu
            title={t("Menu.Share")}
            icon={<i className="fa-light fa-arrow-up-from-bracket"></i>}
            itemFunc={() => console.log("Add to favorites list")}
          />
        </ul>
      </div>
      {openModalEdit && playlist && (
        <Modal
          title={t("EditPlaylist.Title")}
          openModal={openModalEdit}
          setOpenModal={setOpenModalEdit}
        >
          <EditPlaylist
            playlist={playlist}
            openEdit={openModalEdit}
            closeModal={() => setOpenModalEdit(false)}
          />
        </Modal>
      )}
      {openModalDelete && (
        <Modal
          title={t("Menu.RemoveFromLibrary")}
          openModal={openModalDelete}
          setOpenModal={setOpenModalDelete}
        >
          <div className="PlaylistMenu__modal__delete">
            <div className="PlaylistMenu__modal__delete__header">
              <h3>{t("Menu.AreYouSureDelete")}</h3>
            </div>
            <div className="PlaylistMenu__modal__delete__body">
              <button onClick={() => setOpenModalDelete(false)}>
                {t("Menu.Cancel")}
              </button>
              <button onClick={() => mutationDelete.mutate()}>
                {t("Menu.Delete")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PlaylistMenu;

type PropsItemMenu = {
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  title: string;
  itemFunc: () => void;
  children?: React.ReactNode;
  placement?: "top-start" | "bottom-start" | "top-end" | "bottom-end";
};

const ItemMenu = ({ children, placement, ...props }: PropsItemMenu) => {
  const SongMenuItemRef = useRef<HTMLLIElement>(null);
  const ButtonRef = useRef<HTMLButtonElement>(null);
  const UlRef = useRef<HTMLUListElement>(null);
  const [openSubMenu, setOpenSubMenu] = useState<boolean>(false);

  useEffect(() => {
    if (SongMenuItemRef.current && ButtonRef.current && UlRef.current) {
      SongMenuItemRef.current.addEventListener("mouseenter", () => {
        setOpenSubMenu(true);
      });
      ButtonRef.current.addEventListener("mouseleave", () => {
        setOpenSubMenu(false);
      });
      UlRef.current.addEventListener("mouseleave", () => {
        setOpenSubMenu(true);
      });
    }
  }, []);

  return (
    <li ref={SongMenuItemRef} className={`PlaylistMenu__context__list__item`}>
      <button
        ref={ButtonRef}
        className={` ${openSubMenu ? "active" : ""}`}
        onClick={props.itemFunc}
      >
        {props?.icon}
        <span>{props.title}</span>
        {children && <i className="icon-subMenu fa-solid fa-chevron-right"></i>}
      </button>

      <ul
        ref={UlRef}
        className={`PlaylistMenu__context__list__item__submenu ${
          openSubMenu ? "active" : ""
        } `}
      >
        {children}
      </ul>
    </li>
  );
};
