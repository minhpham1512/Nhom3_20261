import { z } from "zod";
import { parseDateOnly, toDateOnly } from "./dates.js";

// Ngày dạng YYYY-MM-DD và phải là ngày có thật (không nhận 2026-02-30).
export const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải có dạng YYYY-MM-DD")
  .refine((s) => toDateOnly(parseDateOnly(s)) === s, "Ngày không hợp lệ");

export const money = z.number().int("Đơn giá phải là số nguyên").min(0, "Đơn giá không được âm");

export const idParam = z.coerce.number().int().min(1);
