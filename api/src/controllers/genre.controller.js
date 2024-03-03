import Genre from "../model/genre.model.js";
import jwtService from "../services/jwtService/index.js";

export const getGenre = async (req, res) => {
  try {
    Genre.findById(req.params.genreId, (err, genre) => {
      if (!genre) {
        return res.status(401).json({ conflictError: err });
      } else {
        return res.json(genre);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const createGenre = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    if (!userInfo.is_admin) {
      return res.status(401).json({ conflictError: "Cần quyền admin." });
    }

    Genre.create(req.body, (err, data) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const updateGenre = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    if (!userInfo.is_admin) {
      return res.status(401).json({ conflictError: "Cần quyền admin." });
    }

    Genre.findById(req.params.genreId, (err, genre) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }

      if (!genre) {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }

      Genre.update(genre.id, req.body, (err, data) => {
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

export const deleteGenre = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    if (!userInfo.is_admin) {
      return res.status(401).json({ conflictError: "Cần quyền admin." });
    }

    Genre.findById(req.params.genreId, (err, genre) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }

      if (!genre) {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }

      Genre.delete(genre.id, (err, data) => {
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

export default {
  getGenre,
  createGenre,
  updateGenre,
  deleteGenre,
};
