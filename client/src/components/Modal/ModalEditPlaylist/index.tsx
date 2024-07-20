import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../../../context/authContext";
import { TPlaylist } from "../../../types";
import { genreApi, imageApi, playlistApi } from "../../../apis";
import { apiConfig } from "../../../configs";
import Images from "../../../constants/images";
import Dropdown from "../../Dropdown";
import "./style.scss";

type props = {
  playlist: TPlaylist;
  openEdit: boolean;
  closeModal: () => void;
};

const ModalEditPlaylist = ({ playlist, closeModal, openEdit }: props) => {
  const { t } = useTranslation("playlist");
  const [imageFile, setImageFile] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const queryClient = useQueryClient();
  const { token } = useAuth();

  interface Inputs {
    title: string;
    desc: string;
    genre_id: string;
    public: number;
    image_path: string;
  }

  const [inputs, setInputs] = useState<Inputs>({
    title: playlist?.title ?? "",
    desc: playlist?.desc ?? "",
    genre_id: playlist?.genre_id ?? "",
    public: playlist?.public ?? 1,
    image_path: playlist?.image_path ?? "",
  });

  const updateState = (newValue: Partial<Inputs>) => {
    setInputs((prevState) => ({ ...prevState, ...newValue }));
  };

  const { data: genres } = useQuery({
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
    setImageFile("");
    setError("");
    setInputs({
      title: playlist?.title ?? "",
      desc: playlist?.desc ?? "",
      genre_id: playlist?.genre_id ?? "",
      public: playlist?.public ?? 1,
      image_path: playlist?.image_path ?? "",
    });
  }, [playlist, openEdit]);

  const handleSave = async () => {
    const formData = new FormData();
    setError("");

    if (inputs.title === "") {
      return setError("Title is required");
    }

    if (inputs.genre_id === "") {
      return setError("Genre is required");
    }

    try {
      let updatedInputs;

      if (imageFile) {
        console.log("imageFile", imageFile);
        formData.append("image", imageFile);
        //Tải ảnh lên server
        const res = await imageApi.upload(formData, token);
        updatedInputs = { ...inputs, image_path: res.image };
      } else {
        updatedInputs = { ...inputs };
      }

      await playlistApi.updatePlaylist(
        token,
        playlist?.id ?? "",
        updatedInputs
      );
      closeModal();
    } catch (error: any) {
      setError(error.response.data.conflictError);
    }
  };

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
      },
    }
  );
  return (
    <div className="ModalEdit">
      {error && (
        <div className="ModalEdit__error">
          <i className="fa-regular fa-circle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}
      <div className="ModalEdit__top">
        <div className="ModalEdit__top__image">
          <img
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : inputs.image_path
                ? apiConfig.imageURL(inputs.image_path ?? "")
                : Images.PLAYLIST
            }
            alt=""
          />
          <label htmlFor="input-image" className="ModalEdit__top__image__edit">
            <i className="fa-regular fa-pen-to-square"></i>
            <span>{t("EditPlaylist.EditImage")}</span>
            <input
              type="file"
              id="input-image"
              onChange={onChangeImage}
              accept="image/png, image/jpeg"
            />
            <button
              className="ModalEdit__top__image__edit__delete"
              onClick={() => {
                updateState({ image_path: "" });
                setImageFile(null);
              }}
            >
              <i className="fa-regular fa-trash"></i>
            </button>
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
              maxLength={100}
              onChange={(e) => updateState({ title: e.target.value })}
            />
            <label htmlFor="title">{t("EditPlaylist.Title")}</label>
            {inputs.title.length > 80 && (
              <span className="count-letter">{`${inputs.title.length}/100`}</span>
            )}
          </div>
          <div className="ModalEdit__top__body__desc">
            <textarea
              id="desc"
              value={inputs?.desc}
              placeholder="Add description"
              name="desc"
              maxLength={200}
              onChange={(e) => updateState({ desc: e.target.value })}
            />
            <label htmlFor="title">{t("EditPlaylist.Description")}</label>
            {inputs.desc.length > 180 && (
              <span className="count-letter">{`${inputs.desc.length}/200`}</span>
            )}
          </div>
          {/* dropdown genre */}
          <div className="ModalEdit__top__body__select">
            <Dropdown
              title={t("EditPlaylist.Genre")}
              defaultSelected={inputs?.genre_id ?? ""}
              changeSelected={(selected: { id: string; title: string }) =>
                setInputs((prev) => ({ ...prev, genre_id: selected?.id }))
              }
              options={
                genres?.map((genre) => ({
                  id: genre.id ?? "",
                  title: genre.title ?? "",
                })) || []
              }
            />
          </div>
          <div className="ModalEdit__top__body__select">
            <Dropdown
              title={t("EditPlaylist.Mode")}
              defaultSelected={playlist?.public === 0 ? "0" : "1"}
              changeSelected={(selected: { id: string; title: string }) =>
                setInputs((prev) => ({
                  ...prev,
                  public: parseInt(selected?.id),
                }))
              }
              options={[
                { id: "0", title: t("EditPlaylist.Private") },
                { id: "1", title: t("EditPlaylist.Public") },
              ]}
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

export default ModalEditPlaylist;
