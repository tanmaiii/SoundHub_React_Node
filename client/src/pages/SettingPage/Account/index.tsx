import React, { useEffect } from "react";
import "./style.scss";
import { useAuth } from "../../../context/authContext";

const Account = () => {
  const { currentUser } = useAuth();

  return (
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
                <img src="https://via.placeholder.com/150" alt="avatar" />
              </div>
              <div className="Account__avatar__desc">
                <h5>{currentUser?.name}</h5>
                <p>{currentUser?.email}</p>
              </div>
              <button>Đổi ảnh</button>
            </div>

            <ItemAccount title="Tên" value={currentUser?.name ?? ""} />
            <ItemAccount title="Tên" value={currentUser?.name ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

const ItemAccount = ({ title, value }: { title: string; value: string }) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenEdit = () => {
    setIsEdit(true);
    inputRef.current && inputRef.current.focus();
  };

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [inputRef.current]);

  return (
    <div className="Account__item">
      <h6 className="title">Tên</h6>
      <p className="desc">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis qui
        temporibus quam
      </p>
      <div className="Account__item__body">
        <div className={`Account__item__body__desc ${isEdit ? "edit" : ""}`}>
          <span>{value}</span>
          <input
            ref={inputRef}
            type="text"
            defaultValue={value}
            placeholder="Enter your name..."
          />
        </div>
        <div className="Account__item__body__buttons">
          {!isEdit ? (
            <button onClick={() => handleOpenEdit()} className="btn-edit">
              <i className="fa-solid fa-pen"></i>
            </button>
          ) : (
            <button className="btn-clear">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>
      <div className="Account__item__bottom">
        {isEdit && (
          <div className="Account__item__bottom__buttons">
            <button onClick={() => setIsEdit(false)}>Hủy</button>
            <button>Lưu</button>
          </div>
        )}
      </div>
    </div>
  );
};
