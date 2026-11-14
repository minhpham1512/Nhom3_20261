import { z } from "zod";
import { dateString } from "../../lib/schemas.js";
import { pageQuery } from "../../lib/pagination.js";

export const listCampaignsQuery = z.object({
  status: z.enum(["UPCOMING", "OPEN", "CLOSED"]).optional(),
  ...pageQuery,
});

export const campaignCreateBody = z
  .object({
    // Giới hạn 100 ký tự vì tên cũng được lưu vào khoan_thu.ten_khoan_thu (VARCHAR(100)).
    name: z.string().trim().min(1, "Tên đợt không được để trống").max(100),
    description: z.string().trim().optional(),
    startDate: dateString,
    endDate: dateString,
  })
  .strict()
  .refine((b) => b.endDate >= b.startDate, {
    message: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu",
    path: ["endDate"],
  });
