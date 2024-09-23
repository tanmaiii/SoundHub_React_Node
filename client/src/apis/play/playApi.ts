import { ListResponse, TSong } from "../../types";
import { axiosClient } from "../../configs";

const playApi = {
  playSong(songId: string, token: string): Promise<TSong> {
    const url = "songPlay/";
    return axiosClient.post(url + songId, undefined, {
      headers: {
        authorization: token,
      },
    });
  },
  getCountPlay(songId: string): Promise<number> {
    const url = "songPlay/";
    return axiosClient.get(url + songId + "/count");
  },
  getAllSongRecently(
    token: string,
    page: number,
    limit: number,
    q?: string,
    sort?: string
  ): Promise<ListResponse<TSong>> {
    const url = "songPlay/";
    return axiosClient.get(url, {
      params: {
        page: page,
        limit: limit,
        sortBy: sort,
        q: q,
      },
      headers: {
        authorization: token,
      },
    });
  },
};

export default playApi;
