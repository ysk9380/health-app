import { HttpService } from "./http-service";

let accessToken: string | null = null;

export const setAccessToken = (newAccessToken: string) => {
  accessToken = newAccessToken;
};

const refreshAccessToken = async (): Promise<string> => {
  const response = await HttpService.getHttpClientInstance().patch<string>(
    "/api/users/refreshtoken",
    {},
    { withCredentials: true }
  );

  if (response.status === 200) {
    accessToken = response.data;
    return accessToken;
  } else {
    throw new Error("Failed to refresh access token");
  }
};

HttpService.getHttpClientInstance().interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

HttpService.getHttpClientInstance().interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const loginUrl = "/api/users/login";
    if (error.response.status === 401 && originalRequest.url === loginUrl) {
      return error.response;
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        console.log("New access token:", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log(
          "Updated originalRequest headers:",
          originalRequest.headers
        );
        return HttpService.getHttpClientInstance()(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
