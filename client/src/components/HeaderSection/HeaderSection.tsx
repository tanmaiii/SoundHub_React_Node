import React from "react";
import "./headerSection.scss";
import { Link } from "react-router-dom";

interface HeaderSectionProps {
  title: string;
  to?: string;
}

export default function HeaderSection({ title, to }: HeaderSectionProps) {
  return (
    <div className="HeaderSection">
      <h4 className="HeaderSection__title">{title}</h4>
      <button className="HeaderSection__button">
        <Link to={`${to}`}>Tất cả</Link>
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
}
