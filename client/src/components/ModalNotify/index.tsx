import React from "react";
import "./style.scss";

const ModalNotify = () => {
  return (
    <div className="Notify">
      <div className="Notify__header"></div>
      <div className="Notify__body">
        <div className="Notify__body__list">
          <Item id="1234567" />
          <Item id="1234567" />
          <Item id="1234567" />
          <Item id="1234567" />
        </div>
      </div>
    </div>
  );
};

export default ModalNotify;

type props = {
  id: string;
};

const Item = (props: props) => {
  return (
    <div className="notify__item">
      <div className="notify__item__image">
        <img
          src="http://localhost:8000/image/be1bc3e8-964d-41f1-9d8f-72dd296ee111.png"
          alt=""
        />
      </div>
      <div className="notify__item__body">
        <div className="notify__item__body__desc">
          <a>Tấn Mãi </a>
          <span>đã gửi yêu cầu tham gia bài hát</span>
          <a> Em của ngày hôm qua</a>
          <p>1 giờ trước</p>
        </div>
        <div className="notify__item__body__button">
          <button className="btn-submit">Xác nhận</button>
          <button className="btn-remove">Xóa</button>
        </div>
      </div>
      <div className="notify__item__send">
        <div className="dot"></div>
      </div>
    </div>
  );
};
