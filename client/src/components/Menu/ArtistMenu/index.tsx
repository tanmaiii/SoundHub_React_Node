import React, {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { TAuthor, TSong } from "../../../types";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { authorApi, songApi } from "../../../apis";
import { PATH } from "../../../constants/paths";

type Props = {
  id: string;
  songId?: string;
  active: boolean;
  placement?: "top-start" | "bottom-start" | "top-end" | "bottom-end";
  onOpen: () => void;
  onClose: () => void;
};

const ArtistMenu = ({
  id,
  songId,
  active,
  onOpen,
  onClose,
  placement = "bottom-end",
}: Props) => {
  const { t } = useTranslation("song");
  const MenuRef = useRef<HTMLDivElement>(null);
  const { currentUser, token } = useAuth();
  const queryClient = useQueryClient();
  const navigation = useNavigate();
  const [song, setSong] = useState<TSong | null>(null);
  const [author, setAuthor] = useState<TAuthor | null>(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleMousedown = (e: MouseEvent) => {
      if (MenuRef.current && !MenuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleMousedown);
    return () => document.removeEventListener("mousedown", handleMousedown);
  });

  useEffect(() => {
    const getSong = async () => {
      try {
        if (songId) {
          const res = await songApi.getDetail(songId, token);
          setSong(res);
        }
      } catch (error) {}
    };
    getSong();
  }, [songId, id, token]);

  const handleSuccess = () => {
    onClose();
    
    queryClient.invalidateQueries(["notify-detail", [songId, currentUser?.id]]);

    queryClient.invalidateQueries({
      queryKey: ["author-song", { id, songId }],
    });
    queryClient.invalidateQueries({
      queryKey: ["authors", songId],
    });
    queryClient.invalidateQueries({
      queryKey: ["authors-pending", songId],
    });
  };

  const {} = useQuery({
    queryKey: ["author", [id, songId]],
    queryFn: async () => {
      try {
        const res =
          id && songId && (await authorApi.getDetail(token, id, songId || ""));
        res && setAuthor(res);
        return res;
      } catch (error) {
        console.log(error);
      }
    },
  });

  // Xóa người dùng khỏi danh sách tác giả của bài hát bởi chính người dùng đó
  const mutationRemoveAuthor = useMutation(
    () => authorApi.rejectRequest(token, songId || ""),
    {
      onSuccess: () => {
        return handleSuccess();
      },
    }
  );

  // Xóa người dùng khỏi danh sách tác giả của bài hát bởi tác giả của bài hát
  const mutationRemoveAuthorByPoster = useMutation(
    async () => {
      try {
        return await authorApi.deleteAuthor(token, songId || "", id || "");
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        return handleSuccess();
      },
    }
  );

  return (
    <div ref={MenuRef} className={`ArtistMenu`}>
      <button
        className="ArtistMenu__button"
        onClick={() => {
          active ? onClose() : onOpen();
        }}
      >
        <i className="fa-solid fa-ellipsis"></i>
      </button>
      <div
        className={`ArtistMenu__context ${active ? "active" : ""}`}
        data-placement={placement}
      >
        <div className="ArtistMenu__context__list">
          {author &&
            author?.status === "Accepted" &&
            songId &&
            currentUser?.id === id && (
              <ItemMenu
                title={"Rời khỏi danh sách tác giả"}
                icon={<i className="fa-light fa-xmark"></i>}
                itemFunc={() => mutationRemoveAuthor.mutate()}
              />
            )}

          {author &&
            author?.status === "Accepted" &&
            song?.user_id === currentUser?.id && (
              <ItemMenu
                title={"Xóa tác giả khỏi bài hát"}
                icon={<i className="fa-light fa-xmark"></i>}
                itemFunc={() => mutationRemoveAuthorByPoster.mutate()}
              />
            )}

          {author &&
            author?.status === "Pending" &&
            song?.user_id === currentUser?.id && (
              <ItemMenu
                title={"Huỷ yêu cầu tham gia tác giả"}
                icon={<i className="fa-light fa-xmark"></i>}
                itemFunc={() => mutationRemoveAuthorByPoster.mutate()}
              />
            )}

          <ItemMenu
            title={"Xem thông tin"}
            icon={<i className="fa-light fa-user"></i>}
            itemFunc={() => navigation(`${PATH.ARTIST}/${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistMenu;

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
