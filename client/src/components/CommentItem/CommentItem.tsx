import React, { useState } from "react";
import "./commentItem.scss";

import CommentInput from "../CommentInput/CommentInput";
import Images from "../../constants/images";
import ImageWithFallback from "../ImageWithFallback";

interface CommentItemProps {
  name: string;
  content?: string;
  avatarUrl: string;
  level?: number;
  time: string;
}

export default function CommentItem({
  name,
  content,
  avatarUrl,
  level = 0,
  time,
}: CommentItemProps) {
  const [openInput, setOpenInput] = useState(false);

  const marginLeft = level * 40;

  return (
    <>
      <div className="comment__item" style={{ marginLeft: marginLeft }}>
        <div className="comment__item__avatar">
          <ImageWithFallback
            src={avatarUrl}
            fallbackSrc={Images.AVATAR}
            alt=""
          />
        </div>

        <div className="comment__item__content">
          <div className="comment__item__content__top">
            <div className="comment__item__content__top__info">
              <div className="comment__item__content__top__info__top">
                <a>{name}</a>
                <span>{time}</span>
              </div>
              <span>{content}</span>
            </div>
            <div className="comment__item__content__top__like">
              <button>
                <i className="fa-regular fa-heart"></i>
              </button>
            </div>
          </div>
          <div className="comment__item__content__bottom">
            <span className="comment__item__content__bottom__likes">
              12 likes
            </span>
            <button
              className="comment__item__content__bottom__reply"
              onClick={() => setOpenInput(!openInput)}
            >
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {openInput && (
        <CommentInput avatarUrl={Images.AVATAR} level={level + 1} />
      )}
    </>
  );
}
