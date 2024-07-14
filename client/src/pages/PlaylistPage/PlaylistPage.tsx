import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { genreApi, imageApi, playlistApi, songApi, userApi } from "../../apis";
import Dropdown from "../../components/Dropdown";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import PlaylistMenu from "../../components/Menu/PlaylistMenu";
import Modal from "../../components/Modal/Modal";
import TableTrack from "../../components/TableTrack";
import { apiConfig } from "../../configs";
import Images from "../../constants/images";
import { useAuth } from "../../context/authContext";
import "./playlistPage.scss";
import { TPlaylist } from "../../types";
import ImageWithFallback from "../../components/ImageWithFallback";

export default function PlaylistPage() {
  const navigation = useNavigate();
  const { id } = useParams();
  const { token, currentUser } = useAuth();
  const [totalCount, setTotalCount] = useState(0);
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { t } = useTranslation("playlist");

  const {
    data: playlist,
    isLoading: loadingPlaylist,
    refetch: refetchPlaylist,
    error: errorPlaylist,
  } = useQuery({
    queryKey: ["playlist", id],
    queryFn: async () => {
      try {
        const res = await playlistApi.getDetail(id ?? "", token);
        return res;
      } catch (error) {
        navigation("/");
        return null;
      }
    },
  });

  const { data: author } = useQuery({
    queryKey: ["author", playlist?.user_id],
    queryFn: async () => {
      try {
        const res = await userApi.getDetail(playlist?.user_id ?? "");
        return res;
      } catch (error) {
        return null;
      }
    },
  });

  const {
    data: songs,
    refetch: refetchSongs,
    isLoading: loadingSongs,
  } = useQuery({
    queryKey: ["playlist-songs", id],
    queryFn: async () => {
      const res = await songApi.getAllByPlaylistId(token, id || "", 1, 0);
      setTotalCount(res.pagination.totalCount);
      return res.data;
    },
  });

  const { data: isLike } = useQuery({
    queryKey: ["like-playlist", id],
    queryFn: async () => {
      const res = await playlistApi.checkLikedPlaylist(id ?? "", token);
      return res.isLiked;
    },
  });

  const mutationLike = useMutation({
    mutationFn: (like: boolean) => {
      if (like) return playlistApi.unLikePlaylist(id ?? "", token);
      return playlistApi.likePlaylist(id ?? "", token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", id] });
      queryClient.invalidateQueries({ queryKey: ["like-playlist", id] });
      queryClient.invalidateQueries({ queryKey: ["all-favorites"] });
      queryClient.invalidateQueries({ queryKey: ["playlists-favorites"] });
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="playlistPage">
      <Helmet>
        <title>{`${playlist?.title} | Sound hub`}</title>
      </Helmet>

      <div className="playlistPage__header">
        <HeaderPage
          fbAvt={Images.PLAYLIST}
          avt={playlist?.image_path ?? ""}
          title={playlist?.title ?? ""}
          author={author?.name ?? ""}
          avtAuthor={author?.image_path ?? ""}
          time={playlist?.created_at ?? ""}
          category="Playlist"
          like={playlist?.count_like ?? 0}
          song={totalCount ?? 0}
          userId={playlist?.user_id}
          desc={playlist?.desc ?? ""}
          fnOpenEdit={() => setOpenModal(true)}
          genreId={playlist?.genre_id ?? ""}
        />
      </div>
      <div className="playlistPage__content">
        <div className="playlistPage__content__header">
          <div className="playlistPage__content__header__left">
            {songs && songs?.length > 0 && (
              <button className="btn__play">
                <i className="fa-solid fa-play"></i>
              </button>
            )}
            {playlist?.user_id && currentUser?.id !== playlist?.user_id && (
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
            )}
            <button className={`btn__menu ${activeMenu ? "active" : ""}`}>
              <PlaylistMenu
                id={id || ""}
                active={activeMenu}
                placement="bottom-start"
                onOpen={() => setActiveMenu(true)}
                onClose={() => setActiveMenu(false)}
              />
            </button>
          </div>
          {/* <div className="playlistPage__content__header__right">
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

        <TableTrack
          songs={songs || []}
          isLoading={true}
          userId={playlist?.user_id}
        />
      </div>
      <Modal
        title={t("EditPlaylist.EditPlaylist")}
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <EditPlaylist
          playlist={playlist ?? {}}
          closeModal={() => setOpenModal(false)}
        />
      </Modal>
    </div>
  );
}

type props = {
  playlist: TPlaylist;
  closeModal: () => void;
};

const EditPlaylist = ({ playlist, closeModal }: props) => {
  const { t } = useTranslation("playlist");
  const [urlImage, setUrlImage] = useState<string>(playlist?.image_path ?? "");
  const [imageFile, setImageFile] = useState<any>(null);
  const queryClient = useQueryClient();
  const { token } = useAuth();

  interface Inputs {
    title: string;
    desc: string;
    genre_id: string;
  }

  const [inputs, setInputs] = useState<Inputs>({
    title: playlist?.title ?? "",
    desc: playlist?.desc ?? "",
    genre_id: playlist?.genre_id ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { data: genres, refetch: refetchGenres } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      try {
        const res = await genreApi.getAll(1, 100);
        return res.data;
      } catch (error: any) {
        console.log(error.response.data);
      }
    },
  });

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    setInputs({
      title: playlist?.title ?? "",
      desc: playlist?.desc ?? "",
      genre_id: playlist?.genre_id ?? "",
    });
  }, [playlist]);

  const handleSave = async () => {
    const formData = new FormData();
    try {
      const uploadImage = async () => {
        formData.append("image", imageFile);

        const res = await imageApi.upload(formData, token);
        if (res.image) {
          console.log(res.image);
          setInputs((prev) => ({ ...prev, image_path: res.image }));
          await playlistApi.updatePlaylist(token, playlist?.id ?? "", { image_path: res.image });
        } else {
          console.log("Update image unsuccessful");
        }
      };

      imageFile && (await uploadImage());

      await playlistApi.updatePlaylist(token, playlist?.id ?? "", inputs);
      console.log(inputs);
      console.log(imageFile);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(inputs);
    
  },[inputs])

  const mutionSave = useMutation(
    () => {
      return handleSave();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["playlist", playlist?.id] });
        queryClient.invalidateQueries({
          queryKey: ["playlist-songs", playlist.id],
        });
        closeModal();
      },
    }
  );
  return (
    <div className="ModalEdit">
      <div className="ModalEdit__top">
        <div className="ModalEdit__top__image">
          <img
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : playlist?.image_path
                ? apiConfig.imageURL(playlist?.image_path ?? "")
                : Images.PLAYLIST
            }
            alt=""
          />
          {/* <ImageWithFallback
            src={
              imageFile
                ? imageFile
                : playlist?.image_path
                ? playlist?.image_path
                : ""
            }
            fallbackSrc={Images.PLAYLIST}
            alt=""
          /> */}
          <label htmlFor="input-image" className="ModalEdit__top__image__edit">
            <i className="fa-regular fa-pen-to-square"></i>
            <span>Edit playlist</span>
            <input
              type="file"
              id="input-image"
              onChange={onChangeImage}
              accept="image/png, image/jpeg"
            />
          </label>
        </div>
        <div className="ModalEdit__top__body">
          <div className="ModalEdit__top__body__title">
            <input
              type="text"
              id="title"
              value={inputs?.title}
              placeholder="Add title"
              name="title"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="title">{t("EditPlaylist.Title")}</label>
          </div>
          <div className="ModalEdit__top__body__desc">
            <textarea
              id="desc"
              value={inputs?.desc}
              placeholder="Add description"
              name="desc"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="title">{t("EditPlaylist.Description")}</label>
          </div>
          {/* dropdown genre */}
          <div className="ModalEdit__top__body__select">
            <Dropdown
              title={t("EditPlaylist.Genre")}
              defaultSelected={inputs?.genre_id ?? ""}
              changeSelected={(selected: { id: string; title: string }) =>
                setInputs((prev) => ({ ...prev, genre_id: selected.id }))
              }
              options={
                genres?.map((genre) => ({
                  id: genre.id ?? "",
                  title: genre.title ?? "",
                })) || []
              }
            />
          </div>
        </div>
      </div>
      <div className="ModalEdit__bottom">
        <button onClick={closeModal}>{t("EditPlaylist.Cancel")}</button>
        <button onClick={() => mutionSave.mutate()}>
          {t("EditPlaylist.Save")}
        </button>
      </div>
    </div>
  );
};
