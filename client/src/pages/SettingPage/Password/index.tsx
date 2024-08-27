import React from "react";
import "./style.scss";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/Modal";
import { useAuth } from "../../../context/authContext";

const Password = () => {
  const { t } = useTranslation("settings");
  const [openModal, setOpenModal] = React.useState(false);
  const { currentUser } = useAuth();

  return (
    <>
      <div className="Setting-password">
        <div className="Setting-password__content">
          <div className="Setting-password__content__header">
            <h4>{t("Password and security")}</h4>
            <span>
              Quản lý mật khẩu, tùy chọn đăng nhập và phương thức khôi phục.
            </span>
          </div>
          <div className="Setting-password__content__body">
            <div
              className="Setting-password__content__body__item"
              onClick={() => setOpenModal(true)}
            >
              <div className="Setting-password__content__body__item__title">
                <h4>Đổi mật khẩu</h4>
                <span>**********</span>
              </div>
              <button>
                <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>

            <div className="Setting-password__content__body__item">
              <div className="Setting-password__content__body__item__title">
                <h4>Email</h4>
                <span>{currentUser?.email}</span>
              </div>
              <button>
                <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        title="Thay đổi mật khẩu"
      >
        <ModalChangePassword />
      </Modal>
    </>
  );
};

export default Password;

type TInput = {
  value: string;
  err: string;
  view: boolean;
};

const ModalChangePassword = () => {
  const [stateOldPass, setStateOldPass] = React.useState<TInput>({
    value: "",
    err: "",
    view: false,
  });

  const [stateNewPass, setStateNewPass] = React.useState<TInput>({
    value: "",
    err: "",
    view: false,
  });

  const [stateReNewPass, setStateReNewPass] = React.useState<TInput>({
    value: "",
    err: "",
    view: false,
  });

  const handleSumbit = () => {
    console.log(stateNewPass, stateOldPass, stateReNewPass);
  };

  return (
    <div className="Setting-password__modal">
      <span className="Setting-password__modal__desc">
        Mật khẩu của bạn phải có tối thiểu 6 ký tự, đồng thời bao gồm cả chữ số,
        chữ cái và ký tự đặc biệt (!$@%).
      </span>
      <div className="Setting-password__modal__group">
        <input
          placeholder=" "
          type={stateOldPass.view ? "password" : "text"}
          id="currentPassword"
          value={stateOldPass.value}
          onChange={(e) =>
            setStateOldPass({ ...stateOldPass, value: e.target.value })
          }
        />
        <label htmlFor="currentPassword">Mật khẩu hiện tại của bạn</label>
        <button
          onClick={() =>
            setStateOldPass({ ...stateOldPass, view: !stateOldPass.view })
          }
        >
          {stateOldPass.view ? (
            <i className="fa-solid fa-eye"></i>
          ) : (
            <i className="fa-solid fa-eye-slash"></i>
          )}
        </button>
      </div>
      <div className="Setting-password__modal__group">
        <input
          placeholder=" "
          type={stateNewPass.view ? "password" : "text"}
          id="newPassword"
          value={stateNewPass.value}
          onChange={(e) =>
            setStateNewPass({ ...stateNewPass, value: e.target.value })
          }
        />
        <label htmlFor="newPassword">Mật khẩu mới (tối thiểu 8 ký tự)</label>
        <button
          onClick={() =>
            setStateNewPass({ ...stateNewPass, view: !stateNewPass.view })
          }
        >
          {stateNewPass.view ? (
            <i className="fa-solid fa-eye"></i>
          ) : (
            <i className="fa-solid fa-eye-slash"></i>
          )}
        </button>
      </div>
      <div className="Setting-password__modal__group">
        <input
          placeholder=" "
          type={stateReNewPass.view ? "password" : "text"}
          id="confirmPassword"
          value={stateReNewPass.value}
          onChange={(e) =>
            setStateReNewPass({ ...stateNewPass, value: e.target.value })
          }
        />
        <label htmlFor="confirmPassword">Xác nhận mật khẩu mới của bạn</label>
        <button
          onClick={() =>
            setStateReNewPass({ ...stateReNewPass, view: !stateReNewPass.view })
          }
        >
          {stateReNewPass.view ? (
            <i className="fa-solid fa-eye"></i>
          ) : (
            <i className="fa-solid fa-eye-slash"></i>
          )}
        </button>
      </div>
      <a className="Setting-password__modal__forget" href="">
        Quên mật khẩu ?
      </a>
      <button onClick={handleSumbit} className="btn-submit">
        Save
      </button>
    </div>
  );
};
