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
            <span>{t("security.desc")}</span>
          </div>
          <div className="Setting-password__content__body">
            <div
              className="Setting-password__content__body__item"
              onClick={() => setOpenModal(true)}
            >
              <div className="Setting-password__content__body__item__title">
                <h4>{t("security.titleChangePassword")}</h4>
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
                <h4>{t("security.email")}</h4>
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
        title={t("security.titleChangePassword")}
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
  const { t } = useTranslation("settings");
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
        err: t("security.errNewPassword"),
      });
    } else if (
      stateOldPass.value !== "" &&
      stateOldPass.value === stateNewPass.value
    ) {
      updateStateNewPass({
        err: t("security.errNewPasswordMatch"),
      });
    } else {
      updateStateNewPass({ err: "" });
    }

    if (
      stateReNewPass.value !== "" &&
      stateReNewPass.value !== stateNewPass.value
    ) {
      updateStateReNewPass({ err: t("security.errConfirmPassword") });
    } else {
      updateStateReNewPass({ err: "" });
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

      toast.success(t("notify.updateSuccess"));
      updateStateNewPass({ value: "" });
      updateStateOldPass({ value: "" });
      updateStateReNewPass({ value: "" });
      closeModal();
    } catch (error) {
      updateStateOldPass({ err: t("security.errOldPassword") });
    }
  };

  return (
    <div className="Setting-password__modal">
      <span className="Setting-password__modal__desc">
        {t("security.descChangePassword")}
      </span>
      <div>
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
            <label htmlFor="oldPass">{t("security.currentPassword")}</label>
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
            <label htmlFor="newPass">{t("security.newPassword")}</label>
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
            <label htmlFor="reNewPass">{t("security.confirmPassword")}</label>
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
      </div>

      <a className="Setting-password__modal__forget" href="">
        {t("security.forgotPassword")}
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
        {t("button.save")}
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
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const { token } = useAuth();
  const { t } = useTranslation("settings");

  const updateState = (newState: Partial<TInput>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const updateStateCode = (newState: Partial<TInput>) => {
    setStateCode((prevState) => ({ ...prevState, ...newState }));
  };

  const handleSubmit = async () => {
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
      updateStateCode({ err: t("security.errCode") });
    }
    updateStateCode({ loading: false });
  };

  const handleChange = (text: string) => {
    updateState({ value: text.trim() });
    updateState({ err: "" });
    if (text && !emailRegex.test(text)) {
      updateState({ err: t("security.errEmail") });
    } else {
      updateState({ err: "" });
    }
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
        {verify ? t("security.descCode") : t("security.descChangeEmail")}
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
              <label htmlFor="newEmail">{t("security.newEmail")}</label>
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
            {state.loading ? <div className="spinner"></div> : t("button.next")}
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
              <label htmlFor="code">{t("security.descCode")}</label>
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
              <span>{t("security.resendCode")}</span>
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
            {stateCode.loading ? (
              <div className="spinner"></div>
            ) : (
              t("button.save")
            )}
          </button>
        </div>
      )}
    </div>
  );
};
