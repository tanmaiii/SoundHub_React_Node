const baseURL = process.env.REACT_APP_API_URL;

const apiConfig = {
  baseUrl: `${baseURL}/api`,
  imageURL: (imgPath: string) => `${baseURL}/image/${imgPath}`,
  mp3Url: (mp3Path: string) => `${baseURL}/mp3/${mp3Path}`,
};

export default apiConfig;
