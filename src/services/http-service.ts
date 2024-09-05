import axios, { AxiosInstance } from "axios";

let httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const HttpService = {
  getHttpClientInstance: (): AxiosInstance => {
    return httpClient;
  },
};
