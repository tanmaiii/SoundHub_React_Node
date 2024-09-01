import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { genreApi, imageApi, playlistApi } from "../../../apis";
import Images from "../../../constants/images";
import { useAuth } from "../../../context/AuthContext";
import Dropdown from "../../Dropdown";
import "./style.scss";

type props = {
  openModal: boolean;
  closeModal: () => void;
};

const AddPlaylist = ({ closeModal, openModal }: props) => {
  const { t } = useTranslation("playlist");
  const [imageFile, setImageFile] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const queryClient = useQueryClient();
  const { token, currentUser } = useAuth();

  interface Inputs {
    title: string;
    desc: string;
    genre_id: string;
    public: number;
    image_path: string;
  }

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    genre_id: "",
    public: 1,
    image_path: "",
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

      await playlistApi.createPlaylist(token, updatedInputs);
      closeModal();
    } catch (error) {
      setError((error as any).response.data.conflictError);
    }
  };

  const mutionSave = useMutation(
    () => {
      return handleSave();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["playlists", currentUser?.id ?? ""],
        });
        queryClient.invalidateQueries({ queryKey: ["all-favorites"] });
        queryClient.invalidateQueries({ queryKey: ["playlists-favorites"] });
      },
    }
  );

  const resetFileInput = () => {
    const fileInput = document.getElementById(
      "input-image-playlist"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    setImageFile(null);
  };

  return (
    <div className="ModalAdd">
      {error && (
        <div className="ModalAdd__error">
          <i className="fa-regular fa-circle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}
      <div className="ModalAdd__top">
        <div className="ModalAdd__top__image">
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : Images.PLAYLIST}
            alt=""
          />
          <label
            htmlFor="input-image-playlist"
            className="ModalAdd__top__image__edit"
          >
            <i className="fa-regular fa-pen-to-square"></i>
            <span>{t("AddNewPlaylist.EditImage")}</span>
            <input
              type="file"
              id="input-image-playlist"
              onChange={onChangeImage}
              accept="image/png, image/jpeg"
            />
          </label>
          {imageFile && (
            <button
              className="ModalAdd__top__image__edit__delete"
              onClick={() => resetFileInput()}
            >
              <i className="fa-regular fa-trash"></i>
            </button>
          )}
        </div>
        <div className="ModalAdd__top__body">
          <div className="ModalAdd__top__body__title">
            <input
              type="text"
              id="title"
              value={inputs?.title}
              placeholder="Add title"
              name="title"
              maxLength={100}
              onChange={(e) => updateState({ title: e.target.value })}
            />
            <label htmlFor="title">{t("AddNewPlaylist.Title")}</label>
            {inputs.title.length > 80 && (
              <span className="count-letter">{`${inputs.title.length}/100`}</span>
            )}
          </div>
          <div className="ModalAdd__top__body__desc">
            <textarea
              id="desc"
              value={inputs?.desc}
              placeholder="Add description"
              name="desc"
              maxLength={200}
              onChange={(e) => updateState({ desc: e.target.value })}
            />
            <label htmlFor="title">{t("AddNewPlaylist.Description")}</label>
            {inputs.desc.length > 180 && (
              <span className="count-letter">{`${inputs.desc.length}/200`}</span>
            )}
          </div>
          {/* dropdown genre */}
          <div className="ModalAdd__top__body__select">
            <Dropdown
              title={t("AddNewPlaylist.Genre")}
              defaultSelected={genres?.[0]?.id ?? ""}
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
          <div className="ModalAdd__top__body__select">
            <Dropdown
              title={t("AddNewPlaylist.Mode")}
              defaultSelected={"1"}
              changeSelected={(selected: { id: string; title: string }) =>
                setInputs((prev) => ({
                  ...prev,
                  public: parseInt(selected?.id),
                }))
              }
              options={[
                { id: "0", title: t("AddNewPlaylist.Private") },
                { id: "1", title: t("AddNewPlaylist.Public") },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="ModalAdd__bottom">
        <button onClick={closeModal}>{t("AddNewPlaylist.Cancel")}</button>
        <button onClick={() => mutionSave.mutate()}>
          {t("AddNewPlaylist.Save")}
        </button>
      </div>
    </div>
  );
};

export default AddPlaylist;
