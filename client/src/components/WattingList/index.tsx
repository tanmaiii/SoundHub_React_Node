import React, { useEffect } from "react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeOpenWaiting } from "../../slices/waitingSlice";
import { searchApi } from "../../apis";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "react-query";
import TrackShort from "../TrackShort";

type Props = {};

const WattingList = ({}: Props) => {
  const WattingListRef = React.createRef<HTMLDivElement>();
  const dispatch = useDispatch();
  const openWatting = useSelector((state: RootState) => state.waiting.state);
  const { token } = useAuth();

  const handleChangeOpenWaiting = () => {
    dispatch(changeOpenWaiting(!openWatting));
  };

  useEffect(() => {
    if (openWatting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openWatting]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const node = e.target as Node;
    if (!WattingListRef.current?.contains(node)) {
      handleChangeOpenWaiting();
    }
  };

  const { data: songPopular, isLoading: loadingSongPopular } = useQuery({
    queryKey: ["songs-popular"],
    queryFn: async () => {
      const res = await searchApi.getPopular(
        token ?? "",
        1,
        20,
        undefined,
        "new"
      );

      return res.data;
    },
  });

  return (
    <div
      onClick={(e) => handleClick(e)}
      className={`wattingList ${openWatting ? "open" : ""}`}
    >
      <div
        ref={WattingListRef}
        className={`wattingList__wrapper ${openWatting ? "open" : ""}`}
      >
        <div className="wattingList__wrapper__header">
          <h3>Watting List</h3>
          <button onClick={handleChangeOpenWaiting}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="wattingLiset__wrapper__body">
          {songPopular?.map((item, index) => {
            return <TrackShort song={item} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default WattingList;
