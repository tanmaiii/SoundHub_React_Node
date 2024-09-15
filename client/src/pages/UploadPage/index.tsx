import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormSong from "./FormSong";
import "./style.scss";
import UploadSong from "./UploadSong";
import { useAudio } from "../../context/AudioContext";

const UploadPage = () => {
  const [openDrop, setOpenDrop] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState("");
  const { t } = useTranslation("song");
  const { updateQueue, playSong, pauseSong, isPlaying, stop } = useAudio();

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

    if (file && file?.size > 11 * 1024 * 1024) {
      setErrorFile(t("Upload.Error size file"));
      return;
    }
  }, [file]);

  useEffect(() => {
    if (file) {
      stop();
    }
  }, [file]);

  return (
    <div className="UploadPage">
      <div
        className={`UploadPage__body ${openDrop ? "active" : ""}`}
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

        {file && !errorFile && <FormSong file={file} setFile={setFile} />}
      </div>
    </div>
  );
};

export default UploadPage;
