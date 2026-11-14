// Ngày trong API là chuỗi YYYY-MM-DD; trong DB là cột DATE (Prisma trả Date lúc 00:00 UTC).
export const toDateOnly = (d: Date) => d.toISOString().slice(0, 10);
export const parseDateOnly = (s: string) => new Date(`${s}T00:00:00.000Z`);
export const today = () => toDateOnly(new Date());
