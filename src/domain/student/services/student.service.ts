import { axiosPrivate } from "@/config/axios";
import { catchAndValidateError, fetchAndValidate } from "@/shared/helpers";
import axios from "axios";
import {
  createStudentResponseSchema,
  studentListSchema,
  studentSchema,
  studentReportSchema,
  generateReportResponseSchema,
  type CreateStudentDto,
  type CreateStudentResponse,
  type Student,
  type UpdateStudentDto,
  type GenerateReportResponse,
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

export const getStudentReport = async (
  id: string
): Promise<CreateStudentResponse> => {
  try {
    const response = await axiosPrivate.get(`/student/${id}/report`);
    const reportData = response.data;

    // Validar que tiene la estructura esperada
    const validated = await studentReportSchema.safeParseAsync(reportData);

    if (!validated.success) {
      throw new Error("Formato de respuesta inválido");
    }

    // Transformar a CreateStudentResponse
    const transformedData: CreateStudentResponse = {
      message: "Reporte obtenido exitosamente",
      student: {
        identification: validated.data.identification,
        email: validated.data.email,
        names: validated.data.names,
        lastNames: validated.data.lastNames,
        semester: validated.data.semester,
        cityResidence: validated.data.cityResidence,
        gender: validated.data.gender,
      },
      subjectsToHomologate: validated.data.subjectsToHomologate,
      subjectsToView: validated.data.subjectsToView,
    };

    return transformedData;
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};

export const generatePublicReport = async (
  data: CreateStudentDto
): Promise<GenerateReportResponse> => {
  try {
    const API_URL = import.meta.env.VITE_API_BACKEND;
    const response = await axios.post(`${API_URL}/student/report`, data);
    
    return await fetchAndValidate(
      () => Promise.resolve(response),
      generateReportResponseSchema,
      "Error al generar el reporte"
    );
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};
