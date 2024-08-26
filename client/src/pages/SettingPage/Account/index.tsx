import React, { useEffect } from "react";
import "./style.scss";
import { useAuth } from "../../../context/authContext";
import Modal from "../../../components/Modal";
import ImageWithFallback from "../../../components/ImageWithFallback";
import Images from "../../../constants/images";
import { imageApi } from "../../../apis";
import { toast } from "sonner";
import { EditAvatar } from "../../../components/ModalArtist";

const Account = () => {
  const { currentUser } = useAuth();
  const [openModalEditAvatar, setOpenModalEditAvatar] = React.useState(false);
  const { token } = useAuth();

  const handleSaveName = (value: string) => {
    console.log(value);
  };


  return (
    <>
      <div className="Account ">
        <div className="Account__wrapper row">
          <div className="Account__wrapper__nav col pc-0 t-3 m-0">12312</div>
          <div className="Account__wrapper__content col pc-9 t-9 m-12">
            <div className="Account__wrapper__content__header">
              <h4>Chỉnh sửa trang cá nhân</h4>
            </div>
            <div className="Account__wrapper__content__body">
              <div className="Account__avatar">
                <div className="Account__avatar__img">
                  <ImageWithFallback
                    src={currentUser?.image_path ?? ""}
                    fallbackSrc={Images.AVATAR}
                    alt=""
                  />
                </div>
                <div className="Account__avatar__desc">
                  <h5>{currentUser?.name}</h5>
                  <p>{currentUser?.email}</p>
                </div>
                <button onClick={() => setOpenModalEditAvatar(true)}>
                  Đổi ảnh
                </button>
              </div>

              <ItemAccount
                title="Tên"
                value={currentUser?.name ?? ""}
                onSave={handleSaveName}
              />
              <ItemAccount
                title="Tên"
                value={currentUser?.name ?? ""}
                onSave={handleSaveName}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        openModal={openModalEditAvatar}
        setOpenModal={setOpenModalEditAvatar}
      >
        <EditAvatar closeModal={() => setOpenModalEditAvatar(false)} />
      </Modal>
    </>
  );
};

export default Account;

const ItemAccount = ({
  title,
  value: valueDefault,
  description,
  onSave,
}: {
  title: string;
  value: string;
  description?: string;
  onSave: (value: string) => void;
}) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [isFocus, setIsFocus] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState(valueDefault);

  const handleOpenEdit = () => {
    setIsEdit(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // Focus vào thẻ input khi bắt đầu chỉnh sửa
      }
    }, 0);
  };

  const handleClickSave = () => {
    onSave(value);
    setIsEdit(false);
  };

  return (
    <div className="Account__item">
      <h6 className="title">Tên</h6>
      <p className="desc">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis qui
        temporibus quam
      </p>
      <div className={`Account__item__body ${isFocus ? "focus" : ""}`}>
        <div className={`Account__item__body__desc ${isEdit ? "edit" : ""}`}>
          <span>{value}</span>
          <input
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            ref={inputRef}
            value={value}
            type="text"
            onChange={(e) => setValue(e.target.value)}
            // defaultValue={value}
            placeholder="Enter your name..."
          />
        </div>
        <div className="Account__item__body__buttons">
          {!isEdit ? (
            <button onClick={() => handleOpenEdit()} className="btn-edit">
              <i className="fa-solid fa-pen"></i>
            </button>
          ) : (
            <button
              className="btn-clear"
              onClick={() => {
                setValue("");
                handleOpenEdit();
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>
      <div className="Account__item__bottom">
        {isEdit && (
          <div className="Account__item__bottom__buttons">
            <button onClick={() => setIsEdit(false)}>Hủy</button>
            <button onClick={handleClickSave}>Lưu</button>
          </div>
        )}
      </div>
    </div>
  );
};
