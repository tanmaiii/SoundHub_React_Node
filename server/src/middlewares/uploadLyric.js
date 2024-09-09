import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "src/data/lyric";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (![".lrc"].includes(ext.toLowerCase())) {
      return cb(new Error("File không được hỗ trợ"));
    }
    cb(null, true);
  },
}).single("lyric");

const uploadImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (!req.file) {
      return res.status(404).json({ conflictError: "Không có file được tải lên" });
    }

    if (err instanceof multer.MulterError) {
      conflictError = "Error multer constimage";
      return res.status(404).json({ conflictError });
    } else if (err) {
      return res.status(404).json({ conflictError: err.message });
    }
    return next();
  });
};

export default uploadImage;
