import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../../context/AudioContext";
import { useAuth } from "../../context/AuthContext";
import { changeOpenWaiting } from "../../slices/waitingSlice";
import { RootState } from "../../store";
import TrackShort from "../TrackShort";
import "./style.scss";

type Props = {};

const WattingList = ({}: Props) => {
  const WattingListRef = React.createRef<HTMLDivElement>();
  const dispatch = useDispatch();
  const openWatting = useSelector((state: RootState) => state.waiting.state);
  const { token } = useAuth();
  const { queue, updateQueue, changePlaceQueue, songPlayId, replay } =
    useAudio();
  const [queueNew, setQueueNew] = useState<string[]>([]);
  const itemRef = React.createRef<HTMLDivElement>();

  const handleChangeOpenWaiting = () => {
    dispatch(changeOpenWaiting(!openWatting));
  };

  useEffect(() => {
    if (queue) setQueueNew(queue);
    if (queue?.length === 0) dispatch(changeOpenWaiting(false));
  }, [queue]);

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

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(queueNew);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);

    changePlaceQueue(newItems);
  };

  useEffect(() => {
    // Sử dụng scrollIntoView nếu itemRef hiện tại không null
    itemRef.current?.scrollIntoView({
      behavior: "smooth", // Cuộn mượt
      block: "start", // Cuộn tới đầu của phần tử
    });
  }, [songPlayId]);

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
          <h3>Danh sách chờ</h3>
          <div className="wattingList__wrapper__header__list">
            <button
              onClick={handleChangeOpenWaiting}
              data-tooltip={"Clear waiting list"}
            >
              <i className="fa-light fa-trash"></i>
            </button>
            <button onClick={handleChangeOpenWaiting}>
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
        <div className="wattingList__wrapper__body">
          <div className="wattingList__wrapper__body__list">
            <DragDropContext
              onDragEnd={onDragEnd}
              onDragStart={() => console.log("start")}
            >
              <Droppable direction="vertical" droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {queue &&
                      queue.map((item, index) => (
                        <Draggable
                          key={item}
                          draggableId={item ?? ""}
                          index={index}
                        >
                          {(provided) => {
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`wattingList__wrapper__body__list__item ${
                                  songPlayId === item ? "play" : ""
                                }`}
                              >
                                <div ref={songPlayId === item ? itemRef : null}>
                                  <TrackShort id={item} key={index} />
                                  {songPlayId === item &&
                                    queue.indexOf(songPlayId ?? "") !==
                                      queue.length - 1 && (
                                      <div className="title__nextSong">
                                        <h4>Bài tiếp theo</h4>
                                      </div>
                                    )}
                                </div>
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WattingList;
