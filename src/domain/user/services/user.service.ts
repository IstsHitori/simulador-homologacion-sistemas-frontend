import { axiosPrivate } from "@/config/axios";
import { catchAndValidateError, fetchAndValidate } from "@/shared/helpers";
import {
  userListSchema,
  userSchema,
  type CreateUserDto,
  type UpdateUserDto,
  type User,
} from "../types";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await fetchAndValidate(
      () => axiosPrivate.get("/user"),
      userListSchema,
      "Error al obtener la lista de usuarios"
    );
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    return await fetchAndValidate(
      () => axiosPrivate.get(`/user/${id}`),
      userSchema,
      "Error al obtener el usuario"
    );
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};

export const createUser = async (data: CreateUserDto): Promise<string> => {
  try {
    const response = await axiosPrivate.post("/user", data);
    return response.data;
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  data: UpdateUserDto
): Promise<string> => {
  try {
    const response = await axiosPrivate.patch(`/user/${id}`, data);
    return response.data;
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<string> => {
  try {
    const response = await axiosPrivate.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};
