import { axiosClient } from "../../configs";
import { ListResponse, TAuthor } from "../../types";

const authorApi = {
  getAllUser(
    songId: string,
    token: string,
    page: number,
    limit: number,
    q?: string,
    sort?: "new" | "old",
    status?: "Pending" | "Accepted" | "Rejected" | "all"
  ): Promise<ListResponse<TAuthor>> {
    const url = `userSong/${songId}/all`;
    return axiosClient.get(url, {
      headers: {
        authorization: token,
      },
      params: {
        page: page,
        limit: limit,
        q: q,
        sortBy: sort,
        status: status,
      },
    });
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

  //Tao yeu cau
  createRequest(token: string, songId: string, userId: string): Promise<void> {
    const url = `userSong/`;
    return axiosClient.post(
      url,
      {
        songId: songId,
        userId: userId,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
  },

  //Xóa yêu cầu
  deleteAuthor(token: string, songId: string, userId: string): Promise<void> {
    const url = `userSong/`;
    return axiosClient.delete(url, {
      params: { userId: userId, songId: songId },
      headers: {
        authorization: token,
      },
    });
  },
};

export default authorApi;
