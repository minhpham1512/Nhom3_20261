import type { Prisma } from "../../../generated/prisma/client.js";
import type { z } from "zod";
import { prisma } from "../../lib/db.js";
import { AppError, notFound } from "../../lib/errors.js";
import { parseDateOnly, today, toDateOnly } from "../../lib/dates.js";
import type { feeCreateBody, feeUpdateBody } from "./fees.schema.js";

// Khung giá hợp lệ của phí dịch vụ (VND/m²/tháng) — ngoài khung chỉ cảnh báo, không chặn.
const SERVICE_FEE_MIN = 2500;
const SERVICE_FEE_MAX = 16500;

type FeeRow = Prisma.KhoanThuGetPayload<{ include: { lichSuDonGia: true } }>;
const withPrices = { lichSuDonGia: true } as const;

// Đơn giá đang áp dụng = mốc có ngày hiệu lực lớn nhất không vượt quá hôm nay.
function pickApplied<T extends { ngayHieuLuc: Date }>(prices: T[]) {
  const now = today();
  return prices
    .filter((p) => toDateOnly(p.ngayHieuLuc) <= now)
    .sort((a, b) => b.ngayHieuLuc.getTime() - a.ngayHieuLuc.getTime())[0];
}

function currentPrice(row: FeeRow) {
  const applied = pickApplied(row.lichSuDonGia);
  return applied
    ? { unitPrice: Number(applied.donGia), effectiveFrom: toDateOnly(applied.ngayHieuLuc) }
    : { unitPrice: Number(row.donGia), effectiveFrom: toDateOnly(row.ngayApDung) };
}

function toFee(row: FeeRow) {
  return {
    id: row.id,
    name: row.tenKhoanThu,
    type: "BAT_BUOC" as const,
    category: row.phanLoai as "SERVICE_FEE" | "OTHER",
    ...currentPrice(row),
    unit: "VND/m2/thang" as const,
    billingCycle: "MONTHLY" as const,
    status: row.trangThai as "HOAT_DONG" | "NGUNG_AP_DUNG",
  };
}

async function findFee(id: number) {
  const row = await prisma.khoanThu.findFirst({
    where: { id, loaiKhoanThu: "BAT_BUOC" },
    include: withPrices,
  });
  if (!row) throw notFound("khoản thu");
  return row;
}

async function assertNameFree(name: string, exceptId?: number) {
  const dup = await prisma.khoanThu.findFirst({
    where: {
      loaiKhoanThu: "BAT_BUOC",
      tenKhoanThu: { equals: name, mode: "insensitive" },
      trangThai: "HOAT_DONG",
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
  });
  if (dup) throw new AppError(409, "FEE_NAME_EXISTS", "Tên khoản thu đã tồn tại.");
}

function assertPriceInRange(category: string, unitPrice: number, confirmed: boolean) {
  if (category !== "SERVICE_FEE" || confirmed) return;
  if (unitPrice < SERVICE_FEE_MIN || unitPrice > SERVICE_FEE_MAX) {
    throw new AppError(
      409,
      "PRICE_WARNING_CONFIRMATION_REQUIRED",
      "Đơn giá phí dịch vụ nằm ngoài khoảng 2.500–16.500 VND/m². Vui lòng xác nhận.",
      { minPrice: SERVICE_FEE_MIN, maxPrice: SERVICE_FEE_MAX },
    );
  }
}

// Chỉ ghi người tạo khi tài khoản tồn tại, tránh lỗi khoá ngoại khi dùng X-Dev-User-Id tuỳ ý.
async function existingUserId(id: number | null) {
  if (!id) return null;
  return (await prisma.taiKhoan.findUnique({ where: { id }, select: { id: true } }))?.id ?? null;
}

export async function listFees(q: {
  status?: "HOAT_DONG" | "NGUNG_AP_DUNG";
  page: number;
  pageSize: number;
}) {
  const where: Prisma.KhoanThuWhereInput = {
    loaiKhoanThu: "BAT_BUOC",
    ...(q.status ? { trangThai: q.status } : {}),
  };
  const [total, rows] = await Promise.all([
    prisma.khoanThu.count({ where }),
    prisma.khoanThu.findMany({
      where,
      include: withPrices,
      orderBy: { id: "asc" },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
    }),
  ]);
  return { page: q.page, pageSize: q.pageSize, total, items: rows.map(toFee) };
}

export async function getFee(id: number) {
  return toFee(await findFee(id));
}

export async function createFee(body: z.infer<typeof feeCreateBody>, userId: number | null) {
  await assertNameFree(body.name);
  assertPriceInRange(body.category, body.unitPrice, body.confirmPriceWarning);
  const creator = await existingUserId(userId);

  const row = await prisma.khoanThu.create({
    data: {
      tenKhoanThu: body.name,
      loaiKhoanThu: "BAT_BUOC",
      phanLoai: body.category,
      donGia: body.unitPrice,
      donViTinh: body.unit,
      ngayApDung: parseDateOnly(body.effectiveFrom),
      lichSuDonGia: {
        create: {
          donGia: body.unitPrice,
          ngayHieuLuc: parseDateOnly(body.effectiveFrom),
          nguoiTaoId: creator,
        },
      },
    },
    include: withPrices,
  });
  return toFee(row);
}

export async function updateFee(
  id: number,
  body: z.infer<typeof feeUpdateBody>,
  userId: number | null,
) {
  const fee = await findFee(id);

  if (body.name !== undefined && fee.trangThai === "HOAT_DONG") {
    await assertNameFree(body.name, id);
  }

  const newPrice =
    body.unitPrice !== undefined && body.effectiveFrom !== undefined
      ? { unitPrice: body.unitPrice, effectiveFrom: body.effectiveFrom }
      : null;

  if (newPrice) {
    assertPriceInRange(fee.phanLoai, newPrice.unitPrice, body.confirmPriceWarning ?? false);
    // Không được đổi giá có hiệu lực trong kỳ đã lập danh sách phải nộp.
    const billed = await prisma.phiPhaiNop.findFirst({
      where: { khoanThuId: id, kyThu: { gte: newPrice.effectiveFrom.slice(0, 7) } },
      select: { kyThu: true },
    });
    if (billed) {
      throw new AppError(400, "VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ.", {
        fields: [
          {
            field: "effectiveFrom",
            message: `Kỳ ${billed.kyThu} đã lập danh sách phải nộp, hãy chọn ngày hiệu lực sau kỳ này.`,
          },
        ],
      });
    }
  }
  const creator = newPrice ? await existingUserId(userId) : null;

  await prisma.$transaction(async (tx) => {
    if (body.name !== undefined) {
      await tx.khoanThu.update({ where: { id }, data: { tenKhoanThu: body.name } });
    }
    if (newPrice) {
      const date = parseDateOnly(newPrice.effectiveFrom);
      await tx.lichSuDonGia.upsert({
        where: { khoanThuId_ngayHieuLuc: { khoanThuId: id, ngayHieuLuc: date } },
        create: { khoanThuId: id, donGia: newPrice.unitPrice, ngayHieuLuc: date, nguoiTaoId: creator },
        update: { donGia: newPrice.unitPrice, nguoiTaoId: creator },
      });
      // Giữ cột don_gia/ngay_ap_dung của khoan_thu đồng bộ với mốc đang áp dụng.
      const applied = pickApplied(await tx.lichSuDonGia.findMany({ where: { khoanThuId: id } }));
      if (applied) {
        await tx.khoanThu.update({
          where: { id },
          data: { donGia: applied.donGia, ngayApDung: applied.ngayHieuLuc },
        });
      }
    }
  });
  return getFee(id);
}

export async function listFeePrices(id: number) {
  await findFee(id);
  const rows = await prisma.lichSuDonGia.findMany({
    where: { khoanThuId: id },
    orderBy: { ngayHieuLuc: "desc" },
  });
  return rows.map((p) => ({
    id: p.id,
    feeId: p.khoanThuId,
    unitPrice: Number(p.donGia),
    effectiveFrom: toDateOnly(p.ngayHieuLuc),
    ...(p.nguoiTaoId ? { createdBy: p.nguoiTaoId } : {}),
    createdAt: p.ngayTao.toISOString(),
  }));
}

export async function updateFeeStatus(id: number, status: "HOAT_DONG" | "NGUNG_AP_DUNG") {
  const fee = await findFee(id);
  if (status === "HOAT_DONG" && fee.trangThai !== "HOAT_DONG") {
    await assertNameFree(fee.tenKhoanThu, id);
  }
  await prisma.khoanThu.update({ where: { id }, data: { trangThai: status } });
  return getFee(id);
}
