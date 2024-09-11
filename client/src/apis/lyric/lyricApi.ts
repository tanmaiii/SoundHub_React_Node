import axiosClient from "../../configs/axios/axiosClient";

const lyricApi = {
  upload: (formdata: any, token: string): Promise<{ lyric: string }> => {
    const url = "lyric";
    return axiosClient.post(url, formdata, {
      headers: { "Content-Type": "multipart/form-data", authorization: token },
    });
  },
  delete: (fileName: string, token: string) => {
    const url = "lyric";
    return axiosClient.delete(url, {
      data: {
        fileName: fileName,
      },
      headers: {
        authorization: token,
      },
    });
  },
  getLyric: (
    songId: string,
    token: string
  ): Promise<{ time: number; text: string }[]> => {
    const url = "lyric/";
    return axiosClient.get(url + songId, {
      headers: {
        authorization: token,
      },
    });
  },
};

export default lyricApi;
