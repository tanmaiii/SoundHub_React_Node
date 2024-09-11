import fs from "fs";


// Hàm phân tích cú pháp file .lrc thành JSON
const parseLrc = (lrcContent) => {
  const lines = lrcContent.split("\n"); // Tách file .lrc thành các dòng
  const result = []; // Khởi tạo mảng để lưu kết quả

  for (let line of lines) {
    line = line.trim(); // Loại bỏ khoảng trắng đầu và cuối dòng

    // Bỏ qua các dòng metadata như [length:], [re:], [ve:]
    if (line.startsWith("[") && line.endsWith("]")) {
      continue; // Bỏ qua các dòng nằm trong cặp dấu []
    }

    // Kiểm tra xem dòng có chứa timestamp hay không
    // const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d+)\](.*)/);


    if (match) {
      // Nếu có timestamp, trích xuất giá trị thời gian và lời bài hát
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      let milliseconds = parseFloat(`0.${match[3]}`); // Lấy phần milli giây, chuyển thành số thập phân
      const text = match[4].trim(); // Lời bài hát

      // Tính toán thời gian dưới dạng giây
      // const time = minutes * 60 + seconds + milliseconds / 100;
      const time = minutes * 60 + seconds + milliseconds;

      result.push({ time, text });
    } else {
      // Nếu không có timestamp, lưu toàn bộ dòng đó với thời gian là null
      const text = line.trim(); // Lời bài hát không có timestamp
      if (text) {
        result.push({ time: null, text }); // Thêm vào kết quả với time là null
      }
    }
  }

  return result; // Trả về mảng kết quả
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
      console.log("lyrics", filePath);
      resolve(lyrics);
    });
  });
};

export default readLrcFile;
