import React, { useEffect } from "react";
import "./style.scss";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/Modal";
import { useAuth } from "../../../context/authContext";
import { authApi, userApi } from "../../../apis";
import { toast } from "sonner";
import { useQueryClient } from "react-query";

const Password = () => {
  const { t } = useTranslation("settings");
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalEmail, setOpenModalEmail] = React.useState(false);
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

            <div
              className="Setting-password__content__body__item"
              onClick={() => setOpenModalEmail(true)}
            >
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
        <ModalChangePassword
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
        />
      </Modal>

      <Modal
        openModal={openModalEmail}
        setOpenModal={setOpenModalEmail}
        title="Thay đổi email"
      >
        <ModalChangeEmail
          openModal={openModalEmail}
          closeModal={() => setOpenModalEmail(false)}
        />
      </Modal>
    </>
  );
};

export default Password;

type TInput = {
  value: string;
  err: string;
  view: boolean;
  loading?: boolean;
};

const ModalChangePassword = ({
  openModal,
  closeModal,
}: {
  openModal: boolean;
  closeModal: () => void;
}) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,30}$/;
  const { token } = useAuth();
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

  const updateStateOldPass = (newState: Partial<TInput>) => {
    setStateOldPass((prevState) => ({ ...prevState, ...newState }));
  };
  const updateStateNewPass = (newState: Partial<TInput>) => {
    setStateNewPass((prevState) => ({ ...prevState, ...newState }));
  };
  const updateStateReNewPass = (newState: Partial<TInput>) => {
    setStateReNewPass((prevState) => ({ ...prevState, ...newState }));
  };

  const handleChangeOldPass = (text: string) => {
    updateStateOldPass({ value: text.trim() });
  };

  const handleChangeNewPass = (text: string) => {
    updateStateNewPass({ value: text.trim() });
    if (text.trim() === "") return updateStateNewPass({ err: "" });
  };

  const handleChangeReNewPass = (text: string) => {
    updateStateReNewPass({ value: text.trim() });
    if (text.trim() === "") return updateStateReNewPass({ err: "" });
  };

  const handleCheck = () => {
    if (stateNewPass.value && !passwordRegex.test(stateNewPass.value)) {
      updateStateNewPass({
        err: "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái viết hoa, chữ cái viết thường, số và ký tự đặc biệt",
      });
    } else {
      updateStateNewPass({ err: "" });
    }

    if (
      stateReNewPass.value !== "" &&
      stateReNewPass.value !== stateNewPass.value
    ) {
      updateStateReNewPass({ err: "Mật khẩu không khớp" });
    } else {
      updateStateReNewPass({ err: "" });
    }

    if (
      stateOldPass.value !== "" &&
      stateOldPass.value === stateNewPass.value
    ) {
      updateStateNewPass({
        err: "Mật khẩu mới không được trùng với mật khẩu cũ",
      });
    } else {
      updateStateNewPass({ err: "" });
    }

    if (stateOldPass.value !== "") {
      updateStateOldPass({ err: "" });
    }
  };

  useEffect(() => {
    handleCheck();
  }, [stateOldPass.value, stateNewPass.value, stateReNewPass.value]);

  useEffect(() => {
    if (!openModal) {
      updateStateNewPass({ value: "" });
      updateStateOldPass({ value: "" });
      updateStateReNewPass({ value: "" });
      updateStateOldPass({ err: "" });
    }
  }, [openModal]);

  const handleSumbit = async () => {
    try {
      //  call api here
      const res = await authApi.changePassword(
        token,
        stateNewPass.value,
        stateOldPass.value
      );
      console.log(res);

      toast.success("Đổi mật khẩu thành công");
      updateStateNewPass({ value: "" });
      updateStateOldPass({ value: "" });
      updateStateReNewPass({ value: "" });
      closeModal();
    } catch (error) {
      updateStateOldPass({ err: "Mật khẩu không đúng" });
    }
  };

  return (
    <div className="Setting-password__modal">
      <span className="Setting-password__modal__desc">
        Mật khẩu của bạn phải có tối thiểu 6 ký tự, đồng thời bao gồm cả chữ số,
        chữ cái và ký tự đặc biệt (!$@%).
      </span>
      <form action="">
        <div className="Setting-password__modal__group">
          <div
            className={`Setting-password__modal__group__input ${
              stateOldPass?.err ? "err" : ""
            }`}
          >
            <input
              autoComplete="off"
              placeholder=" "
              type={stateOldPass.view ? "text" : "password"}
              id="oldPass"
              value={stateOldPass.value}
              onChange={(e) => handleChangeOldPass(e.target.value)}
            />
            <label htmlFor="oldPass">Mật khẩu hiện tại</label>
            {stateOldPass.value && (
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
            )}
          </div>
          {stateOldPass?.err && (
            <div className="Setting-password__modal__group__error">
              <i className="fa-light fa-circle-exclamation"></i>
              <span>{stateOldPass?.err}</span>
            </div>
          )}
        </div>
        <div className="Setting-password__modal__group">
          <div
            className={`Setting-password__modal__group__input ${
              stateNewPass?.err ? "err" : ""
            }`}
          >
            <input
              autoComplete="off"
              placeholder=" "
              type={stateNewPass.view ? "text" : "password"}
              id="newPass"
              value={stateNewPass.value}
              onChange={(e) => handleChangeNewPass(e.target.value)}
            />
            <label htmlFor="newPass">Mật khẩu mới (tối thiểu 6 ký tự)</label>
            {stateNewPass.value && (
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
            )}
          </div>
          {stateNewPass?.err && (
            <div className="Setting-password__modal__group__error">
              <i className="fa-light fa-circle-exclamation"></i>
              <span>{stateNewPass?.err}</span>
            </div>
          )}
        </div>
        <div className="Setting-password__modal__group">
          <div
            className={`Setting-password__modal__group__input ${
              stateReNewPass?.err ? "err" : ""
            }`}
          >
            <input
              autoComplete="off"
              placeholder=" "
              type={stateReNewPass.view ? "text" : "password"}
              id="reNewPass"
              value={stateReNewPass.value}
              onChange={(e) => handleChangeReNewPass(e.target.value)}
            />
            <label htmlFor="reNewPass">Xác nhận mật khẩu mới của bạn</label>
            {stateReNewPass.value && (
              <button
                onClick={() =>
                  setStateReNewPass({
                    ...stateReNewPass,
                    view: !stateReNewPass.view,
                  })
                }
              >
                {stateReNewPass.view ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </button>
            )}
          </div>
          {stateReNewPass?.err && (
            <div className="Setting-password__modal__group__error">
              <i className="fa-light fa-circle-exclamation"></i>
              <span>{stateReNewPass?.err}</span>
            </div>
          )}
        </div>
      </form>

      <a className="Setting-password__modal__forget" href="">
        Bạn quên mật khẩu ư?
      </a>
      <button
        onClick={() => handleSumbit()}
        disabled={
          stateOldPass.err ||
          stateNewPass.err ||
          stateReNewPass.err ||
          !stateOldPass.value ||
          !stateNewPass.value ||
          !stateReNewPass.value
            ? true
            : false
        }
        className="btn-submit"
      >
        Save
      </button>
    </div>
  );
};

const ModalChangeEmail = ({
  openModal,
  closeModal,
}: {
  openModal: boolean;
  closeModal: () => void;
}) => {
  const [verify, setVerify] = React.useState(false);
  const [state, setState] = React.useState<TInput>({
    value: "",
    err: "",
    view: false,
    loading: false,
  });

  const [stateCode, setStateCode] = React.useState<TInput>({
    value: "",
    err: "",
    view: false,
    loading: false,
  });
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const updateState = (newState: Partial<TInput>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const updateStateCode = (newState: Partial<TInput>) => {
    setStateCode((prevState) => ({ ...prevState, ...newState }));
  };

  const handleSubmit = async () => {
    console.log("send email");
    updateState({ err: "" });
    try {
      updateState({ loading: true });
      await authApi.checkEmail(state.value);
      await authApi.sendVerifyEmail(token, state.value);

      setVerify(true);
      updateState({ loading: false });
    } catch (error) {
      updateState({ err: "Email đã tồn tại" });
      updateState({ loading: false });
    }
  };

  const handleSubmitCode = async () => {
    try {
      if (stateCode.value.length !== 4)
        return updateStateCode({ err: "Mã xác nhận không hợp lệ" });
      updateStateCode({ loading: true });
      const res = await authApi.verifyEmail(
        token,
        state.value,
        stateCode.value
      );
      console.log(res);
      if (res.success) {
        toast.success("Thay đổi email thành công");
        await userApi.update(token, {
          email: state.value,
        });
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        setVerify(false);
        closeModal();
      } else {
        updateStateCode({ err: "Mã xác nhận không đúng" });
      }
      updateStateCode({ loading: false });
    } catch (error) {
      updateStateCode({ err: "Mã xác nhận không đúng" });
    }
    updateStateCode({ loading: false });
  };

  const handleChange = (text: string) => {
    updateState({ value: text.trim() });
    updateState({ err: "" });
  };

  const handleChangeCode = (text: string) => {
    updateStateCode({ value: text.trim() });
    updateStateCode({ err: "" });
  };

  useEffect(() => {
    if (!openModal) {
      setVerify(false);
      updateState({ value: "", err: "", loading: false });
      updateStateCode({ value: "", err: "", loading: false });
    }
  }, [openModal]);

  return (
    <div className="Setting-email__modal">
      <span className="Setting-password__modal__desc">
        {verify
          ? "Mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra email và nhập mã xác nhận."
          : "Để thay đổi email, vui lòng nhập email mới của bạn."}
      </span>
      {!verify ? (
        <div>
          <div className="Setting-email__modal__group">
            <div
              className={`Setting-email__modal__group__input ${
                state.err ? "err" : ""
              }`}
            >
              <input
                placeholder=" "
                type="text"
                id="email"
                value={state.value}
                autoComplete="off"
                onChange={(e) => handleChange(e.target.value.trim())}
              />
              <label htmlFor="newEmail">Email mới</label>
              {state?.value && (
                <button onClick={() => updateState({ value: "" })}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
            {state.err && (
              <div className="Setting-email__modal__group__error">
                <i className="fa-light fa-circle-exclamation"></i>
                <span>{state?.err}</span>
              </div>
            )}
          </div>
          <button
            className="btn-submit"
            disabled={state.loading || !state.value || state.err ? true : false}
            onClick={handleSubmit}
          >
            {state.loading ? <div className="spinner"></div> : "Tiếp"}
          </button>
        </div>
      ) : (
        <div>
          <div className="Setting-email__modal__group">
            <div
              className={`Setting-email__modal__group__input ${
                stateCode.err ? "err" : ""
              }`}
            >
              <input
                placeholder=" "
                type="text"
                id="code"
                value={stateCode.value}
                autoComplete="off"
                onChange={(e) => handleChangeCode(e.target.value.trim())}
              />
              <label htmlFor="code">Nhập mã xác nhận</label>
              {stateCode.value && (
                <button onClick={() => updateStateCode({ value: "" })}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
            {stateCode.err && (
              <div className="Setting-email__modal__group__error">
                <i className="fa-light fa-circle-exclamation"></i>
                <span>{stateCode?.err}</span>
              </div>
            )}
          </div>
          <div
            className="Setting-email__modal__resend"
            onClick={() => !state.loading && handleSubmit()}
          >
            {state.loading ? (
              <div className="spinner"></div>
            ) : (
              <span>Gửi lại mã</span>
            )}
          </div>
          <button
            className="btn-submit"
            disabled={
              stateCode.loading || !stateCode.value || stateCode.err
                ? true
                : false
            }
            onClick={handleSubmitCode}
          >
            {stateCode.loading ? <div className="spinner"></div> : "Gửi"}
          </button>
        </div>
      )}
    </div>
  );
};
