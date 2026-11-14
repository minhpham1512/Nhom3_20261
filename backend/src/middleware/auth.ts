import type { RequestHandler } from "express";
import { AppError } from "../lib/errors.js";

export type Role = "ADMIN" | "KE_TOAN" | "CAN_BO_CU_DAN" | "TRUONG_BQT";
const ROLES: Role[] = ["ADMIN", "KE_TOAN", "CAN_BO_CU_DAN", "TRUONG_BQT"];

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number | null; role: Role };
  }
}

// TẠM THỜI: chưa có đăng nhập (nhánh feature/auth-account-management làm sau).
// Đọc vai trò từ header X-Dev-Role, người thao tác từ X-Dev-User-Id (tuỳ chọn).
// Khi có auth thật, chỉ cần thay middleware này bằng middleware đọc session cookie.
export const authenticate: RequestHandler = (req, _res, next) => {
  const role = req.header("x-dev-role") as Role | undefined;
  if (!role || !ROLES.includes(role)) {
    throw new AppError(401, "UNAUTHORIZED", "Chưa đăng nhập hoặc phiên không hợp lệ.");
  }
  const id = Number(req.header("x-dev-user-id"));
  req.user = { id: Number.isInteger(id) && id > 0 ? id : null, role };
  next();
};

export const requireRoles =
  (...allowed: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      throw new AppError(403, "FORBIDDEN", "Bạn không đủ quyền thực hiện thao tác này.");
    }
    next();
  };
