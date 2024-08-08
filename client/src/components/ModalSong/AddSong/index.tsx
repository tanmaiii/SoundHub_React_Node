import React, { useEffect, useState } from "react";
import "./style.scss";

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
  return (
    <div className="FormSong">
      <div className="FormSong__top"></div>
      <div className="FormSong__body">
        <div className="FormSong__body__left">
          <div className="Form-box">
            <div className="Form-box__label">
              <span>Tiêu đề (bắc buộc): </span>
            </div>
            <input
              type="text"
              id="title"
              // value={inputs?.title}
              placeholder="Add title"
              name="title"
              maxLength={100}
              // onChange={(e) => updateState({ title: e.target.value })}
            />
            <p className="count-letter">{`123s/100`}</p>
            {/* {inputs.title.length > 80 && (
              <span className="count-letter">{`${inputs.title.length}/100`}</span>
            )} */}
          </div>
        </div>
        <div className="FormSong__body__right"></div>
      </div>
    </div>
  );
};
