import fs from "fs";

// Hàm phân tích cú pháp file .lrc thành JSON
const parseLrc = (lrcContent) => {
  const lines = lrcContent.split("\n");
  const result = [];

  for (let line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const milliseconds = parseInt(match[3]);
      const text = match[4].trim();

      const time = minutes * 60 + seconds + milliseconds / 100;
      result.push({ time, text });
    }
  }

  return result;
};

// Đọc file .lrc và trả về JSON
const readLrcFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      // reject("File không tồn tại");
      return;
    }
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        // reject("Lỗi khi đọc file: " + err);
        return;
      }

      // Phân tích cú pháp nội dung .lrc và trả về JSON
      const lyrics = parseLrc(data);
      resolve(lyrics);
    });
  });
};

export default readLrcFile;
