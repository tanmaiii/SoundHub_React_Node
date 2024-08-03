import { axiosClient } from "../../configs";

const authorApi = {
  getAllUserConfirm(songId: string): Promise<string[]> {
    const url = "userSong/";
    return axiosClient.get(url + songId);
  },
};

export default authorApi;
