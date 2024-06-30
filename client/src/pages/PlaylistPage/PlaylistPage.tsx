import HeaderPage from "../../components/HeaderPage/HeaderPage";
import TableTrack from "../../components/TableTrack";
import Images from "../../constants/images";
import "./playlistPage.scss";

export default function PlaylistPage() {

  return (
    <div className="playlistPage">
      <HeaderPage
        avt={Images.AVATAR}
        title="Thằng điên"
        author="JustaTee"
        avtAuthor={Images.AVATAR}
        time="2022"
        // listen="18,714,210"
        category="Playlist"
        like="23,123"
        song="20 songs"
      />
      <div className="playlistPage__content">
        <TableTrack songs={[]} isLoading={true} />
      </div>
    </div>
  );
}
