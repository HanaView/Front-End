import Axios from "axios";
import { SERVER_URL } from "@/common/config";

const createAxiosInstance = (isMock) => {
  return Axios.create({
    baseURL: SERVER_URL,
    timeout: 1000
  });
};

const instance = createAxiosInstance(false);

instance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("ACCESS_TOKEN");

    config.headers["Content-Type"] = "application/json";
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 404) {
      // Handle 404
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 403) {
      // Handle token refresh logic here
      // isTokenExpired() - A function to check if the token is expired
      // tokenRefresh() - A function to refresh the token

      // TODO: 토큰 리프레쉬 함수 추가
      // if (isTokenExpired()) await tokenRefresh();

      // const accessToken = getToken();

      error.config.headers = {
        "Content-Type": "application/json"
        // TODO: 리프레쉬 토큰 추가하면 주석 해제
        // Authorization: `Bearer ${accessToken}`
      };

      // Retry the request with new token
      const response = await Axios.request(error.config);
      return response;
    }
    return Promise.reject(error);
  }
);

const onRequest = async ({ method, url, data = "", mock = false }) => {
  const axiosInstance = createAxiosInstance(mock);

  try {
    const res = await axiosInstance.request({ method, url, data });
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export default onRequest;
