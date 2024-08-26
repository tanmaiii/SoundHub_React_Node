import axiosClient from "../../configs/axios/axiosClient";

const imageApi = {
  upload: (formdata: any, token: string): Promise<{ image: string }> => {
    const url = "image";
    return axiosClient.post(url, formdata, {
      headers: { "Content-Type": "multipart/form-data", authorization: token },
    });
  },
  delete: (fileName: string, token: string) => {
    const url = "image";
    return axiosClient.delete(url, {
      data: {
        fileName: fileName,
      },
      headers: {
        authorization: token,
      },
    });
  },
};

export default imageApi;
