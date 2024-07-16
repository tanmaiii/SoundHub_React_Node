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

  return (
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
          />
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
  );
};

export default SongMenu;

type PropsItemMenu = {
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  title: string;
  itemFunc: () => void;
};

const ItemMenu = (props: PropsItemMenu) => {
  return (
    <li className="SongMenu__context__list__item">
      <button onClick={props.itemFunc}>
        {props?.icon}
        <span>{props.title}</span>
      </button>
    </li>
  );
};
