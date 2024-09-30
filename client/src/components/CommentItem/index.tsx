import React, { useEffect, useRef, useState } from "react";
import "./style.scss";

import CommentInput from "../CommentInput";
import Images from "../../constants/images";
import ImageWithFallback from "../ImageWithFallback";
import moment from "moment";
import { use } from "i18next";
import numeral from "numeral";
import { commentApi } from "../../apis";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/paths";
import { current } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface CommentItemProps {
  id: string;
  name: string;
  userId: string;
  songId: string;
  content?: string;
  avatarUrl: string;
  level?: number;
  time: string;
  replies?: number;
  count_like: number;
}

export default function CommentItem({
  id,
  name,
  userId,
  songId,
  content,
  avatarUrl,
  level = 0,
  time,
  replies = 0,
  count_like = 0,
}: CommentItemProps) {
  const [openInput, setOpenInput] = useState(false);
  const [like, setLike] = useState<boolean>(false);
  const { token, currentUser } = useAuth();
  const [likeCount, setLikeCount] = useState(count_like);
  const [openEdit, setOpenEdit] = useState(false);
  const btnMoreRef = useRef<HTMLDivElement>(null);
  const marginLeft = level * 40;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (btnMoreRef.current) {
      const handleClick = (e: MouseEvent) => {
        if (!btnMoreRef.current?.contains(e.target as Node)) {
          setOpenEdit(false);
        }
      };
      document.addEventListener("click", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
      };
    }
  });

  const { data } = useQuery({
    queryKey: ["like-commnet", id],
    queryFn: async () => {
      const res = await commentApi.checkLiked(id, token);
      res.isLiked && setLike(true);
    },
  });

  const mutionLike = useMutation({
    mutationFn: async (like: boolean) => {
      if (!like) {
        await commentApi.like(id, token);
        setLike(true);
        setLikeCount(likeCount + 1);
      } else {
        await commentApi.unLike(id, token);
        setLike(false);
        setLikeCount(likeCount - 1);
      }
    },
    onSuccess: () => {},
  });

  const mutionDelete = useMutation({
    mutationFn: async () => {
      await commentApi.deleteComment(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", songId]);
      toast.success("Xóa bình luận thành công");
      setOpenEdit(false);
    },
  });

  const handleOpenMenu = () => {
    setOpenEdit(!openEdit);
  };

  return (
    <div className="commentItem">
      <div className="commentItem__main" style={{ marginLeft: marginLeft }}>
        <div className="commentItem__main__avatar">
          <Link to={PATH.ARTIST + "/" + userId}>
            <ImageWithFallback
              src={avatarUrl}
              alt=""
              fallbackSrc={Images.AVATAR}
            />
          </Link>
        </div>

        <div className="commentItem__main__content">
          <div className="commentItem__main__content__top">
            <div className="commentItem__main__content__top__info">
              <div className="commentItem__main__content__top__info__top">
                <Link to={PATH.ARTIST + "/" + userId}>{name}</Link>
              </div>
              <span>{content}</span>
            </div>
            <div className="commentItem__main__content__top__more">
              <div className="btn-more" ref={btnMoreRef}>
                <button
                  className={openEdit ? "active" : ""}
                  onClick={() => setOpenEdit(!openEdit)}
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>
                {openEdit && (
                  <div className="btn-more__list">
                    <ul>
                      {currentUser?.id === userId && (
                        <li onClick={() => mutionDelete.mutate()}>
                          <i className="fa-light fa-trash-can"></i>
                          <span>Xóa</span>
                        </li>
                      )}
                      {currentUser?.id === userId && (
                        <li onClick={() => mutionDelete.mutate()}>
                          <i className="fa-light fa-pen-to-square"></i>
                          <span>Chỉnh sửa</span>
                        </li>
                      )}
                      <li>
                        <i className="fa-light fa-flag"></i>
                        <span>Báo cáo bình luận</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="commentItem__main__content__bottom">
            <div className={"commentItem__main__content__bottom__left"}>
              <span className="commentItem__main__content__bottom__left__time">
                {moment(time).fromNow(true)}
              </span>
              <button
                onClick={() => mutionLike.mutate(like)}
                className={`commentItem__main__content__bottom__left__like ${
                  like ? "active" : ""
                }`}
              >
                <span>Like</span>
              </button>
              <button
                className="commentItem__main__content__bottom__left__reply"
                onClick={() => setOpenInput(!openInput)}
              >
                <span>Reply</span>
              </button>
            </div>
            <div className="commentItem__main__content__bottom__right">
              {likeCount > 0 && (
                <button>
                  <span>{likeCount}</span>
                  <i className="fa-solid fa-circle-heart"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="commentItem__reply">
        {replies > 0 && (
          <button className="commentItem__reply__btn">
            <div className="line"></div>
            <span>View {replies} more replies</span>
          </button>
        )}
      </div>
      {/* {openEdit && (
        <div className="btn-more__list">
          <ul>
            {currentUser?.id === userId && (
              <li onClick={() => mutionDelete.mutate()}>
                <i className="fa-light fa-trash-can"></i>
                <span>Xóa</span>
              </li>
            )}
            <li>
              <i className="fa-light fa-flag"></i>
              <span>Báo cáo bình luận</span>
            </li>
          </ul>
        </div>
      )} */}
      {openInput && (
        <CommentInput
          onPost={(value) => {
            console.log(value);
            return {};
          }}
          avatarUrl={currentUser?.image_path ?? ""}
          level={level + 1}
        />
      )}
    </div>
  );
}
