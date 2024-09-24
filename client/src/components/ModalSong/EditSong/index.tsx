import React, { useEffect, useState } from "react";
import "./style.scss";
import { useAuth } from "../../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { genreApi, imageApi, lyricApi, songApi } from "../../../apis";
import { toast } from "sonner";
import { PATH } from "../../../constants/paths";
import Dropdown from "../../Dropdown";
import { apiConfig } from "../../../configs";
import Images from "../../../constants/images";

interface TError {
  title: string;
  desc: string;
  genre_id: string;
  public: string;
  image_path: string;
  song_path: string;
  lyric_path: string;
}

interface Inputs {
  title: string;
  desc: string;
  genre_id: string;
  public: number;
  image_path: string;
  song_path: string;
  lyric_path: string;
}

const EditSong = ({
  songId,
  open,
  closeModal,
}: {
  songId: string;
  open: boolean;
  closeModal: () => void;
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [lyricFile, setLyricFile] = useState<File | null>(null);
  const { token, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation("song");
  const [exit, setExit] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState<TError>({
    title: "",
    desc: "",
    genre_id: "",
    public: "",
    image_path: "",
    song_path: "",
    lyric_path: "",
  });

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    genre_id: "",
    public: 1,
    image_path: "",
    song_path: "",
    lyric_path: "",
  });

  const updateError = (newValue: Partial<TError>) => {
    setError((prevState) => ({ ...prevState, ...newValue }));
  };

  const updateState = (newValue: Partial<Inputs>) => {
    setInputs((prevState) => ({ ...prevState, ...newValue }));
  };

  //Lấy danh sách thể loại
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

  const featchData = async () => {
    try {
      const res = songId && (await songApi.getDetail(songId, token));
      res &&
        updateState({
          title: res.title,
          desc: res?.desc ?? "",
          genre_id: res.genre_id,
          public: res.public,
          image_path: res.image_path,
          song_path: res.song_path,
          lyric_path: res.lyric_path,
        });
    } catch (error) {}
  };

  useEffect(() => {
    featchData();
  }, [songId]);

  //Xử lý sự kiện thay đổi file hình ảnh
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]?.size > 1 * 1024 * 1024) {
      setImageFile(null);
      updateError({ image_path: "Image size must be less than 5MB" });
      return;
    }
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      updateError({ image_path: "" });
    }
  };

  //Xử lý sự kiện thay đổi file lyric
  const onChangeLyric = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]?.size > 1 * 1024 * 1024) {
      setLyricFile(null);
      updateError({ lyric_path: "Image size must be less than 5MB" });
      return;
    }

    const isLrcFile = (fileName: string) => {
      const extension = fileName.split(".").pop();
      return extension === "lrc";
    };

    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      if (!isLrcFile(fileName)) {
        setLyricFile(null);
        updateError({ lyric_path: "File must be in .lrc format" });
        return;
      }
      setLyricFile(e.target.files[0]);
      updateError({ lyric_path: "" });
    }
  };

  //Reset file input image
  const resetFileInputImage = () => {
    const fileInput = document.getElementById(
      "input-image-song"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    setImageFile(null);
  };

  const resetFileInputLyric = () => {
    const fileInput = document.getElementById(
      "input-lyric-song"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    setLyricFile(null);
  };

  //Xử lý sự kiện click nút submit
  const handleClickSubmit = async () => {
    try {
      if (
        error.title.trim() !== "" ||
        error.desc.trim() !== "" ||
        error.image_path.trim() !== "" ||
        error.song_path.trim() !== "" ||
        error.public.trim() !== "" ||
        error.genre_id.trim() !== ""
      ) {
        toast.error("Please check the information again");
        return;
      }
      let updatedInputs;

      if (imageFile) {
        const formDataImage = new FormData();
        imageFile && formDataImage.append("image", imageFile);

        //Tải ảnh lên server
        const resImage = await imageApi.upload(formDataImage, token);

        updatedInputs = {
          image_path: resImage.image,
        };
      }

      if (lyricFile) {
        const formDataLyric = new FormData();
        lyricFile && formDataLyric.append("lyric", lyricFile);

        //Tải lyric lên server
        const resLyric = await lyricApi.upload(formDataLyric, token);

        updatedInputs = {
          ...updatedInputs,
          lyric_path: resLyric.lyric,
        };
      }

      updatedInputs = { ...inputs, ...updatedInputs };

      console.log("UPDATE SONG:", updatedInputs);
      const res = await songApi.updateSong(token, songId, updatedInputs);

      res && songId && navigate(`${PATH.SONG}/${songId}`);
      resetInput();
      closeModal();
      resetInput();
      toast.success(t("Upload.ToastAddSuccess"));
    } catch (error) {
      toast.error(t("Upload.ToastAddError"));
      console.log(error);
    }
  };

  const mutionSave = useMutation(
    () => {
      return handleClickSubmit();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["song", songId],
        });
        queryClient.invalidateQueries({
          queryKey: ["songs", currentUser?.id],
        });
      },
    }
  );

  //Reset input
  const resetInput = () => {
    updateState({
      title: "",
      desc: "",
      genre_id: "",
      public: 1,
      image_path: "",
      song_path: "",
    });
    updateError({
      title: "",
      desc: "",
      genre_id: "",
      public: "",
      image_path: "",
      song_path: "",
    });
    featchData();
  };

  //Xử lý sự kiện click nút submit
  const handleSubmit = () => {
    if (inputs.title.trim() === "") {
      updateError({ title: "Title is required" });
      return;
    } else {
      updateError({ title: "" });
    }

    if (inputs?.genre_id === "" || inputs?.genre_id === null) {
      updateError({ genre_id: "Genre is required" });
      return;
    } else {
      updateError({ genre_id: "" });
    }

    if (inputs?.public === null || inputs?.public === undefined) {
      updateError({ public: "Visibility is required" });
      return;
    } else {
      updateError({ public: "" });
    }

    mutionSave.mutate();
  };

  //Xử lý sự kiện click nút hủy
  const handleCancel = () => {
    closeModal();
    resetInput();
  };

  return (
    <div className="EditSong">
      <div className="EditSong__body">
        <div className="EditSong__body__left">
          <div className={`Form-box ${error.title ? "error" : ""}`}>
            <div className="Form-box__label">
              <span>{t("Upload.Title")}</span>
            </div>
            <input
              type="text"
              id="title"
              value={inputs?.title || ""}
              placeholder={t("Upload.Title desc")}
              name="title"
              maxLength={100}
              onChange={(e) => updateState({ title: e.target.value })}
            />
            <p className="count-letter">{`${inputs.title.length || 0}/100`}</p>
          </div>

          <div className="Form-box">
            <div className="Form-box__label">
              <span>{t("Upload.Describe")}</span>
            </div>
            <textarea
              id="desc"
              value={inputs?.desc || ""}
              placeholder={t("Upload.Describe desc")}
              name="desc"
              maxLength={400}
              onChange={(e) => updateState({ desc: e.target.value })}
            />
            <p className="count-letter">{`${inputs.desc.length || 0}/400`}</p>
          </div>

          <div className="dropdowns row sm-gutter">
            <div className="dropdowns__item col pc-6 t-12 m-12">
              <Dropdown
                title={t("Upload.Genre")}
                error={error.genre_id}
                defaultSelected={inputs?.genre_id ?? ""}
                changeSelected={(selected: { id: string; title: string }) =>
                  updateState({ genre_id: selected?.id })
                }
                options={
                  genres?.map((genre) => ({
                    id: genre.id ?? "",
                    title: genre.title ?? "",
                  })) || []
                }
              />
            </div>

            <div className="dropdowns__item col pc-6 t-12 m-12">
              <Dropdown
                title={t("Upload.Visibility")}
                defaultSelected={"1"}
                changeSelected={(selected: { id: string; title: string }) => {
                  updateState({ public: parseInt(selected?.id) });
                }}
                options={[
                  { id: "0", title: t("Upload.Private") },
                  { id: "1", title: t("Upload.Public") },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="EditSong__body__right">
          <div className="EditSong__body__right__image">
            <h4>{t("Upload.Image")}</h4>
            <span>{t("Upload.Image desc")}</span>
            <div className="EditSong__body__right__image__swapper">
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : inputs.image_path
                    ? apiConfig.imageURL(inputs.image_path ?? "")
                    : Images.SONG
                }
                alt=""
              />
              <label
                htmlFor="input-image-song"
                className={`EditSong__body__right__image__swapper__default ${
                  error.image_path ? "error" : ""
                }`}
              >
                <i className="fa-light fa-image"></i>
                <span>{t("Upload.Upload")}</span>
                <input
                  type="file"
                  id="input-image-song"
                  onChange={onChangeImage}
                  accept="image/png, image/jpeg"
                />
              </label>
              {imageFile && (
                <button
                  className="btn-delete-image"
                  onClick={() => resetFileInputImage()}
                >
                  <i className="fa-regular fa-trash"></i>
                </button>
              )}
            </div>
          </div>

          <div className="EditSong__body__right__lyric">
            <h4>{t('Upload.Lyric')}</h4>
            <span>{t('Upload.Lyric desc')}</span>
            <div className="EditSong__body__right__lyric__swapper">
              {lyricFile ? (
                <div className="EditSong__body__right__lyric__swapper__file">
                  <i className="fa-light fa-file-alt"></i>
                  <span>{lyricFile.name}</span>
                  <button className="btn-remove" onClick={resetFileInputLyric}>
                    <i className="fa-regular fa-xmark"></i>
                  </button>
                </div>
              ) : inputs?.lyric_path ? (
                <div className="EditSong__body__right__lyric__swapper__file">
                  <i className="fa-light fa-file-alt"></i>
                  <span>{inputs?.lyric_path}</span>
                  <button
                    className="btn-remove"
                    onClick={() => updateState({ lyric_path: "" })}
                  >
                    <i className="fa-regular fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="input-lyric-song"
                  className={`EditSong__body__right__lyric__swapper__default ${
                    error.lyric_path ? "error" : ""
                  }`}
                >
                  <i className="fa-light fa-file-alt"></i>
                  <span>{t("Upload.Upload")}</span>
                  <input
                    type="file"
                    id="input-lyric-song"
                    accept="lrc"
                    onChange={onChangeLyric}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="EditSong__bottom">
        <button
          className="btn-cancel"
          onClick={() => {
            if (exit) {
              handleCancel();
            } else {
              setExit(true);
            }
          }}
        >
          {t("Upload.Cancel")}
        </button>
        <button className="btn-submit" onClick={() => handleSubmit()}>
          {t("Upload.Save")}
        </button>
      </div>
    </div>
  );
};

export default EditSong;
