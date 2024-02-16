export const uploadImage = (req, res) => {
  if (!req.file) {
    const conflictError = "Please provide an image";
    res.status(401).json({ conflictError });
  }

  const fileName = req.file.filename;
  return res.json({ image: fileName });
};

export default {
  uploadImage,
};
