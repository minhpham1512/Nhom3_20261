import type { Prisma } from "../../../generated/prisma/client.js";
import type { z } from "zod";
import { prisma } from "../../lib/db.js";
import { notFound } from "../../lib/errors.js";
import { parseDateOnly, today, toDateOnly } from "../../lib/dates.js";
import type { campaignCreateBody } from "./campaigns.schema.js";

type CampaignStatus = "UPCOMING" | "OPEN" | "CLOSED";
type CampaignRow = Prisma.DotDongGopGetPayload<object>;

// Trạng thái không lưu trong DB mà suy ra từ ngày so với hôm nay.
function statusOf(start: Date, end: Date): CampaignStatus {
  const now = today();
  if (now < toDateOnly(start)) return "UPCOMING";
  if (now > toDateOnly(end)) return "CLOSED";
  return "OPEN";
}

function toCampaign(row: CampaignRow) {
  return {
    id: row.id,
    name: row.tenDot,
    ...(row.moTa ? { description: row.moTa } : {}),
    startDate: toDateOnly(row.ngayBatDau),
    endDate: toDateOnly(row.ngayKetThuc),
    status: statusOf(row.ngayBatDau, row.ngayKetThuc),
  };
}

// Điều kiện Prisma tương ứng với trạng thái suy ra ở trên, để lọc + phân trang ở DB.
function statusWhere(status: CampaignStatus): Prisma.DotDongGopWhereInput {
  const now = parseDateOnly(today());
  if (status === "UPCOMING") return { ngayBatDau: { gt: now } };
  if (status === "CLOSED") return { ngayKetThuc: { lt: now } };
  return { ngayBatDau: { lte: now }, ngayKetThuc: { gte: now } };
}

export async function listCampaigns(q: { status?: CampaignStatus; page: number; pageSize: number }) {
  const where = q.status ? statusWhere(q.status) : {};
  const [total, rows] = await Promise.all([
    prisma.dotDongGop.count({ where }),
    prisma.dotDongGop.findMany({
      where,
      orderBy: [{ ngayBatDau: "desc" }, { id: "desc" }],
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
    }),
  ]);
  return { page: q.page, pageSize: q.pageSize, total, items: rows.map(toCampaign) };
}

export async function getCampaign(id: number) {
  const row = await prisma.dotDongGop.findUnique({ where: { id } });
  if (!row) throw notFound("đợt đóng góp");
  return toCampaign(row);
}

// Mỗi đợt gắn với một khoản thu TU_NGUYEN (đơn giá 0, không phải công nợ) vì dot_dong_gop.khoan_thu_id NOT NULL.
export async function createCampaign(body: z.infer<typeof campaignCreateBody>) {
  const row = await prisma.dotDongGop.create({
    data: {
      tenDot: body.name,
      moTa: body.description,
      ngayBatDau: parseDateOnly(body.startDate),
      ngayKetThuc: parseDateOnly(body.endDate),
      khoanThu: {
        create: { tenKhoanThu: body.name, loaiKhoanThu: "TU_NGUYEN", donGia: 0 },
      },
    },
  });
  return toCampaign(row);
}
