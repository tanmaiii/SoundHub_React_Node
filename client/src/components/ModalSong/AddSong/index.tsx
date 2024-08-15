import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { genreApi, imageApi, mp3Api, songApi } from "../../../apis";
import Dropdown from "../../Dropdown";
import "./style.scss";
import { useAuth } from "../../../context/authContext";
import { useTranslation } from "react-i18next";
import BoxAudio from "../../BoxAudio";
import { toast } from "sonner";

const AddSong = ({ closeModal }: { closeModal: () => void }) => {
  const [openDrop, setOpenDrop] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState("");
  const { t } = useTranslation("song");

  const onDragEnter = () => {
    setOpenDrop(true);
  };

  const onDragLeave = () => {
    setOpenDrop(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    file && setFile(file);
  };

  useEffect(() => {
    file && setOpenDrop(false);
    setErrorFile("");

    if (file && file?.type !== "audio/mpeg") {
      return setErrorFile(t("Upload.Error type file"));
    }

    if (file && file?.size > 5000000) {
      console.log(file.size);

      setErrorFile(t("Upload.Error size file"));
      return;
    }
  }, [file]);

  return (
    <div className="AddSong">
      <div
        className={`AddSong__body ${openDrop ? "active" : ""}`}
        onDragEnter={onDragEnter}
      >
        {openDrop && (
          <div onDragLeave={onDragLeave} className="div-drag">
            <input onChange={handleUpload} id="file" type="file" />
          </div>
        )}
        {(!file || errorFile) && (
          <UploadSong
            DragIn={openDrop}
            file={file}
            setFile={setFile}
            handleUpload={handleUpload}
            errorFile={errorFile}
          />
        )}

        {file && !errorFile && (
          <FormSong file={file} setFile={setFile} closeModal={closeModal} />
        )}
        {/* <FormSong /> */}
      </div>
    </div>
  );
};

export default AddSong;

export const UploadSong = ({
  DragIn,
  handleUpload,
  file,
  setFile,
  errorFile,
}: {
  DragIn: boolean;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  errorFile: string;
}) => {
  const formatFileSize = (size: number) => {
    return `${(size / 1024).toFixed()} KB`;
  };

  const { t } = useTranslation("song");

  return (
    <div className="UploadSong">
      <div className={`UploadSong__icon ${DragIn ? "dragIn" : ""}`}>
        <i className="fa-solid fa-upload"></i>
      </div>
      <h4>{t("Upload.Drag and drop audio files to upload")}</h4>
      <p>{t("Upload.Your song will be private until you publish it.")}</p>
      <label htmlFor="file-1">{t("Upload.Chose file")}</label>
      <input
        onChange={handleUpload}
        id="file-1"
        type="file"
        style={{ display: "none" }}
      />

      <div className="UploadSong__file">
        {file && errorFile && (
          <div className="error">
            <i className="fa-regular fa-triangle-exclamation"></i>
            <p>{errorFile}</p>
          </div>
        )}

        {file && !errorFile && (
          <div className="file-item">
            <div className="file-item__icon">
              <i className="fa-solid fa-file-music"></i>
            </div>
            <div className="file-item__desc">
              <h6>{file.name}</h6>
              <p>{formatFileSize(file.size)}</p>
            </div>
            <button onClick={() => setFile(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
      </div>

      <div className="UploadSong__desc">
        <p>{t("Upload.Regulations 1")}</p>
        <p>{t("Upload.Regulations 2")}</p>
      </div>
    </div>
  );
};

export const FormSong = ({
  file: fileMp3,
  setFile: setFileMp3,
  closeModal,
}: {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  closeModal: () => void;
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { token, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation("song");
  interface TError {
    title: string;
    desc: string;
    genre_id: string;
    public: string;
    image_path: string;
    song_path: string;
  }

  interface Inputs {
    title: string;
    desc: string;
    genre_id: string;
    public: number;
    image_path: string;
    song_path: string;
  }

  const [error, setError] = useState<TError>({
    title: "",
    desc: "",
    genre_id: "",
    public: "",
    image_path: "",
    song_path: "",
  });

  const [inputs, setInputs] = useState<Inputs>({
    title: fileMp3?.name?.split(".")[0] || "",
    desc: "",
    genre_id: "",
    public: 1,
    image_path: "",
    song_path: "",
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
        toast.error("Vui lòng kiểm tra lại thông tin");
        return;
      }
      let updatedInputs;

      const formDataImage = new FormData();
      imageFile && formDataImage.append("image", imageFile);

      const formDataMp3 = new FormData();
      fileMp3 && formDataMp3.append("mp3", fileMp3);

      //Tải ảnh lên server
      const resImage = await imageApi.upload(formDataImage, token);
      const resMp3 = await mp3Api.upload(formDataMp3, token);

      updatedInputs = {
        ...inputs,
        image_path: resImage.image,
        song_path: resMp3.mp3,
      };

      await songApi.createSong(token, updatedInputs);
      closeModal();
      resetInput();
      toast.success("Thêm bài hát thành công");
    } catch (error) {
      toast.error("Thêm bài hát thất bại");
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

  const resetInput = () => {
    updateState({
      title: "",
      desc: "",
      genre_id: "",
      public: 1,
      image_path: "",
      song_path: "",
    });
    setFileMp3(null);
    updateError({
      title: "",
      desc: "",
      genre_id: "",
      public: "",
      image_path: "",
      song_path: "",
    });
  };

  const handleCancel = () => {
    resetInput();
    closeModal();
  };

  return (
    <div className="FormSong">
      <div className="FormSong__danger">
        <div className="FormSong__danger__wrapper">
          <i className="fa-light fa-circle-exclamation"></i>
          <span>Lưu trước khi thoát. </span>
        </div>
      </div>
      <div className="FormSong__top">
        <BoxAudio file={fileMp3} />
      </div>
      <div className="FormSong__body row">
        <div className="FormSong__body__left pc-9 t-8 m-12">
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
            <p className="count-letter">{`${inputs.title.length || 0}/100`}</p>
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

          <div className="dropdowns row row__gutter">
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
          </div>
        </div>
        <div className="FormSong__body__right pc-3 t-4 m-12">
          <h4>{t("Upload.Image")}</h4>
          <span>{t("Upload.Image desc")}</span>
          <div className="FormSong__body__right__image">
            {imageFile && (
              <img src={imageFile && URL.createObjectURL(imageFile)} alt="" />
            )}
            <label
              htmlFor="input-image-song"
              className={`FormSong__body__right__image__default ${
                error.image_path ? "error" : ""
              }`}
            >
              <i className="fa-light fa-image"></i>
              <span>{t("Upload.Upload image")}</span>
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
      </div>
      <div className="FormSong__bottom">
        <button className="btn-cancel" onClick={() => handleCancel()}>
          {t("Upload.Cancel")}
        </button>
        <button className="btn-submit" onClick={() => handleSubmit()}>
          {t("Upload.Post")}
        </button>
      </div>
    </div>
  );
};
