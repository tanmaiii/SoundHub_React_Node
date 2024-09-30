import Comment from "../model/comment.model.js";
import Song from "../model/song.model.js";
import jwtService from "../services/jwtService.js";

const createComment = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Song.findById(req.params.songId, userInfo.id, (err, song) => {
      if (err || !song) {
        return res.status(401).json({ conflictError: "Song not found" });
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

const deleteComment = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Comment.findById(req.params.commentId, (err, comment) => {
      if (err || !comment) {
        return res.status(401).json({ conflictError: "Comment not found" });
      }
      if (comment.user_id !== userInfo.id) {
        return res.status(401).json({ conflictError: "You are not the owner" });
      }
      Comment.delete(req.params.commentId, (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        } else {
          return res.json(data);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAllCommentsBySongId = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Song.findById(req.params.songId, userInfo.id, (err, song) => {
      if (err || !song) {
        return res.status(401).json({ conflictError: "Song not found" });
      }
      Comment.findAllBySongId(req.params.songId, req.query, (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        } else {
          return res.json(data);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAllRelatedComments = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Comment.findAllRepliesByCommentId(
      req.params.commentId,
      req.query,
      (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        } else {
          return res.json(data);
        }
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

const likeComment = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Comment.findById(req.params.commentId, (err, comment) => {
      if (err || !comment) {
        return res.status(401).json({ conflictError: "Comment not found" });
      }

      Comment.findUserLikeComment(req.params.commentId, (err, data) => {
        if (data && data.includes(userInfo.id)) {
          return res
            .status(401)
            .json({ conflictError: "You have already liked this comment" });
        } else {
          Comment.like(req.params.commentId, userInfo.id, (err, data) => {
            if (err) {
              return res.status(401).json({ conflictError: err });
            } else {
              return res.json(data);
            }
          });
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const unLikeComment = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Comment.findById(req.params.commentId, (err, comment) => {
      if (err || !comment) {
        return res.status(401).json({ conflictError: "Comment not found" });
      }
      Comment.unLike(req.params.commentId, userInfo.id, (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        } else {
          return res.json(data);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const countLikeComment = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Comment.findById(req.params.commentId, (err, comment) => {
      if (err || !comment) {
        return res.status(401).json({ conflictError: "Comment not found" });
      }
      Comment.findUserLikeComment(req.params.commentId, (err, data) => {
        if (data) {
          return res.status(200).json(data.length);
        } else {
          return res.status(200).json(0);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const checkLikeComment = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Comment.findById(req.params.commentId, (err, comment) => {
      if (err || !comment) {
        return res.status(401).json({ conflictError: "Comment not found" });
      }
      Comment.findUserLikeComment(req.params.commentId, (err, data) => {
        if (data) {
          const isLiked = data.includes(userInfo.id);
          return res.status(200).json({ isLiked });
        } else {
          return res.status(200).json({ isLiked: false });
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default {
  createComment,
  deleteComment,
  getAllCommentsBySongId,
  getAllRelatedComments,
  likeComment,
  unLikeComment,
  countLikeComment,
  checkLikeComment,
};
