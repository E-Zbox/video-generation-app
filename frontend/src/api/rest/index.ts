import axios from "axios";

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

export const instance = axios.create({
  baseURL: `${SERVER_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code == "ERR_NETWORK") {
      return Promise.reject(
        "Please review your connection. If the problem persists, contact developer."
      );
    }
    const { data } = error.response;

    if (data) {
      return Promise.reject(data.error);
    }

    throw error;
  }
);
