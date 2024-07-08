import React from "react";
import "./style.scss";

type Props = {
  id: string;
  active: boolean;
};

const PlaylistMenu = () => {
  return (
    <div className="PlaylistMenu">
      <div className="PlaylistMenu__context">
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default PlaylistMenu;
