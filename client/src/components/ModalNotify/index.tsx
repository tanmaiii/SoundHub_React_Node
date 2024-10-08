import React, { useEffect, useState } from "react";
import "./style.scss";
import { authorApi } from "../../apis";
import { useAuth } from "../../context/AuthContext";
import { TAuthor, TSong } from "../../types";
import songApi from "../../apis/song/songApi";
import ImageWithFallback from "../ImageWithFallback";
import Images from "../../constants/images";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/paths";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ModalNotify = ({ onClose }: { onClose: () => void }) => {
  const { token } = useAuth();
  const [data, setData] = React.useState<TAuthor[]>([]);

  const handleGetNotify = async () => {
    // get notify
    try {
      const res = await authorApi.getAllUserRequest(token, 1, 0);
      setData(res.data);
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
          {data.map((item, index) => (
            <Item key={index} id={item.song_id} onClose={onClose} />
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
  const [detail, setDetail] = useState<TAuthor>();
  const { token, currentUser } = useAuth();
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation("header");

  useEffect(() => {
    const getSong = async () => {
      try {
        const res = await songApi.getDetail(props.id, token);
        if (res.public === 0) {
          setSong(undefined);
        } else {
          res && setSong(res || undefined);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSong();
  }, [props.id]);

  const {} = useQuery({
    queryKey: ["notify-detail", [props.id, currentUser?.id]],
    queryFn: async () => {
      try {
        const res = await authorApi.getDetail(
          token,
          currentUser?.id || "",
          props.id
        );
        res && setDetail(res || undefined);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const mutationSubmit = useMutation(
    () => authorApi.confirmRequest(token, song?.id || ""),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "notify-detail",
          [props.id, currentUser?.id],
        ]);
        queryClient.invalidateQueries(["authors", song?.id]);
      },
    }
  );

  const mutationRemove = useMutation(
    () => authorApi.rejectRequest(token, song?.id || ""),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "notify-detail",
          [props.id, currentUser?.id],
        ]);
        queryClient.invalidateQueries(["authors", song?.id]);
      },
    }
  );

  const handleClick = () => {
    navigation(`${PATH.SONG}/${song?.id}`);
    props.onClose();
  };

  if (!song || !detail) return null;

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
          <span>{t("Notification.sentRequestToJoinTheSong")}</span>
          <a> {song?.title}</a>
          <p>{moment(detail?.created_at).fromNow()}</p>
        </div>
        <div className="notify__item__body__button">
          {detail && detail?.status === "Pending" && (
            <>
              <button
                className="btn-submit"
                onClick={() => mutationSubmit.mutate()}
              >
                {t("Notification.Confirm")}
              </button>
              <button
                className="btn-remove"
                onClick={() => mutationRemove.mutate()}
              >
                {t("Notification.Refuse")}
              </button>
            </>
          )}
          {detail?.status === "Accepted" && (
            <span> {t("Notification.Toast.Confirm")}</span>
          )}
          {detail?.status === "Rejected" && (
            <span> {t("Notification.Toast.Refuse")}</span>
          )}
        </div>
      </div>
      {!detail?.response_at && (
        <div className="notify__item__send">
          <div className="dot"></div>
        </div>
      )}
    </div>
  );
};
