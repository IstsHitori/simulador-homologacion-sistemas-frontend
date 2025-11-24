import { axiosPrivate } from "@/config/axios";
import { catchAndValidateError, fetchAndValidate } from "@/shared/helpers";
import { plansResponseSchema, type PlansResponse } from "../types";

export const getAllPlans = async (): Promise<PlansResponse> => {
  try {
    return await fetchAndValidate(
      () => axiosPrivate.get("/plan"),
      plansResponseSchema,
      "Error al obtener los planes"
    );
  } catch (error) {
    catchAndValidateError(error);
    throw error;
  }
};
