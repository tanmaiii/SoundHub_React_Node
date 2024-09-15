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
import playApi from "../../../apis/play/playApi";
import { use } from "i18next";
import { TPlaylist } from "../../../types";
import Modal from "../../Modal";
import { EditPlaylist } from "../../ModalPlaylist";
import { useParams } from "react-router-dom";

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
      console.log(e.target);

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
        window.innerWidth - 100
      ) {
        if (
          top + PlaylistMenuRef.current.clientHeight <
          window.innerHeight - 100
        ) {
          // setPlacement("bottom-end");
          PlaylistMenuRef.current.style.top = `${top + (heightBtn ?? 100)}px`;
          PlaylistMenuRef.current.style.left = `${
            left - PlaylistMenuRef.current.clientWidth + (widthBtn ?? 100)
          }px`;
        } else {
          // setPlacement("top-end");
          PlaylistMenuRef.current.style.left = `${
            left - PlaylistMenuRef.current.clientWidth + (widthBtn ?? 100)
          }px`;
          PlaylistMenuRef.current.style.bottom = `${
            window.innerHeight - top
          }px`;
        }
      } else {
        if (
          top + PlaylistMenuRef.current.clientHeight >
          window.innerHeight - 100
        ) {
          // setPlacement("top-start");
          PlaylistMenuRef.current.style.top = `${
            top - PlaylistMenuRef.current.clientHeight
          }px`;
          PlaylistMenuRef.current.style.left = `${left}px`;
        } else {
          // setPlacement("bottom-start");
          PlaylistMenuRef.current.style.top = `${top + (heightBtn ?? 100)}px`;
          PlaylistMenuRef.current.style.left = `${left}px`;
        }
      }
    }
  }, [PlaylistMenuRef, left, top, heightBtn, widthBtn]);

  useEffect(() => {
    const handleResize = () => {
      dispatch(closeMenu());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        <ul className="PlaylistMenu__context__list">
          <ItemMenu
            title={"Thêm vào danh sách chờ"}
            icon={<i className="fa-light fa-rectangle-history-circle-plus"></i>}
            itemFunc={() => handleAddToQueue()}
          />
          {currentUser?.id !== playlist?.user_id && (
            <ItemMenu
              title={isLike ? "Bỏ thích" : "Thêm vào danh sách yêu thích"}
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
            title={"Chỉnh sửa"}
            icon={<i className="fa-regular fa-pen"></i>}
            itemFunc={() => setOpenModalEdit(true)}
          />
          {currentUser?.id === playlist?.user_id && (
            <ItemMenu
              title={"Xóa"}
              icon={<i className="fa-regular fa-trash"></i>}
              itemFunc={() => setOpenModalDelete(true)}
            />
          )}
          <hr />
          <ItemMenu
            title={"Chia sẻ"}
            icon={<i className="fa-light fa-arrow-up-from-bracket"></i>}
            itemFunc={() => console.log("Add to favorites list")}
          />
        </ul>
      </div>
      {openModalEdit && playlist && (
        <Modal
          title="Edit song"
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
          title="Xóa khỏi thư viện ?"
          openModal={openModalDelete}
          setOpenModal={setOpenModalDelete}
        >
          <div className="PlaylistMenu__modal__delete">
            <div className="PlaylistMenu__modal__delete__header">
              <h3>Bạn có chắc chắn sẽ xóa {playlist?.title} khỏi Thư viện.</h3>
            </div>
            <div className="PlaylistMenu__modal__delete__body">
              <button onClick={() => setOpenModalDelete(false)}>Hủy</button>
              <button onClick={() => mutationDelete.mutate()}>Xóa</button>
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
