import HeaderPage from "../../components/HeaderPage/HeaderPage";
import TrackArtist from "../../components/TrackArtist";
import "./style.scss";

import CommentItem from "../../components/CommentItem";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { authorApi, songApi, userApi } from "../../apis";
import CommentInput from "../../components/CommentInput/CommentInput";
import SongMenu from "../../components/Menu/SongMenu";
import Images from "../../constants/images";
import { useAuth } from "../../context/authContext";
import { PATH } from "../../constants/paths";
import Modal from "../../components/Modal";
import ModalAddAuthor from "../../components/ModalAddAuthor";
import { toast } from "sonner";

export default function SongPage() {
  const navigation = useNavigate();
  const { id } = useParams();
  const { token, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const [openModalAuthor, setOpenModalAuthor] = useState<boolean>(false);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const { data: song } = useQuery({
    queryKey: ["song", id],
    queryFn: async () => {
      try {
        if (id) {
          const res = await songApi.getDetail(id ?? "", token);
          return res;
        }
      } catch (error) {
        navigation(`${PATH.ERROR}`);
        return null;
      }
    },
  });

  const { data } = useQuery({
    queryKey: ["authors", song?.id],
    queryFn: async () => {
      try {
        const res = id && (await authorApi.getAllUserConfirm(id));
        res && setAuthors(res);
        return res;
      } catch (error) {
        return null;
      }
    },
  });

  const {} = useQuery({
    queryKey: ["authors-all", song?.id],
    queryFn: async () => {
      try {
        const res = id && (await authorApi.getAllUser(id, token));
        res && setSelectedAuthors(res);
        return res;
      } catch (error) {
        return null;
      }
    },
  });

  const { data: isLike } = useQuery({
    queryKey: ["like-song", id],
    queryFn: async () => {
      const res = await songApi.checkLikedSong(id ?? "", token);
      return res.isLiked;
    },
  });

  const mutationLike = useMutation({
    mutationFn: (like: boolean) => {
      if (like) return songApi.unLikeSong(id ?? "", token);
      return songApi.likeSong(id ?? "", token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["like-song", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["song", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["songs-favorites", currentUser?.id],
      });
    },
  });

  useEffect(() => {
    console.log(selectedAuthors);

    selectedAuthors.map((author) => {
      const fetchAuthor = async () => {
        try {
          console.log({ author });

          if (!authors.includes(author)) {
            // toast.success("Add author success");
          }
          // const res = await userApi.getDetail(author);
          // console.log(res);
        } catch (error) {
          console.log(error);
        }
      };
      fetchAuthor();
    });
  }, [selectedAuthors]);

  return (
    <>
      <div className="songPage">
        <Helmet>
          <title>{`${song?.title} | Sound hub`}</title>
        </Helmet>

        <div className="songPage__header">
          <HeaderPage
            fbAvt={Images.SONG}
            avt={song?.image_path ?? ""}
            title={song?.title ?? ""}
            time={song?.created_at ?? ""}
            like={song?.count_like ?? 0}
            listen={song?.count_listen ?? 0}
            category="Song"
            userId={song?.user_id}
            isPublic={song?.public}
            genreId={song?.genre_id}
          />
        </div>
        <div className="songPage__content">
          <div className="songPage__content__header">
            <button className="btn__play">
              <i className="fa-solid fa-play"></i>
            </button>
            <button
              className={`btn__like ${isLike ? "active" : ""}`}
              onClick={() => mutationLike.mutate(isLike ?? false)}
            >
              {isLike ? (
                <i className="fa-solid fa-heart"></i>
              ) : (
                <i className="fa-light fa-heart"></i>
              )}
            </button>
            <button className={`btn__menu ${activeMenu ? "active" : ""}`}>
              {song && (
                <SongMenu
                  song={song}
                  id={id || ""}
                  active={activeMenu}
                  onOpen={() => setActiveMenu(true)}
                  onClose={() => setActiveMenu(false)}
                  placement="bottom-start"
                />
              )}
            </button>
          </div>

          <div className="songPage__content__body row">
            <div className="songPage__content__body__comment col pc-8 t-12 ">
              <CommentInput avatarUrl={Images.AVATAR} />

              <div className="songPage__content__body__comment__header">
                <div className="quantity">
                  <i className="fa-light fa-comment"></i>
                  <span>123 comments</span>
                </div>
                <div className="dropdown">
                  <div className="dropdown__header">
                    <i className="fa-light fa-bars-sort"></i>
                    <span>Mới nhất</span>
                    <i className="fa-light fa-chevron-down"></i>
                  </div>
                  <div className={`dropdown__content`}>
                    <ul>
                      <li>Mới nhất</li>
                      <li>Phổ biến</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="songPage__content__body__comment__list">
                <CommentItem
                  avatarUrl={Images.AVATAR}
                  name="Tấn Mãi"
                  time="2 hours ago"
                  content="Hay quá anh ơi"
                  level={0}
                />
                <CommentItem
                  avatarUrl={Images.AVATAR}
                  name="Tấn Mãi"
                  content="Hay quá anh ơi"
                  level={1}
                  time="2 hours ago"
                />
                <CommentItem
                  avatarUrl={Images.AVATAR}
                  name="Tấn Mãi"
                  level={2}
                  content="Hay quá anh ơi em yeue anh Hay quá anh ơi em yeue anh
                Hay quá anh ơi em yeue anh Hay quá anh ơi em yeue anh "
                  time="2 hours ago"
                />
                <CommentItem
                  avatarUrl={Images.AVATAR}
                  name="Tấn Mãi"
                  level={3}
                  content="Hay quá anh ơi"
                  time="2 hours ago"
                />
                <CommentItem
                  avatarUrl={Images.AVATAR}
                  name="Tấn Mãi"
                  content="Hay quá anh ơi"
                  time="2 hours ago"
                />
              </div>
            </div>
            <div className="songPage__content__body__artist col pc-4 t-12">
              <div className="songPage__content__body__artist__header">
                <h3>Artist</h3>
                {currentUser?.id === song?.user_id && (
                  <button
                    className="btn-add-author"
                    onClick={() => setOpenModalAuthor(true)}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                )}
              </div>
              <div className="row">
                {song && (
                  <TrackArtist
                    id={song.user_id ?? ""}
                    className="col pc-12 t-6 m-12"
                  />
                )}
                {authors &&
                  authors.map((author) => (
                    <TrackArtist
                      id={author}
                      songId={song?.id}
                      className="col pc-12 t-6 m-12"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal openModal={openModalAuthor} setOpenModal={setOpenModalAuthor}>
        <ModalAddAuthor
          authors={selectedAuthors}
          setAuthors={setSelectedAuthors}
        />
      </Modal>
    </>
  );
}
