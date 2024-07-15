import React, { useEffect, useState } from "react";
import "./style.scss";
import { TSong } from "../../types";
import Track from "../Track";
import Images from "../../constants/images";
import { useAuth } from "../../context/authContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { playlistApi } from "../../apis";
import { useMutation, useQueryClient } from "react-query";

type props = {
  playlistId?: string;
  songs: TSong[] | null;
  isLoading?: boolean;
  userId?: string;
};

const TableTrack = ({
  songs,
  isLoading = false,
  userId,
  playlistId,
}: props) => {
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const { currentUser, token } = useAuth();
  const [songsNew, setSongsNew] = useState<{ id: string; num_song: number }[]>(
    []
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    setSongsNew([]);
    songs &&
      songs.map((item) =>
        setSongsNew((prev) => [
          ...prev,
          { id: item?.id, num_song: item?.num_song ?? 0 },
        ])
      );
  }, [songs]);

  useEffect(() => {
    // console.log(songsNew);
  }, [songsNew]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    console.log(result);

    const newItems = Array.from(songsNew);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);

    newItems.map((item, index) => (item.num_song = index + 1));

    setSongsNew(newItems);
    mutation.mutate();
  };

  const handleUpdateSongs = async () => {
    try {
      playlistId &&
        (await playlistApi.updateSong(token, playlistId ?? "", songsNew));
      console.log("UPDATE SONGS:", songsNew);
    } catch (error: any) {
      console.log(error);
    }
  };

  const mutation = useMutation({
    mutationFn: handleUpdateSongs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      queryClient.invalidateQueries({
        queryKey: ["playlist-songs", playlistId],
      });
    },
  });

  return (
    <div className="table__track">
      <div className="table__track__header">
        {/* <div className="table__track__header__left">
          {songs && songs?.length > 0 && (
            <button className="btn__play">
              <i className="fa-solid fa-play"></i>
            </button>
          )}
          {userId && currentUser?.id !== userId && (
            <button>
              <i className="fa-light fa-heart"></i>
            </button>
          )}
          <button>
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
        <div className="table__track__header__right">
          {songs && songs?.length > 0 && (
            <div className="dropdown">
              <div
                className="dropdown__header"
                onClick={() => setActiveDropdown(!activeDropdown)}
              >
                <i className="fa-light fa-bars-sort"></i>
                <span>Mới nhất</span>
                <i className="fa-light fa-chevron-down"></i>
              </div>
              <div
                className={`dropdown__content ${
                  activeDropdown ? "active" : ""
                }`}
              >
                <ul>
                  <li>Mới nhất</li>
                  <li>Phổ biến</li>
                </ul>
              </div>
            </div>
          )}
        </div> */}
      </div>
      {songs && songs?.length > 0 ? (
        <div className="table__track__body">
          <div className="table__track__body__header">
            <div className="table__track__body__header__line1 pc-6 m-8">
              <span className="count">#</span>
              <span className="title">Title</span>
            </div>
            <div className="table__track__body__header__line2 pc-2 m-0">
              <span>Date Add</span>
            </div>
            <div className="table__track__body__header__line3 pc-2 t-2 m-0">
              <span>Listen</span>
            </div>
            <div className="table__track__body__header__line4 pc-2 t-2 m-4">
              <span>Time</span>
            </div>
          </div>
          <div className="table__track__body__list">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable direction="vertical" droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {songs &&
                      songs.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={userId !== currentUser?.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Track
                                key={index}
                                number={`${index + 1}`}
                                song={item}
                                loading={isLoading}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      ) : (
        <div className="table__track__body__empty">
          <img src={Images.EMPTY} alt="" />
          <span>Playlist is empty</span>
        </div>
      )}
    </div>
  );
};

export default TableTrack;

type propsSortableItem = {
  index: number;
  song: TSong;
  isLoading: boolean;
};

const SortableItem = ({ index, song, isLoading }: propsSortableItem) => {
  return (
    <div>
      <Track
        key={index}
        number={`${index + 1}`}
        song={song}
        loading={isLoading}
      />
    </div>
  );
};
