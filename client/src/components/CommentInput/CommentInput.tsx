import React from "react";
import "./commentInput.scss";

interface CommentInputProps {
  avatarUrl: string;
  level?: number;
}

export default function CommentInput({ avatarUrl, level = 0 }: CommentInputProps) {
  const marginLeft = level * 40;
  return (
    <div className="comment__form" style={{ marginLeft: `${marginLeft}px` }}>
      <div className="comment__form__avatar">
        <img src={avatarUrl} alt="" />
      </div>
      <div className="comment__form__input">
        <input type="text" placeholder="Write a comment..." />
        <button className="btn__clear">
          <i className="fa-light fa-xmark"></i>
        </button>
      </div>
      <button className="comment__form__btn__submit">
        <i className="fa-solid fa-paper-plane-top"></i>
      </button>
    </div>
  );
}
