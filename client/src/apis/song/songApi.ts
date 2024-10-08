import { TUser } from "./../../types/user.type";
import { ListResponse, TSong } from "../../types";
import { axiosClient } from "../../configs";

interface CheckLikedResponse {
  isLiked: boolean;
}

const songApi = {
  createSong(token: string, body: TSong): Promise<{ id: string }> {
    const url = "song";
    return axiosClient.post(url, body, {
      headers: {
        authorization: token,
      },
    });
  },
  updateSong(token: string, songId: string, body: any) {
    // Update song
    const url = "song/";
    return axiosClient.put(url + songId, body, {
      headers: {
        authorization: token,
      },
    });
  },
  deleteSong(token: string, songId: string) {
    const url = "song/delete/";
    return axiosClient.patch(
      url + songId,
      {},
      {
        headers: {
          authorization: token,
        },
      }
    );
  },
  getAll(
    page: number,
    limit: number,
    q?: string,
    sort?: string
  ): Promise<ListResponse<TSong>> {
    const url = "song";
    return axiosClient.get(url, {
      params: {
        page: page,
        limit: limit,
        q: q,
        sortBy: sort,
      },
    });
  },
  getDetail(songId: string, token: string): Promise<TSong> {
    const url = "song/detail/";
    return axiosClient.get(url + songId, {
      headers: {
        authorization: token,
      },
    });
  },
  getAllByUserId(
    token: string,
    userId: string,
    page: number,
    limit: number,
    q?: string,
    sort?: string
  ): Promise<ListResponse<TSong>> {
    const url = "song/user/";
    return axiosClient.get(url + userId, {
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
  getAllByPlaylistId(
    token: string,
    playlistId: string,
    page: number,
    limit: number,
    q?: string,
    sort?: string
  ): Promise<ListResponse<TSong>> {
    const url = `song/playlist/${playlistId}`;
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
  getAllFavoritesByUser(
    userId: string,
    page: number,
    limit: number,
    q?: string,
    sort?: string
  ): Promise<ListResponse<TSong>> {
    const url = `song/like/${userId}`;
    return axiosClient.get(url, {
      params: {
        page: page,
        limit: limit,
        sortBy: sort,
        q: q,
      },
    });
  },
  getAllArtistInSong(songId: string, token: string): Promise<TUser[]> {
    const url = "userSong/";
    return axiosClient.post(url + songId, { token });
  },
  checkLikedSong(songId: string, token: string): Promise<CheckLikedResponse> {
    const url = "song/checkLiked/";
    return axiosClient.get(url + songId, {
      headers: {
        authorization: token,
      },
    });
  },
  likeSong(songId: string, token: string) {
    const url = "song/like/";
    return axiosClient.post(url + songId, undefined, {
      headers: {
        authorization: token,
      },
    });
  },
  unLikeSong(songId: string, token: string) {
    const url = "song/like/";
    return axiosClient.delete(url + songId, {
      headers: {
        authorization: token,
      },
    });
  },
};

export default songApi;
