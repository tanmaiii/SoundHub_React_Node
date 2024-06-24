import React, { useState } from "react";
import "./commentItem.scss";

import CommentInput from "../CommentInput/CommentInput";
import Images from "../../constants/images";

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
          <img src={avatarUrl} alt="" />
        </div>

        <div className="comment__item__content">
          <div className="comment__item__content__top">
            <div className="comment__item__content__top__info">
              <a>{name}</a>
              <span>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam ipsam ipsa neque
                voluptates accusamus facilis, doloribus temporibus minus, inventore, veniam natus
                explicabo architecto eaque tenetur tempora adipisci quos dolorum soluta!
              </span>
            </div>
            <div className="comment__item__content__top__like">
              <button>
                <i className="fa-light fa-heart"></i>
              </button>
              <span>3</span>
            </div>
          </div>
          <div className="comment__item__content__bottom">
            <span className="comment__item__content__bottom__time">{time}</span>
            <button
              className="comment__item__content__bottom__reply"
              onClick={() => setOpenInput(!openInput)}
            >
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {openInput && <CommentInput avatarUrl={Images.AVATAR} level={level + 1} />}
    </>
  );
}
