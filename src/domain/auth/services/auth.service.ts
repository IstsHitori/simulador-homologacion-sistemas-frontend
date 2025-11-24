import { axiosPrivate, axiosPublic } from "@/config/axios";
import {
  userProfileSchema,
  type LoginPayload,
  type LoginResponse,
} from "../types";
import { catchAndValidateError, fetchAndValidate } from "@/shared/helpers";

export const loginAuth = async (payload: LoginPayload) => {
  try {
    const response = await axiosPublic.post<LoginResponse>(
      "/auth/login",
      payload
    );
    return response.data.token as string;
  } catch (error) {
    
    catchAndValidateError(error);
  }
};

export const getUserProfile = async () => {
  try {
    return await fetchAndValidate(
      () => axiosPrivate.get("/auth/profile"),
      userProfileSchema,
      "Error en obtener los datos del perfil"
    );
  } catch (error) {
    catchAndValidateError(error);
  }
};
