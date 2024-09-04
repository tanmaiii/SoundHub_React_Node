import React, { useEffect, useState } from "react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeOpenWaiting } from "../../slices/waitingSlice";
import { searchApi } from "../../apis";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "react-query";
import TrackShort from "../TrackShort";
import { useAudio } from "../../context/AudioContext";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

type Props = {};

const WattingList = ({}: Props) => {
  const WattingListRef = React.createRef<HTMLDivElement>();
  const dispatch = useDispatch();
  const openWatting = useSelector((state: RootState) => state.waiting.state);
  const { token } = useAuth();
  const { queue, updateQueue } = useAudio();
  const [queueNew, setQueueNew] = useState<string[]>([]);

  const handleChangeOpenWaiting = () => {
    dispatch(changeOpenWaiting(!openWatting));
  };

  useEffect(() => {
    if (queue) setQueueNew(queue);
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
    console.log(newItems);

    updateQueue(newItems);
  };

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
        <div className="wattingList__wrapper__body">
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
                        {(provided) => (
                          <div
                            className="wattingList__wrapper__body__item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TrackShort id={item} key={index} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* {queue?.map((item, index) => {
            return <TrackShort id={item} key={index} />;
          })} */}
        </div>
      </div>
    </div>
  );
};

export default WattingList;
