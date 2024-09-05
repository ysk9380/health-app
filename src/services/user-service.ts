import { LoginRequest } from "../models/user";
import { HttpService } from "./http-service";

export const login = async (
  loginRequest: LoginRequest
): Promise<string | null> => {
  try {
    const response = await HttpService.getHttpClientInstance().post<string>(
      "/api/users/login",
      loginRequest
    );
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    } else {
      throw new Error("Login failed: An unknown error occurred");
    }
  }
};
