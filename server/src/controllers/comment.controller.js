import Comment from "../model/comment.model.js";
import Song from "../model/song.model.js";

const createComment = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);
    
    console.log("CREATE COMMENT: ", req.params.songId);
    console.log(userInfo.id);

    Song.findById(req.params.songId, userInfo.id, (err, song) => {
      if (err || !song) {
        return res.status(401).json("Không tìm thấy bài hát");
      }
      Comment.create(
        userInfo.id,
        req.params.songId,
        req.body.content,
        (err, data) => {
          if (err) {
            return res.status(401).json({ conflictError: err });
          } else {
            return res.json(data);
          }
        }
      );
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default {
  createComment,
};
