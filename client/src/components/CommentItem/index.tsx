import React, { useEffect, useState } from "react";
import "./style.scss";

import CommentInput from "../CommentInput";
import Images from "../../constants/images";
import ImageWithFallback from "../ImageWithFallback";
import moment from "moment";
import { use } from "i18next";
import numeral from "numeral";
import { commentApi } from "../../apis";
import { useMutation, useQuery } from "react-query";
import { useAuth } from "../../context/AuthContext";

interface CommentItemProps {
  id: string;
  name: string;
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
  content,
  avatarUrl,
  level = 0,
  time,
  replies = 0,
  count_like = 0,
}: CommentItemProps) {
  const [openInput, setOpenInput] = useState(false);
  const [like, setLike] = useState<boolean>(false);
  const { token } = useAuth();

  const marginLeft = level * 40;
  const [likeCount, setLikeCount] = useState(count_like);

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

  return (
    <div className="commentItem">
      <div className="commentItem__main" style={{ marginLeft: marginLeft }}>
        <div className="commentItem__main__avatar">
          <ImageWithFallback
            src={avatarUrl}
            alt=""
            fallbackSrc={Images.AVATAR}
          />
        </div>

        <div className="commentItem__main__content">
          <div className="commentItem__main__content__top">
            <div className="commentItem__main__content__top__info">
              <div className="commentItem__main__content__top__info__top">
                <a>{name}</a>
              </div>
              <span>{content}</span>
            </div>
            <div className="commentItem__main__content__top__like">
              <button
                onClick={() => mutionLike.mutate(like)}
                className={like ? "like" : ""}
              >
                {like ? (
                  <i className="fa-solid fa-heart"></i>
                ) : (
                  <i className="fa-regular fa-heart"></i>
                )}
              </button>
            </div>
          </div>
          <div className="commentItem__main__content__bottom">
            <span className="commentItem__main__content__bottom__time">
              {moment(time).fromNow(true)}
            </span>
            {likeCount > 0 && (
              <span className="commentItem__main__content__bottom__likes">
                {numeral(likeCount).format("0a").toUpperCase()} likes
              </span>
            )}
            <button
              className="commentItem__main__content__bottom__reply"
              onClick={() => setOpenInput(!openInput)}
            >
              <span>Reply</span>
            </button>
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
      {openInput && (
        <CommentInput avatarUrl={Images.AVATAR} level={level + 1} />
      )}
    </div>
  );
}
