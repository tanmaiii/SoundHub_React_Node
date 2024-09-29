import { axiosClient } from "../../configs";
import { ListResponse } from "../../types";

const commentApi = {
  getAllComments(
    songId: string,
    token: string,
    page: number,
    limit: number,
    q?: string,
    sort?: string
  ): Promise<ListResponse<any>> {
    const url = "comment/";
    return axiosClient.get(url + songId, {
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
  checkLiked(commentId: string, token: string):Promise<{isLiked: boolean}> {
    const url = "comment/check-like/";
    return axiosClient.get(url + commentId, {
      headers: {
        authorization: token,
      },
    });
  },
  like(commentId: string, token: string) {
    const url = "comment/like/";
    return axiosClient.post(url + commentId, undefined, {
      headers: { authorization: token },
    });
  },
  unLike(commentId: string, token: string) {
    const url = "comment/like/";
    return axiosClient.delete(url + commentId, {
      headers: {
        authorization: token,
      },
    });
  },
};

export default commentApi;
