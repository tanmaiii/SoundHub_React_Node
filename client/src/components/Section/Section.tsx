import React, { useEffect } from "react";
import HeaderSection from "../HeaderSection/HeaderSection";
import "./section.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface SectionProps {
  children: React.ReactNode;
  title: string;
  to?: string;
  colunm?: number;
}

function Section({ children, title, to, colunm = 6 }: SectionProps) {
  const openWatting = useSelector((state: RootState) => state.waiting.state);

  return (
    <div className="section">
      <HeaderSection title={title} to={to} />
      <div className="section__main">
        <div className="section__main__slide">
          {React.Children.map(children, (child, index) => {
            if (index < colunm) {
              return (
                <div
                  className={
                    colunm === 6
                      ? "pc-2 t-3 m-4"
                      : colunm === 4
                      ? "pc-3 t-4 m-4"
                      : "pc-2 t-3 m-4"
                  }
                >
                  {child}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default Section;
