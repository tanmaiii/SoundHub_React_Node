import React, { useEffect } from "react";
import HeaderSection from "../HeaderSection";
import "./style.scss";
import SectionSkeleton from "./SectionSkeleton";

interface SectionProps {
  children: React.ReactNode;
  title: string;
  to?: string;
  colunm?: number;
  loading?: boolean;
}

function Section({
  children,
  title,
  to,
  loading = false,
}: SectionProps) {
  if (loading) {
    return <SectionSkeleton />;
  }

  return (
    <div className="section">
      <HeaderSection title={title} to={to && to} />
      <div className="section__main">
        <div className="section__main__slide row">
          {React.Children.map(children, (child, index) => {
            if (child === null) return null;
            return <div className={"pc-2 t-3 m-6"}>{child}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default Section;
