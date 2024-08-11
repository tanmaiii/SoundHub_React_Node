import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { genreApi, imageApi, mp3Api, songApi } from "../../../apis";
import Dropdown from "../../Dropdown";
import Slider from "../../Slider";
import "./style.scss";
import { useAuth } from "../../../context/authContext";

type TAddSong = {
  closeModal: () => void;
};

const AddSong = ({ closeModal }: TAddSong) => {
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
        {(!file || errorFile) && (
          <UploadSong
            DragIn={openDrop}
            file={file}
            setFile={setFile}
            handleUpload={handleUpload}
            errorFile={errorFile}
          />
        )}

        {file && !errorFile && <FormSong file={file} closeModal={closeModal} />}
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

type TFormSong = {
  file: File;
  closeModal: () => void;
};

export const FormSong = ({ file: fileMp3, closeModal }: TFormSong) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { token, currentUser } = useAuth();
  const queryClient = useQueryClient();
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
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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
      )
        return;
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
    } catch (error) {
      console.log(error);
    }
  };

  const mutionSave = useMutation(
    () => {
      return handleClickSubmit();
    },
    {
      onSuccess: () => {
        closeModal();
        queryClient.invalidateQueries({
          queryKey: ["songs", currentUser?.id],
        });
        // queryClient.invalidateQueries({ queryKey: ["all-favorites"] });
        // queryClient.invalidateQueries({ queryKey: ["playlists-favorites"] });
      },
    }
  );

  useEffect(() => {
    if (inputs.title.trim() === "") {
      updateError({ title: "Title is required" });
    } else {
      updateError({ title: "" });
    }

    if (!imageFile) {
      updateError({ image_path: "Image is required" });
    } else {
      updateError({ image_path: "" });
    }
  }, [inputs, imageFile]);

  return (
    <div className="FormSong">
      <div className="FormSong__top">
        <BoxAudio file={fileMp3} />
      </div>
      <div className="FormSong__body">
        <div className="FormSong__body__left">
          <div className={`Form-box ${error.title ? "error" : ""}`}>
            <div className="Form-box__label">
              <span>Tiêu đề (bắt buộc): </span>
            </div>
            <input
              type="text"
              id="title"
              value={inputs?.title}
              defaultValue={inputs?.title}
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
              changeSelected={(selected: { id: string; title: string }) => {
                updateState({ public: parseInt(selected?.id) });
              }}
              options={[
                { id: "0", title: "Private" },
                { id: "1", title: "Public" },
              ]}
            />
            <Dropdown
              title={"Thể loại"}
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
              className={`FormSong__body__right__image__default ${
                error.image_path ? "error" : ""
              }`}
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
        <button className="btn-cancel" onClick={() => closeModal()}>Thoát</button>
        <button className="btn-submit" onClick={() => mutionSave.mutate()}>
          Tiếp
        </button>
      </div>
    </div>
  );
};

const BoxAudio = ({ file: fileMp3 }: { file: File }) => {
  const [play, setPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ValRef = useRef<HTMLInputElement>(null);
  const [urlMp3, setUrlMp3] = useState<string | null>(() =>
    fileMp3 ? URL.createObjectURL(fileMp3) : null
  );

  const [percentage, setPercentage] = useState(0);

  const [valueVolume, setValueVolume] = useState<string>("50");

  let [minutes, setMinutes] = useState<string>("00");
  let [seconds, setSeconds] = useState<string>("00");

  let [minutesPlay, setMinutesPlay] = useState<string>("00");
  let [secondsPlay, setSecondsPlay] = useState<string>("00");

  useEffect(() => {
    fileMp3 ? setUrlMp3(URL.createObjectURL(fileMp3)) : setUrlMp3(null);
  }, [fileMp3]);

  const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (audio.duration / 100) * parseFloat(e.target.value);
    }
    setPercentage(parseFloat(e.target.value));
  };

  const handlePlay = () => {
    if (audioRef.current?.paused) {
      setPlay(true);
      audioRef.current?.play();
    } else {
      setPlay(false);
      audioRef.current?.pause();
    }
  };

  useEffect(() => {
    const duration = audioRef.current?.duration;
    if (duration) {
      setMinutes(
        Math.floor(duration / 60)
          .toString()
          .padStart(2, "0")
      );
      setSeconds(
        Math.floor(duration % 60)
          .toString()
          .padStart(2, "0")
      );
    }
  }, [audioRef]);

  const onPlaying = () => {
    const duration = audioRef.current?.duration;
    const ct: number | undefined = audioRef.current?.currentTime;

    const percent =
      ct && duration ? ((ct / duration) * 100).toFixed(2) : undefined;
    percent && setPercentage(+percent);

    ct &&
      setMinutesPlay(
        Math.floor(ct / 60)
          .toString()
          .padStart(2, "0")
      );
    ct &&
      setSecondsPlay(
        Math.floor(ct % 60)
          .toString()
          .padStart(2, "0")
      );

    duration &&
      setMinutes(
        Math.floor(duration / 60)
          .toString()
          .padStart(2, "0")
      );
    duration &&
      setSeconds(
        Math.floor(duration % 60)
          .toString()
          .padStart(2, "0")
      );
  };

  const onEndedAuido = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Đặt thời gian phát lại về 0
      audioRef.current.play(); // Phát lại âm thanh từ đầu
    }
  };

  useEffect(() => {
    audioRef.current!.volume = parseInt(valueVolume || "0") / 100;
  }, [valueVolume]);

  return (
    <div className="box-audio">
      <audio
        ref={audioRef}
        id="audio"
        src={urlMp3 ? urlMp3 : ""}
        onTimeUpdate={onPlaying}
        onEnded={onEndedAuido}
      ></audio>

      <button className="btn-play" onClick={() => handlePlay()}>
        {play ? (
          <i className="fa-solid fa-pause"></i>
        ) : (
          <i className="fa-solid fa-play"></i>
        )}
      </button>
      <div className="box-audio__body">
        <Slider percentage={percentage} onChange={onChangeSlider} />
        <div className="time">
          <span>{`${minutesPlay}:${secondsPlay}`}</span>
          <span>{`${minutes}:${seconds}`}</span>
        </div>
      </div>
      <div className="box-audio__volume">
        <div className="volume-progress">
          <span
            className="slider-track"
            style={{ width: `${valueVolume ?? 0 * 100}%` }}
          ></span>

          <input
            type="range"
            name="volume"
            className="max-val"
            ref={ValRef}
            onInput={(e) => setValueVolume(e.currentTarget?.value)}
            max={100}
            min={0}
            value={valueVolume}
          />
        </div>
        <button
          className="btn-volume"
          onClick={() => {
            setValueVolume(valueVolume !== "0" ? "0" : "50");
          }}
        >
          {valueVolume !== "0" ? (
            <i className="fa-light fa-volume"></i>
          ) : (
            <i className="fa-light fa-volume-slash"></i>
          )}
        </button>
      </div>
    </div>
  );
};
