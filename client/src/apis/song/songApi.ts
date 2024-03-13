import { ListResponse, TSong } from "../../model";
import axiosClient from "../axiosClient";

const songApi = {
  getAll(): Promise<ListResponse<TSong>> {
    const url = "song";
    return axiosClient.get(url, {
      params: {
        page: 1,
        limit: 4,
      },
    });
  },
};

export default songApi;
