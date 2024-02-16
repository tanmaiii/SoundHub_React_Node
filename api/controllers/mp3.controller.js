export const uploadMp3 = (req, res) => {
    if (!req.file) {
      const conflictError = "Please provide an mp3";
      res.status(401).json({ conflictError });
    }
  
    const fileName = req.file.filename;
    return res.json({ mp3: fileName });
  };
  
  export default {
    uploadMp3,
  };
  