import { isAxiosError } from "axios";
import z from "zod";

export async function fetchAndValidate<T>(
  request: () => Promise<{ data: unknown }>,
  schema: z.ZodType<T>,
  errorMessage: string
): Promise<T> {
  const response = await request();

  const result = await schema.safeParseAsync(response.data);

  if (!result.success) throw new Error(errorMessage);
  return result.data;
}

export function catchAndValidateError(error: unknown) {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (error.response?.status === 400) {
      throw new Error(message || "Error en el formato de los datos");
    }
    throw new Error(message || "Error del servidor");
  }
  throw new Error("Error inesperado");
}
