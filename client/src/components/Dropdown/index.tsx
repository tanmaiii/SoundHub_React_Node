import React, { useEffect } from "react";
import "./style.scss";
import { useTranslation } from "react-i18next";

type props = {
  title: string;
  options: Array<{ id: string; title: string }>;
  defaultSelected: string;
  changeSelected: (selected: { id: string; title: string }) => void;
  search?: boolean;
  error?: string;
};

const Dropdown = ({
  title,
  options,
  search = false,
  defaultSelected,
  changeSelected,
  error,
}: props) => {
  const [activeDropdown, setActiveDropdown] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<{
    id: string;
    title: string;
  } | null>(null);
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
    selected && changeSelected(selected);
    setActiveDropdown(false);
  }, [selected]);

  useEffect(() => {
    defaultSelected &&
      setSelected(
        options.find((option) => option?.id === defaultSelected) || {
          title: "",
          id: "",
        }
      );
  }, [defaultSelected]);

  return (
    <div className={`Dropdown ${error ? 'error' : ''}`} ref={DropdownRef}>
      <div className={`Dropdown__header ${error ? 'error' : ''} `}>
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
