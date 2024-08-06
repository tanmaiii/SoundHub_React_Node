import React, {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { TSong } from "../../../types";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/authContext";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { authorApi } from "../../../apis";

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

  // Xóa bài hát khỏi danh sách tác giả của bài hát
  const mutationRemoveAuthor = useMutation(
    () => authorApi.rejectRequest(token, songId || ""),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "notify-detail",
          [songId, currentUser?.id],
        ]);
        onClose();
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
          {songId && currentUser?.id === id && (
            <ItemMenu
              title={"Rời khỏi danh sách tác giả"}
              icon={<i className="fa-light fa-xmark"></i>}
              itemFunc={() => mutationRemoveAuthor.mutate()}
            />
          )}
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
