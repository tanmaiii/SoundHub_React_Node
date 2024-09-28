import React, { useEffect, useState } from "react";
import "./style.scss";

import CommentInput from "../CommentInput/CommentInput";
import Images from "../../constants/images";
import ImageWithFallback from "../ImageWithFallback";
import moment from "moment";
import { use } from "i18next";

interface CommentItemProps {
  name: string;
  content?: string;
  avatarUrl: string;
  level?: number;
  time: string;
  replies?: number;
}

export default function CommentItem({
  name,
  content,
  avatarUrl,
  level = 0,
  time,
  replies = 0,
}: CommentItemProps) {
  const [openInput, setOpenInput] = useState(false);

  const marginLeft = level * 40;

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
              <button>
                <i className="fa-regular fa-heart"></i>
              </button>
            </div>
          </div>
          <div className="commentItem__main__content__bottom">
            <span className="commentItem__main__content__bottom__time">
              {moment(time).fromNow(true)}
            </span>
            <span className="commentItem__main__content__bottom__likes">
              12 likes
            </span>
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
