import { axiosClient } from "../../configs";
import { ListResponse, TAuthor } from "../../types";

const authorApi = {
  getAllUserConfirm(songId: string): Promise<string[]> {
    const url = "userSong/";
    return axiosClient.get(url + songId);
  },
  
  getAllUserRequest(
    token: string,
    page: number,
    limit: number,
    q?: string,
    sort?: string
  ): Promise<ListResponse<TAuthor>> {
    const url = "userSong/me";
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

  getDetail(token: string, userId: string, songId: string): Promise<TAuthor> {
    const url = `userSong/detail`;
    return axiosClient.get(url, {
      params: { userId: userId, songId: songId },
      headers: {
        authorization: token,
      },
    });
  },

  //Xác nhận yêu cầu
  confirmRequest(token: string, songId: string): Promise<void> {
    const url = `userSong/${songId}/confirm`;
    return axiosClient.put(url, undefined, {
      headers: {
        authorization: token,
      },
    });
  },

  //Từ chối yêu cầu
  rejectRequest(token: string, songId: string): Promise<void> {
    const url = `userSong/${songId}/confirm`;
    return axiosClient.delete(url, {
      headers: {
        authorization: token,
      },
    });
  },
};

export default authorApi;
