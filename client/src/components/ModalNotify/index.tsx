import React, { useEffect, useState } from "react";
import "./style.scss";
import { authorApi } from "../../apis";
import { useAuth } from "../../context/authContext";
import { TAuthor, TSong } from "../../types";
import songApi from "../../apis/song/songApi";
import ImageWithFallback from "../ImageWithFallback";
import Images from "../../constants/images";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/paths";

const ModalNotify = ({ onClose }: { onClose: () => void }) => {
  const { token } = useAuth();
  const [data, setData] = React.useState<TAuthor[]>([]);

  const handleGetNotify = async () => {
    // get notify
    try {
      const res = await authorApi.getAllUserRequest(token, 1, 10);
      setData(res.data);
      console.log(res);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetNotify();
  }, []);

  return (
    <div className="Notify">
      <div className="Notify__header"></div>
      <div className="Notify__body">
        <div className="Notify__body__list">
          {data.map((item) => (
            <Item id={item.song_id} onClose={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalNotify;

type props = {
  id: string;
  onClose: () => void;
};

const Item = (props: props) => {
  const [song, setSong] = useState<TSong>();
  const { token } = useAuth();
  const navigation = useNavigate();

  useEffect(() => {
    const getSong = async () => {
      try {
        const res = await songApi.getDetail(props.id, token);
        res && setSong(res || undefined);
      } catch (error) {}
    };
    getSong();
  }, []);

  const handleClickSubmit = () => {
    try {
      authorApi.confirmRequest(token, song?.id || "");
    } catch (error) {}
  };

  const handleClickRemove = () => {
    try {
      authorApi.rejectRequest(token, song?.id || "");
    } catch (error) {}
  };

  const handleClick = () => {
    navigation(`${PATH.SONG}/${song?.id}`);
    props.onClose();
  };

  return (
    <div className="notify__item">
      <div className="notify__item__image" onClick={handleClick}>
        <ImageWithFallback
          src={song?.image_path || ""}
          fallbackSrc={Images.SONG}
          alt=""
        />
      </div>
      <div className="notify__item__body">
        <div className="notify__item__body__desc" onClick={handleClick}>
          <a>{song?.author} </a>
          <span>đã gửi yêu cầu tham gia bài hát</span>
          <a> {song?.title}</a>
          <p>1 giờ trước</p>
        </div>
        <div className="notify__item__body__button">
          <button className="btn-submit" onClick={handleClickSubmit}>
            Xác nhận
          </button>
          <button className="btn-remove" onClick={handleClickRemove}>
            Từ chối
          </button>
        </div>
      </div>
      <div className="notify__item__send">
        <div className="dot"></div>
      </div>
    </div>
  );
};
