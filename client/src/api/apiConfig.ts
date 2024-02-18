const baseURL = process.env.REACT_APP_API_URL;

const apiConfig = {
  baseUrl: `${baseURL}/api`,
  imageURL: (imgPath: string) => `${baseURL}/api/image/${imgPath}`,
  mp3Url: (mp3Path: string) => `${baseURL}/api/mp3/${mp3Path}`,
};

export default apiConfig;
