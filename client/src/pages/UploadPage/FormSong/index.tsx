import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  authorApi,
  genreApi,
  imageApi,
  lyricApi,
  mp3Api,
  songApi,
} from "../../../apis";
import BoxAudio from "../../../components/BoxAudio";
import Dropdown from "../../../components/Dropdown";
import Modal from "../../../components/Modal";
import { ModalAddAuthor } from "../../../components/ModalSong";
import { AuthorItem } from "../../../components/ModalSong/AddAuthor";
import { PATH } from "../../../constants/paths";
import { useAuth } from "../../../context/AuthContext";
import "./style.scss";

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

type TFormSong = {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const FormSong = ({ file: fileMp3, setFile: setFileMp3 }: TFormSong) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [lyricFile, setLyricFile] = useState<File | null>(null);
  const { token, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation("song");
  const [exit, setExit] = useState(false);
  const [openModalAuthor, setOpenModalAuthor] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // Một chuỗi trống sẽ kích hoạt cảnh báo.
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
    title: fileMp3?.name?.split(".")[0] || "",
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
        error.lyric_path.trim() !== "" ||
        error.public.trim() !== "" ||
        error.genre_id.trim() !== ""
      ) {
        toast.error("Please check the information again");
        return;
      }
      let updatedInputs;
      let lyricPath = "";

      const formDataImage = new FormData();
      imageFile && formDataImage.append("image", imageFile);

      const formDataMp3 = new FormData();
      fileMp3 && formDataMp3.append("mp3", fileMp3);

      if (lyricFile) {
        const formDataLyric = new FormData();
        lyricFile && formDataLyric.append("lyric", lyricFile);

        const resLyric = await lyricApi.upload(formDataLyric, token);
        resLyric.lyric && (lyricPath = resLyric.lyric);
      }

      //Tải ảnh lên server
      const resImage = await imageApi.upload(formDataImage, token);
      const resMp3 = await mp3Api.upload(formDataMp3, token);

      updatedInputs = {
        ...inputs,
        image_path: resImage.image,
        song_path: resMp3.mp3,
        lyric_path: lyricPath,
      };

      const res = await songApi.createSong(token, updatedInputs);

      res?.id && navigate(`${PATH.SONG}/${res.id}`);
      handleSendAuthor(res.id);
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
      lyric_path: "",
    });
    setFileMp3(null);
    setImageFile(null);
    setLyricFile(null);
    updateError({
      title: "",
      desc: "",
      genre_id: "",
      public: "",
      image_path: "",
      song_path: "",
      lyric_path: "",
    });
  };

  //Xử lý sự kiện click nút submit
  const handleSubmit = () => {
    if (inputs.title.trim() === "") {
      updateError({ title: "Title is required" });
      return;
    } else {
      updateError({ title: "" });
    }

    if (!imageFile) {
      updateError({ image_path: "Image is required" });
      return;
    } else {
      updateError({ image_path: "" });
    }

    mutionSave.mutate();
  };

  //Xử lý sự kiện click nút hủy
  const handleCancel = () => {
    resetInput();
  };

  const handleSendAuthor = (songId: string) => {
    if (selectedAuthors.length === 0) {
      // toast.error("Vui lòng chọn tác giả");
      return;
    } else {
      console.log(selectedAuthors);
      selectedAuthors.map((authorId) => {
        return authorApi.createRequest(token, songId, authorId);
      });
    }
  };

  return (
    <>
      <div className="FormSong">
        <div className="FormSong__top">
          <BoxAudio file={fileMp3} stop={true} />
        </div>
        <div className="FormSong__body">
          <div className="FormSong__body__left">
            <div className={`Form-box ${error.title ? "error" : ""}`}>
              <div className="Form-box__label">
                <span>{t("Upload.Title")}</span>
              </div>
              <input
                type="text"
                id="title"
                value={inputs?.title}
                defaultValue={inputs?.title}
                placeholder={t("Upload.Title desc")}
                name="title"
                maxLength={100}
                onChange={(e) => updateState({ title: e.target.value })}
              />
              <p className="count-letter">{`${
                inputs.title.length || 0
              }/100`}</p>
            </div>

            <div className="Form-box">
              <div className="Form-box__label">
                <span>{t("Upload.Describe")}</span>
              </div>
              <textarea
                id="desc"
                value={inputs?.desc}
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
                  defaultSelected={genres?.[0]?.id ?? ""}
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

            <div className="Form-author">
              <div
                className="Form-author__input"
                onClick={() => setOpenModalAuthor(true)}
              >
                <div className="Form-author__input__label">
                  <span>{t("Upload.Author")}</span>
                </div>
                <h4>{t("Upload.Author desc")}</h4>
              </div>
              {selectedAuthors.length > 0 && (
                <div>
                  <h4 className="Form-author__title">
                    {t("Upload.List of artists")}
                  </h4>
                </div>
              )}
              <div className="Form-author__list row sm-gutter">
                {selectedAuthors.map((authorId) => (
                  <div key={authorId} className="col pc-4 t-6 m-12">
                    <AuthorItem
                      id={authorId}
                      authors={selectedAuthors}
                      setAuthors={setSelectedAuthors}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="FormSong__body__right">
            <div className="FormSong__body__right__image">
              <h4>{t("Upload.Image")}</h4>
              <span>{t("Upload.Image desc")}</span>
              <div className="FormSong__body__right__image__swapper">
                {imageFile && (
                  <img
                    src={imageFile && URL.createObjectURL(imageFile)}
                    alt=""
                  />
                )}
                <label
                  htmlFor="input-image-song"
                  className={`FormSong__body__right__image__swapper__default ${
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
                    onClick={resetFileInputImage}
                  >
                    <i className="fa-regular fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="FormSong__body__right__lyric">
              <h4>{t("Upload.Lyric")}</h4>
              <span>{t("Upload.Lyric desc")}</span>
              <div className="FormSong__body__right__lyric__swapper">
                {lyricFile ? (
                  <div className="FormSong__body__right__lyric__swapper__file">
                    <i className="fa-light fa-file-alt"></i>
                    <span>{lyricFile.name}</span>
                    <button
                      className="btn-remove"
                      onClick={resetFileInputLyric}
                    >
                      <i className="fa-regular fa-xmark"></i>
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="input-lyric-song"
                    className={`FormSong__body__right__lyric__swapper__default ${
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
        <div className="FormSong__bottom">
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
            {t("Upload.Post")}
          </button>
        </div>
      </div>
      <Modal openModal={exit} setOpenModal={setExit}>
        <div className="FormSong__modal">
          <h4>{t("Upload.Are you sure you want to exit")}</h4>
          <div className="FormSong__modal__footer">
            <button className="btn-cancel" onClick={() => setExit(false)}>
              {t("Upload.Cancel")}
            </button>
            <button
              className="btn-submit"
              onClick={() => {
                setExit(false);
                handleCancel();
              }}
            >
              {t("Upload.Exit")}
            </button>
          </div>
        </div>
      </Modal>
      <Modal openModal={openModalAuthor} setOpenModal={setOpenModalAuthor}>
        <ModalAddAuthor
          authors={selectedAuthors}
          setAuthors={setSelectedAuthors}
        />
      </Modal>
    </>
  );
};

export default FormSong;
