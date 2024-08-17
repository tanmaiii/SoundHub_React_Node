import React, { useRef, useState } from "react";

type props = {
  onSubmit: (value: string) => void;
  focus?: boolean;
  textInputRef?: React.RefObject<HTMLInputElement>;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const CustomInput = (props: props) => {
  const { onSubmit, focus = false, textInputRef, placeholder } = props;
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [keyword, setKeyword] = useState("");

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (!onSubmit) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onSubmit(value);
    }, 300);
  };

  const onClickClear = () => {
    setKeyword("");
    onSubmit("");
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        style={{ width: "100%", paddingRight: "20px" }}
        value={keyword}
        type="text"
        placeholder={placeholder && placeholder}
        onChange={onChangeInput}
        onKeyDown={props.onKeyDown}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
      {keyword && (
        <button
          style={{
            position: "absolute",
            top: "50%",
            right: "0",
            transform: "translateY(-50%)",
          }}
          className="btn-clear"
          onClick={onClickClear}
        >
          <i className="fa-light fa-xmark"></i>
        </button>
      )}
    </div>
  );
};

export default CustomInput;
