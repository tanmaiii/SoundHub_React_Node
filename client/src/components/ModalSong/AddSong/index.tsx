import React, { useEffect, useState } from "react";
import "./style.scss";
import Dropdown from "../../Dropdown";
import { genreApi } from "../../../apis";
import { useQuery } from "react-query";
import Images from "../../../constants/images";
import WavesurferPlayer from "@wavesurfer/react";

const AddSong = () => {
  const [openDrop, setOpenDrop] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState(false);

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
    file?.type === "audio/mpeg" ? setErrorFile(false) : setErrorFile(true);
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
        {/* {(!file || errorFile) && (
          <UploadSong
            DragIn={openDrop}
            file={file}
            setFile={setFile}
            handleUpload={handleUpload}
            errorFile={errorFile}
          />
        )} */}

        {/* {file && !errorFile && <FormSong />} */}
        <FormSong />
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
  errorFile: boolean;
}) => {
  const formatFileSize = (size: number) => {
    return `${(size / 1024).toFixed()} KB`;
  };

  return (
    <div className="UploadSong">
      <div className={`UploadSong__icon ${DragIn ? "dragIn" : ""}`}>
        <i className="fa-solid fa-upload"></i>
      </div>
      <h4>Drag and drop audio files to upload</h4>
      <p>Your song will be private until you publish it.</p>
      <label htmlFor="file-1">Choose file</label>
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
            <p>File type not supported. Please choose another file.</p>
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
              {/* <p>{file.type}</p> */}
            </div>
            <button onClick={() => setFile(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
      </div>

      <div className="UploadSong__desc">
        <p>
          By uploading a video to YouTube, you confirm that you agree to
          YouTube's <a href="">Terms of Service</a> and{" "}
          <a href="">Community Guidelines</a>.
        </p>
        <p>
          You must ensure that you do not violate the copyrights or privacy of
          others.
        </p>
      </div>
    </div>
  );
};

export const FormSong = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const resetFileInputImage = () => {
    const fileInput = document.getElementById(
      "input-image-song"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    setImageFile(null);
  };

  return (
    <div className="FormSong">
      <div className="FormSong__top">
        <div className="box-audio">
          <button className="btn-play">
            <i className="fa-solid fa-pause"></i>
          </button>
          <div className="box-audio__body">
            <div className="progress"></div>
            <div className="time">
              <span>00:00</span>
              <span>03:12</span>
            </div>
          </div>
          <div>
            <button className="btn-volume">
              <i className="fa-light fa-volume"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="FormSong__body">
        <div className="FormSong__body__left">
          <div className="Form-box">
            <div className="Form-box__label">
              <span>Tiêu đề (bắt buộc): </span>
            </div>
            <input
              type="text"
              id="title"
              value={inputs?.title}
              placeholder="Thêm tiêu đề để thu hút người nghe"
              name="title"
              maxLength={100}
              onChange={(e) => updateState({ title: e.target.value })}
            />
            <p className="count-letter">{`${inputs.title.length || 0}/100`}</p>
          </div>

          <div className="Form-box">
            <div className="Form-box__label">
              <span>Mô tả: </span>
            </div>
            <textarea
              id="desc"
              value={inputs?.desc}
              placeholder="Thêm mô tả để mô tả bài hát của bạn"
              name="desc"
              maxLength={400}
              onChange={(e) => updateState({ desc: e.target.value })}
            />
            <p className="count-letter">{`${inputs.desc.length || 0}/400`}</p>
          </div>

          <div className="dropdowns">
            <Dropdown
              title={"Thể loại"}
              defaultSelected={"1"}
              changeSelected={
                (selected: { id: string; title: string }) =>
                  console.log(selected)

                // setInputs((prev) => ({
                //   ...prev,
                //   public: parseInt(selected?.id),
                // }))
              }
              options={[
                { id: "0", title: "Public" },
                { id: "1", title: "Private" },
              ]}
            />
            <Dropdown
              title={"Thể loại"}
              defaultSelected={genres?.[0]?.id ?? ""}
              changeSelected={(selected: { id: string; title: string }) =>
                // setInputs((prev) => ({ ...prev, genre_id: selected?.id }))
                console.log(selected)
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
        <div className="FormSong__body__right">
          <h4>Hình ảnh đại diện</h4>
          <span>
            Chọn hình thu nhỏ nổi bật để thu hút sự chú ý của người xem
          </span>
          <div className="FormSong__body__right__image">
            {imageFile && (
              <img src={imageFile && URL.createObjectURL(imageFile)} alt="" />
            )}
            <label
              htmlFor="input-image-song"
              className="FormSong__body__right__image__default"
            >
              <i className="fa-light fa-image"></i>
              <span>Tải tệp lên</span>
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
        <button className="btn-cancel">Thoát</button>
        <button className="btn-submit">Tiếp</button>
      </div>
    </div>
  );
};
