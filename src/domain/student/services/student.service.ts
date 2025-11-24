import { axiosPrivate } from "@/config/axios";
import { catchAndValidateError, fetchAndValidate } from "@/shared/helpers";
import {
  createStudentResponseSchema,
  studentListSchema,
  studentSchema,
  type CreateStudentDto,
  type CreateStudentResponse,
  type Student,
  type UpdateStudentDto,
} from "../types";

export const getAllStudents = async (): Promise<Student[]> => {
  try {
    return await fetchAndValidate(
      () => axiosPrivate.get("/student"),
      studentListSchema,
      "Error al obtener la lista de estudiantes"
    );
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};

export const getStudentById = async (id: string): Promise<Student> => {
  try {
    return await fetchAndValidate(
      () => axiosPrivate.get(`/student/${id}`),
      studentSchema,
      "Error al obtener el estudiante"
    );
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};

export const createStudent = async (
  data: CreateStudentDto
): Promise<CreateStudentResponse> => {
  try {
    return await fetchAndValidate(
      () => axiosPrivate.post("/student", data),
      createStudentResponseSchema,
      "Error al crear el estudiante"
    );
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};

export const updateStudent = async (
  id: string,
  data: UpdateStudentDto
): Promise<CreateStudentResponse> => {
  try {
    return await fetchAndValidate(
      () => axiosPrivate.patch(`/student/${id}`, data),
      createStudentResponseSchema,
      "Error al actualizar el estudiante"
    );
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};

export const deleteStudent = async (id: string): Promise<string> => {
  try {
    const response = await axiosPrivate.delete(`/student/${id}`);
    return response.data;
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};
