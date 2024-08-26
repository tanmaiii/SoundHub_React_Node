import React, { useEffect } from "react";
import "./style.scss";
import { useAuth } from "../../../context/authContext";
import Modal from "../../../components/Modal";
import ImageWithFallback from "../../../components/ImageWithFallback";
import Images from "../../../constants/images";
import { imageApi, userApi } from "../../../apis";
import { toast } from "sonner";
import { EditAvatar } from "../../../components/ModalArtist";
import { useMutation, useQueryClient } from "react-query";
import moment from "moment";
import Dropdown from "../../../components/Dropdown";
import { useTranslation } from "react-i18next";
import SettingPage from "..";

const Account = () => {
  const { currentUser } = useAuth();
  const [openModalEditAvatar, setOpenModalEditAvatar] = React.useState(false);
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation("settings");

  const mutationSave = useMutation(
    async ({ name, value }: { name: string; value: string }) => {
      console.log(name, value);

      try {
        if (name === "name" && value.length < 6)
          return toast.error("Tên phải có ít nhất 6 ký tự");
        const title = name;
        await userApi.update(token, { [title]: value });
        toast.success(t("notify.updateSuccess"));
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["currentUser"]);
      },
      onError: () => {
        toast.error(t("notify.updateFail"));
      },
    }
  );

  return (
    <>
      <div className="Account">
        <div className="Account__wrapper row no-gutters">
          <div className="col pc-3 t-3 m-0">
            <div className="Account__wrapper__nav">
              <SettingPage />
            </div>
          </div>
          <div className="col pc-9 t-9 m-12">
            <div className="Account__wrapper__content">
              <div className="Account__wrapper__content__header">
                <h4>{t("account.title")}</h4>
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
                    {t("account.changeAvatar")}
                  </button>
                </div>

                <ItemAccount
                  title={t("account.name")}
                  name="name"
                  description={t("account.nameDesc")}
                  value={currentUser?.name ?? ""}
                  onSave={(name: string, value: string) =>
                    mutationSave.mutate({ name, value })
                  }
                />
                <ItemAccount
                  title={t("account.birthday")}
                  description={t("account.birthdayDesc")}
                  name="brithday"
                  value={moment(currentUser?.brithday).format("L") ?? ""}
                  onSave={(name: string, value: string) =>
                    mutationSave.mutate({ name, value })
                  }
                  date={true}
                />
                <ItemAccount
                  title={t("account.gender")}
                  description={t("account.genderDesc")}
                  name="gender"
                  radio={true}
                  value={currentUser?.gender ?? ""}
                  onSave={(name: string, value: string) =>
                    mutationSave.mutate({ name, value })
                  }
                  option={[
                    { id: "1", title: "Female" },
                    { id: "2", title: "Male" },
                    { id: "3", title: "No disclosure" },
                  ]}
                />
              </div>
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
  name,
  date = false,
  radio = false,
  option = [],
  value: valueDefault,
  description,
  onSave,
}: {
  title: string;
  name: string;
  date?: boolean;
  radio?: boolean;
  value: string;
  option?: Array<{ id: string; title: string }>;
  description?: string;
  onSave: (name: string, value: string) => void;
}) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [isFocus, setIsFocus] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState(valueDefault);
  const [error, setError] = React.useState("");
  const { t } = useTranslation("settings");

  const handleOpenEdit = () => {
    setIsEdit(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // Focus vào thẻ input khi bắt đầu chỉnh sửa
      }
    }, 0);
  };

  const handleClickSave = () => {
    if (error) return toast.error(error);
    onSave(name, value);
    setIsEdit(false);
    setError("");
  };

  const handleChangeValue = (value: string) => {
    setValue(value);
    if (name === "name" && value.length < 6) {
      setError(t("notify.errorNameLength6Char"));
    } else {
      setError("");
    }
  };

  const handleClickCancel = () => {
    setIsEdit(false);
    setError("");
    setValue(valueDefault);
  };

  return (
    <div className="Account__item">
      <h6 className="title">{title}</h6>
      <p className="desc">{description}</p>
      <div
        className={`Account__item__body ${isFocus ? "focus" : ""} ${
          error ? "error" : ""
        }`}
      >
        <div className={`Account__item__body__desc ${isEdit ? "edit" : ""}`}>
          <span>{valueDefault}</span>
          {!radio ? (
            <input
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              ref={inputRef}
              value={value}
              type={date ? "date" : "text"}
              onChange={(e) => handleChangeValue(e.target.value)}
              defaultValue={value}
              placeholder="Enter your name..."
            />
          ) : (
            <div className="Account__radio">
              {option.map((item, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={name}
                    value={item.title}
                    defaultChecked={item.title === value}
                    checked={value === item.title}
                    onChange={(e) => handleChangeValue(e.target.value)}
                  />
                  <span>{item.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="Account__item__body__buttons">
          {!isEdit ? (
            <button onClick={() => handleOpenEdit()} className="btn-edit">
              <i className="fa-solid fa-pen"></i>
            </button>
          ) : (
            !date &&
            !radio && (
              <button
                className="btn-clear"
                onClick={() => {
                  setValue("");
                  handleOpenEdit();
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )
          )}
        </div>
      </div>
      <div className="Account__item__bottom">
        {isEdit && (
          <div className="Account__item__bottom__buttons">
            <button onClick={handleClickCancel}>{t("button.cancel")}</button>
            <button onClick={handleClickSave}>{t("button.save")}</button>
          </div>
        )}
      </div>
    </div>
  );
};
