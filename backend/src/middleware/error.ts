import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../lib/errors.js";

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, "RESOURCE_NOT_FOUND", "Không tìm thấy đường dẫn yêu cầu."));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    // Lỗi validate: swagger đặt `fields` ngang hàng với code/message.
    if (err.code === "VALIDATION_ERROR") {
      res.status(400).json({ code: err.code, message: err.message, fields: err.details?.fields });
      return;
    }
    res.status(err.status).json({ code: err.code, message: err.message, details: err.details });
    return;
  }
  // JSON body hỏng
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ code: "VALIDATION_ERROR", message: "Nội dung JSON không hợp lệ.", fields: [] });
    return;
  }
  console.error(err);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Lỗi hệ thống." });
};
