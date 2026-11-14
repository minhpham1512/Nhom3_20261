// Mã lỗi ổn định theo bảng trong doc/swagger.yaml.
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export const notFound = (what = "dữ liệu yêu cầu") =>
  new AppError(404, "RESOURCE_NOT_FOUND", `Không tìm thấy ${what}.`);
