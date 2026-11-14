import type { ZodType } from "zod";
import { AppError } from "../lib/errors.js";

// Parse dữ liệu bằng zod; lỗi trả về dạng { code, message, fields: [{field, message}] } của swagger.
export function parse<T>(schema: ZodType<T, any, any>, data: unknown, field = ""): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const fields = result.error.issues.map((i) => ({
    field: i.path.join(".") || field,
    message: i.message,
  }));
  throw new AppError(400, "VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ.", { fields });
}
