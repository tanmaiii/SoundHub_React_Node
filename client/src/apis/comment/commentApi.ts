import { axiosClient } from "../../configs";
import { ListResponse } from "../../types";

const commentApi = {
  getAllComments(songId: string, token: string): Promise<ListResponse<any>> {
    const url = "comment/";
    return axiosClient.get(url + songId, {
      headers: {
        authorization: token,
      },
    });
  },
};

export default commentApi;
