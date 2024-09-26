import HeaderPage from "../../components/HeaderPage/HeaderPage";
import TrackArtist from "../../components/TrackArtist";
import "./style.scss";
import CommentItem from "../../components/CommentItem";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { authorApi, lyricApi, searchApi, songApi, userApi } from "../../apis";
import CommentInput from "../../components/CommentInput/CommentInput";
import SongMenu from "../../components/Menu/SongMenu";
import Images from "../../constants/images";
import { useAuth } from "../../context/AuthContext";
import { PATH } from "../../constants/paths";
import Modal from "../../components/Modal";
import { toast } from "sonner";
import { ResSoPaAr, TAuthor, TUser } from "../../types";
import CustomInput from "../../components/CustomInput";
import ImageWithFallback from "../../components/ImageWithFallback";
import numeral from "numeral";
import { useTranslation } from "react-i18next";
import { EditSong } from "../../components/ModalSong";
import { useAudio } from "../../context/AudioContext";
import { useDispatch } from "react-redux";
import { openMenu } from "../../slices/menuSongSlide";
import Section from "../../components/Section";
import CardSong from "../../components/CardSong";

export default function SongPage() {
  const navigation = useNavigate();
  const { id } = useParams();
  const { token, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const [openModalAuthor, setOpenModalAuthor] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [authors, setAuthors] = useState<TAuthor[]>([]);
  const [authorPending, setAuthorPending] = useState<TAuthor[]>([]);
  const { t } = useTranslation("song");
  const { playSong, start, isPlaying, songPlayId, pauseSong } = useAudio();
  const dispatch = useDispatch();
  const btnMenuRef = React.createRef<HTMLButtonElement>();
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]);
  const [seeMore, setSeeMore] = useState<boolean>(false);

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

  const {} = useQuery({
    queryKey: ["authors", song?.id],
    queryFn: async () => {
      try {
        const res =
          id &&
          (await authorApi.getAllUser(id, token, 1, 0, "", "new", "Accepted"));

        res && setAuthors(res.data);
        return res;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  });

  const {} = useQuery({
    queryKey: ["authors-pending", song?.id],
    queryFn: async () => {
      try {
        const res =
          currentUser?.id === song?.user_id &&
          id &&
          (await authorApi.getAllUser(id, token, 1, 0, "", "new", "Pending"));
        res && setAuthorPending(res?.data);
        return res;
      } catch (error) {
        console.log(error);
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

  const handleClickPlay = () => {
    if (songPlayId === id && isPlaying) {
      pauseSong();
    } else if (songPlayId === id && !isPlaying) {
      playSong();
    } else {
      start(song?.id ?? "");
    }
  };

  const handleClickOpenMenu = () => {
    const rect = btnMenuRef.current?.getBoundingClientRect();
    rect &&
      dispatch(
        openMenu({
          open: true,
          id: song?.id ?? "",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        })
      );
  };

  const { data: songs, isLoading: loadingSongNew } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const res = await searchApi.getSongs(
        token ?? "",
        1,
        10,
        undefined,
        "new"
      );
      return res.data;
    },
  });

  useEffect(() => {
    const getLyric = async () => {
      if (song && !song?.lyric_path) return;
      try {
        const res = song?.id && (await lyricApi.getLyric(song?.id, token));
        res && setLyrics(res);
      } catch (error) {
        console.log(error);
      }
    };
    getLyric();
  }, [song?.id]);

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
            desc={song?.desc ?? ""}
            time={song?.created_at ?? ""}
            like={song?.count_like ?? 0}
            listen={song?.count_listen ?? 0}
            category="Song"
            userId={song?.user_id}
            isPublic={song?.public}
            genreId={song?.genre_id}
            fnOpenEdit={() => setOpenModalEdit(true)}
          />
        </div>
        <div className="songPage__content">
          <div className="songPage__content__header">
            <button className="btn__play" onClick={handleClickPlay}>
              {songPlayId === song?.id && isPlaying ? (
                <i className="fa-solid fa-pause"></i>
              ) : (
                <i className="fa-solid fa-play"></i>
              )}
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
            <button
              ref={btnMenuRef}
              className={`btn__menu ${activeMenu ? "active" : ""}`}
              onClick={handleClickOpenMenu}
            >
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>

          <div className="songPage__content__body row">
            <div className="songPage__content__body__left col pc-8 t-12 ">
              {lyrics.length > 0 && (
                <div className="songPage__content__body__left__lyrics">
                  <h4>{t("Lyrics")}</h4>
                  {lyrics.slice(0, 10).map((lyric, index) => (
                    <p key={index}>{lyric.text}</p>
                  ))}
                  {seeMore &&
                    lyrics
                      .slice(10, lyrics.length)
                      .map((lyric, index) => <p key={index}>{lyric.text}</p>)}
                  <button onClick={() => setSeeMore(!seeMore)}>
                    <span>{seeMore ? "Ẩn bớt" : "...Xem thêm"}</span>
                  </button>
                </div>
              )}
              <div className="songPage__content__body__left__comment">
                <CommentInput avatarUrl={Images.AVATAR} />

                <div className="songPage__content__body__left__comment__header">
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

                <div className="songPage__content__body__left__comment__list">
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
            </div>
            <div className="songPage__content__body__artist col pc-4 t-12">
              <div className="songPage__content__body__artist__header">
                <h3>{t("Artist")}</h3>
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
                  authors.map((author, index) => (
                    <TrackArtist
                      key={index}
                      id={author.user_id}
                      songId={song?.id}
                      className="col pc-12 t-6 m-12"
                    />
                  ))}
              </div>
              {currentUser?.id === song?.user_id && (
                <>
                  {authorPending.length > 0 && (
                    <div className="songPage__content__body__artist__header">
                      <h3>{t("Invitation sent")}</h3>
                    </div>
                  )}
                  <div className="row">
                    {authorPending &&
                      authorPending.map((author, index) => (
                        <TrackArtist
                          key={index}
                          id={author.user_id}
                          songId={song?.id}
                          className="col pc-12 t-6 m-12"
                        />
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="songPage__content__footer">
            {songs && songs.length > 0 && (
              <Section title={t("Propose")}>
                {songs?.map((song, index) => {
                  if (song?.id === id) return null;
                  return (
                    <CardSong
                      key={index}
                      title={song.title}
                      image={song.image_path}
                      author={song.author}
                      userId={song.user_id ?? ""}
                      id={song.id}
                      isPublic={song.public ?? 1}
                    />
                  );
                })}
              </Section>
            )}
          </div>
        </div>
      </div>
      {song?.user_id === currentUser?.id && (
        <Modal openModal={openModalAuthor} setOpenModal={setOpenModalAuthor}>
          <div>
            <ModalAuthor songId={song?.id ?? ""} />
          </div>
        </Modal>
      )}

      {song?.user_id === currentUser?.id && (
        <Modal
          title="Edit song"
          openModal={openModalEdit}
          setOpenModal={setOpenModalEdit}
        >
          <EditSong
            songId={song?.id ?? ""}
            open={openModalEdit}
            closeModal={() => setOpenModalEdit(false)}
          />
        </Modal>
      )}
    </>
  );
}

const ModalAuthor = ({ songId }: { songId: string }) => {
  const [authors, setAuthors] = useState<ResSoPaAr[] | undefined>(undefined);
  const [keyword, setKeyword] = useState("");
  const { token } = useAuth();
  const { t } = useTranslation("song");

  const handleGetAuthor = async () => {
    try {
      const res = await searchApi.getArtists(token, 1, 10, keyword);
      res.data && setAuthors(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAuthor();
  }, [keyword]);

  const handleClick = () => {
    handleGetAuthor();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div className="ModalAuthor__search-author">
      <div className="ModalAuthor__search-author__header">
        <div className="ModalAuthor__search-author__header__input">
          <CustomInput
            onSubmit={(text) => setKeyword(text)}
            placeholder={t("Author.Enter artist name")}
            onKeyDown={handleKeyPress}
          />
          <button className="btn-search" onClick={handleClick}>
            <i className="fa-regular fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <div className="ModalAuthor__search-author__body">
        <div className="ModalAuthor__search-author__body__list">
          {authors?.length === 0 && (
            <div className="ModalAuthor__search-author__body__list__empty">
              <span>{t("Author.No results found")}</span>
            </div>
          )}
          {authors?.map((author) => (
            <AuthorItem key={author.id} id={author?.id} songId={songId} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AuthorItem = ({ id, songId }: { id: string; songId: string }) => {
  const [author, setAuthor] = useState<TUser | null>(null);
  const { currentUser, token } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation("song");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await userApi.getDetail(id);
        res && setAuthor(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAuthor();
  }, [id]);

  const { data: status } = useQuery({
    queryKey: ["author-song", { id, songId }],
    queryFn: async () => {
      try {
        const res =
          songId && id && (await authorApi.getDetail(token, id, songId));
        return res && res.status;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  });

  const mutationConfirm = useMutation({
    mutationFn: async (status: boolean) => {
      if (status) {
        toast.success(t("Toast.Delete request successfully"));
        return await authorApi.deleteAuthor(token, songId, id);
      } else {
        toast.success(t("Toast.Sent success"));
        return await authorApi.createRequest(token, songId, id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["author-song", { id, songId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["authors", songId],
      });
      queryClient.invalidateQueries({
        queryKey: ["authors-pending", songId],
      });
    },
  });

  if (currentUser?.id === id) return null;

  return (
    author && (
      <div className="ModalAuthor__author-item">
        <ImageWithFallback
          src={author?.image_path}
          alt={author?.name}
          fallbackSrc={Images.AVATAR}
        />
        <div className="ModalAuthor__author-item__desc">
          <h6>{author?.name}</h6>
          <span>
            {numeral(author?.count).format("0a").toUpperCase()} followers
          </span>
        </div>
        {!status || status === "Rejected" ? (
          <button
            className="btn-add"
            onClick={() => mutationConfirm.mutate(false)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        ) : (
          <button
            className="btn-remove"
            onClick={() => mutationConfirm.mutate(true)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
    )
  );
};
