import Axios from "axios";
import { SERVER_URL } from "@/common/config";

const createAxiosInstance = (isMock) => {
  const instance = Axios.create({
    baseURL: SERVER_URL,
    timeout: 1000
  });

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
        if (isTokenExpired()) await tokenRefresh();

        const accessToken = getToken();

        error.config.headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        };

        // Retry the request with new token
        const response = await Axios.request(error.config);
        return response;
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const isTokenExpired = () => {
  const token = sessionStorage.getItem("ACCESS_TOKEN");
  if (!token) return true;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const expiry = payload.exp * 1000;
  return Date.now() > expiry;
};

const tokenRefresh = async () => {
  try {
    const refreshToken = sessionStorage.getItem("REFRESH_TOKEN");
    const response = await Axios.post(`${SERVER_URL}/auth/refresh`, {
      token: refreshToken
    });
    const newAccessToken = response.data.accessToken;

    sessionStorage.setItem("ACCESS_TOKEN", newAccessToken);
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Handle token refresh failure (e.g., logout the user)
  }
};

const getToken = () => {
  return sessionStorage.getItem("ACCESS_TOKEN");
};

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
