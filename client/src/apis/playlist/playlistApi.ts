import { axiosClient } from "../../configs";
import { ListResponse, TPlaylist } from "../../types";

interface CheckLikedResponse {
  isLiked: boolean;
}

const playlistApi = {
  createPlaylist(
    token: string,
    body: TPlaylist
  ): Promise<{ id: string; title: string; isPublic: number }> {
    const url = "playlist";
    return axiosClient.post(url, body, {
      headers: {
        authorization: token,
      },
    });
  },
  updatePlaylist(token: string, playlistId: string, body: TPlaylist) {
    const url = "playlist/";
    return axiosClient.put(url + playlistId, body, {
      headers: {
        authorization: token,
      },
    });
  },
  deletePlaylist(token: string, playlistId: string) {
    const url = "playlist/delete/";
    return axiosClient.patch(
      url + playlistId,
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
  ): Promise<ListResponse<TPlaylist>> {
    const url = "playlist";
    return axiosClient.get(url, {
      params: {
        page: page,
        limit: limit,
        q: q,
        sortBy: sort,
      },
    });
  },
  getDetail(playlistId: string, token: string): Promise<TPlaylist> {
    const url = "playlist/detail/";
    return axiosClient.get(url + playlistId, {
      headers: {
        authorization: token,
      },
    });
  },
  getAllByUserId(
    userId: string,
    page: number,
    limit: number,
    q?: string,
    sort?: string
  ): Promise<ListResponse<TPlaylist>> {
    const url = "playlist/user/";
    return axiosClient.get(url + userId, {
      params: {
        page: page,
        limit: limit,
        sortBy: sort,
        q: q,
      },
    });
  },
  getMe(
    token: string,
    page: number,
    limit: number,
    sort?: string,
    q?: string
  ): Promise<ListResponse<TPlaylist>> {
    const url = "playlist/me";
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
  checkLikedPlaylist(
    playlistId: string,
    token: string
  ): Promise<CheckLikedResponse> {
    const url = "playlist/checkLiked/";
    return axiosClient.get(url + playlistId, {
      headers: {
        authorization: token,
      },
    });
  },
  likePlaylist(playlistId: string, token: string) {
    const url = "playlist/like/";
    return axiosClient.post(url + playlistId, undefined, {
      headers: {
        authorization: token,
      },
    });
  },
  unLikePlaylist(playlistId: string, token: string) {
    const url = "playlist/like/";
    return axiosClient.delete(url + playlistId, {
      headers: {
        authorization: token,
      },
    });
  },
  countLikes(playlistId: string, token: string): Promise<number> {
    const url = "playlist/like/";
    return axiosClient.get(url + playlistId, {
      headers: {
        authorization: token,
      },
    });
  },
  checkSongInPlaylist(
    playlistId: string,
    songId: string,
    token: string
  ): Promise<{ isAdd: boolean }> {
    const url = "playlist/checkSong";
    return axiosClient.post(
      url,
      { song_id: songId, playlist_id: playlistId },
      {
        headers: {
          authorization: token,
        },
      }
    );
  },
  addSong(playlistId: string, songId: string, token: string) {
    const url = "playlist/song/";
    return axiosClient.post(
      url,
      {
        song_id: songId,
        playlist_id: playlistId,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
  },
  removeSong(playlistId: string, songId: string, token: string) {
    const url = "playlist/song/";
    return axiosClient.delete(url, {
      data: {
        song_id: songId,
        playlist_id: playlistId,
      },
      headers: {
        authorization: token,
      },
    });
  },
  updateSong(
    token: string,
    playlistId: string,
    songs: { id: string; num_song: number }[]
  ) {
    const url = "playlist/song/";
    return axiosClient.put(
      url + playlistId,
      {
        songs: songs,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
  },
};

export default playlistApi;
