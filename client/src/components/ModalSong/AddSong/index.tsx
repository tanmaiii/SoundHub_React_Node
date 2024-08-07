import React from "react";
import './style.scss';

const AddSong = () => {
  return (
    <div className="AddSong">
      <div className="AddSong__body">
        <UploadSong />
      </div>
    </div>
  );
};

export default AddSong;


export const UploadSong = () => {
    return (
      <div className="UploadSong">
        <div className="UploadSong__icon">
          <i className="fa-solid fa-upload"></i>
        </div>
        <h4>Kéo và thả tệp âm thanh để tải lên</h4>
        <p>Bài hát của bạn sẽ ở chế độ riêng tư cho đến khi bạn xuất bản.</p>
        <button>Chọn tệp</button>
  
        <div className="UploadSong__desc">
          <p>
            Khi gửi video lên YouTube, bạn xác nhận rằng bạn đồng ý với{" "}
            <a href="">Điều khoản dịch vụ</a> và{" "}
            <a href="">Nguyên tắc cộng đồng</a> của YouTube.
          </p>
          <p>
            Bạn cần đảm bảo không vi phạm bản quyền hoặc quyền riêng tư của người
            khác.
          </p>
        </div>
      </div>
    );
  };
  