import fs from "fs";
import jwtService from "../services/jwtService.js";
import User from "../model/user.model.js";
import Song from "../model/song.model.js";
import readLrcFile from "../middlewares/readLrcFile.js";

export const uploadLyric = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    User.findById(userInfo.id, (err, user) => {
      if (!user || err) {
        const conflictError = "Không tìm thấy!";
        return res.status(401).json({ conflictError });
      } else {
        if (!req.file) {
          const conflictError = "Please provide an lyric";
          console.log("ERROR UPLOAD LYRIC: ", conflictError);
          return res.status(401).json({ conflictError });
        }

        const fileName = req.file.filename;
        console.log("UPLOAD LYRIC: ", { lyric: fileName });
        return res.json({ lyric: fileName });
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deleteLyric = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);
    User.findById(userInfo.id, (err, user) => {
      if (!user || err) {
        const conflictError = "Error user not found!";
        return res.status(401).json({ conflictError });
      } else {
        const fileName = req.body.fileName;
        const filePath = `src/data/lyric/${fileName}`;

        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            const conflictError = "File not found";
            return res.status(404).json({ conflictError });
          }

          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              const conflictError = "Error deleting file";
              return res.status(500).json({ conflictError });
            }

            console.log("DELETE LYRIC: ", {
              message: "File deleted successfully",
            });

            return res.json({ message: "File deleted successfully" });
          });
        });
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getLyric = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Song.findById(req.params.songId, userInfo.id, async (err, song) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }
      if (!song.lyric_path) {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }
      // Gọi hàm đọc file .lrc
      const lyrics = await readLrcFile(`src/data/lyric/${song.lyric_path}`);
      if (lyrics) {
        return res.json(lyrics); // Trả về JSON
      } else {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default {
  uploadLyric,
  deleteLyric,
  getLyric,
};
