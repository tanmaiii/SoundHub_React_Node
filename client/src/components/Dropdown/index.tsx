import React, { useEffect } from "react";
import "./style.scss";
import { useTranslation } from "react-i18next";

type props = {
  title: string;
  options: Array<{ id: string; title: string }>;
  defaultSelected: string;
  changeSelected: (selected: { id: string; title: string }) => void;
  search?: boolean;
};

const Dropdown = ({
  title,
  options,
  search = false,
  defaultSelected,
  changeSelected,
}: props) => {
  const [activeDropdown, setActiveDropdown] = React.useState<boolean>(false);
  const { t } = useTranslation("playlist");
  const [selected, setSelected] = React.useState<{ id: string; title: string }>(
    options[1]
  );
  const DropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        DropdownRef.current &&
        !DropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {    
    changeSelected(selected);
    setActiveDropdown(false);
  }, [selected]);

  useEffect(() => {
    // console.log(options.find((option) => option?.id === defaultSelected));
    setSelected(
      options.find((option) => option?.id === defaultSelected) || {
        title: "",
        id: "",
      }
    );
  }, [defaultSelected]);

  return (
    <div className="Dropdown" ref={DropdownRef}>
      <div className="Dropdown__header">
        <input
          type="text"
          placeholder="  "
          //   onFocus={() => setActiveDropdown(!activeDropdown)}
          value={selected?.title}
          readOnly
          onClick={() => setActiveDropdown(!activeDropdown)}
        />
        <label>{title}</label>
        <button
          className={`${activeDropdown ? "active" : ""}`}
          onClick={() => setActiveDropdown(!activeDropdown)}
        >
          <i className="fa-regular fa-chevron-down"></i>
        </button>
      </div>
      <div className={`Dropdown__body ${activeDropdown ? "active" : ""}`}>
        {options?.length > 1 &&
          options?.map((option, index) => {
            return (
              <label
                key={index}
                htmlFor={`${title}${option?.id}`}
                className="Dropdown__body__item"
              >
                <input
                  type="radio"
                  id={`${title}${option?.id}`}
                  name={`${title}`}
                  checked={option?.id === selected?.id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.checked && setSelected(option);
                  }}
                />
                <span>{option?.title}</span>
              </label>
            );
          })}
      </div>
    </div>
  );
};

export default Dropdown;
