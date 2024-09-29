import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import ImageWithFallback from "../ImageWithFallback/index";
import Images from "../../constants/images";
import { useAuth } from "../../context/AuthContext";

interface CommentInputProps {
  avatarUrl: string;
  level?: number;
}

export default function CommentInput({
  avatarUrl,
  level = 0,
}: CommentInputProps) {
  const marginLeft = level * 40;
  const [value, setValue] = useState<string>("");
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  let inputInitHeight = 40; // Define the inputInitHeight variable
  const { currentUser } = useAuth();

  useEffect(() => {
    if (chatInputRef.current) {
      inputInitHeight = chatInputRef.current.scrollHeight;
      console.log(chatInputRef.current.scrollHeight);
    }
  }, []);

  const handleInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.style.height = `${inputInitHeight}px`;
      chatInputRef.current.style.height = `${chatInputRef.current.scrollHeight}px`;
      console.log("input");
    }
  };

  return (
    <div className="comment__form" style={{ marginLeft: `${marginLeft}px` }}>
      <div className="comment__form__avatar">
        <ImageWithFallback src={avatarUrl} fallbackSrc={Images.AVATAR} alt="" />
      </div>
      <div className="comment__form__swapper">
        <div className="comment__form__swapper__input">
          <textarea
            ref={chatInputRef}
            value={value}
            onInput={handleInput}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Add a public comment..."
          />
        </div>
        <div className="comment__form__swapper__right">
          <button className="btn-submit">
            <i className="fa-solid fa-paper-plane-top"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
