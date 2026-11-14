import { z } from "zod";
import { dateString, money } from "../../lib/schemas.js";
import { pageQuery } from "../../lib/pagination.js";

export const feeStatus = z.enum(["HOAT_DONG", "NGUNG_AP_DUNG"]);

export const listFeesQuery = z.object({ status: feeStatus.optional(), ...pageQuery });

export const feeCreateBody = z
  .object({
    name: z.string().trim().min(1, "Tên khoản thu không được để trống").max(100),
    type: z.literal("BAT_BUOC"),
    category: z.enum(["SERVICE_FEE", "OTHER"]),
    unitPrice: money,
    unit: z.literal("VND/m2/thang"),
    billingCycle: z.literal("MONTHLY"),
    effectiveFrom: dateString,
    confirmPriceWarning: z.boolean().default(false),
  })
  .strict();

export const feeUpdateBody = z
  .object({
    name: z.string().trim().min(1, "Tên khoản thu không được để trống").max(100),
    unitPrice: money,
    effectiveFrom: dateString,
    confirmPriceWarning: z.boolean(),
  })
  .partial()
  .strict()
  .refine((b) => Object.keys(b).length > 0, "Cần gửi ít nhất một trường")
  .refine((b) => b.unitPrice === undefined || b.effectiveFrom !== undefined, {
    message: "effectiveFrom là bắt buộc khi đổi đơn giá",
    path: ["effectiveFrom"],
  });

export const feeStatusBody = z.object({ status: feeStatus }).strict();
