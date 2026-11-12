-- DỮ LIỆU MẪU CHO MÔI TRƯỜNG PHÁT TRIỂN (chạy sau khi đã migrate: npm run db:deploy)
-- Toàn bộ họ tên và số CCCD dưới đây là HƯ CẤU, chỉ dùng để thử nghiệm.
-- Không gắn cứng id: mọi khóa ngoại được tra qua mã nghiệp vụ (ma_can_ho, ma_ho_khau, ten_vai_tro).

-- pgcrypto cung cấp crypt()/gen_salt() để băm mật khẩu bằng bcrypt ngay trong SQL
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA public;

BEGIN;

-- 1. Tài khoản Admin mặc định (đăng nhập: admin / Admin@123 — ĐỔI MẬT KHẨU ngay sau lần đăng nhập đầu tiên)
-- gen_salt('bf', 10) tạo chuỗi bcrypt dạng $2a$10$..., bcryptjs ở backend so sánh được
INSERT INTO tai_khoan (ten_dang_nhap, mat_khau_hash, ho_ten, vai_tro_id)
VALUES (
    'admin',
    crypt('Admin@123', gen_salt('bf', 10)),
    'Quản trị viên hệ thống',
    (SELECT id FROM vai_tro WHERE ten_vai_tro = 'ADMIN')
);

-- 2. Căn hộ mẫu 12A05 (tầng 12, diện tích 70 m²)
INSERT INTO can_ho (ma_can_ho, dien_tich, tang, mo_ta)
VALUES ('12A05', 70.00, 12, 'Căn hộ chung cư tiêu chuẩn');

-- 3. Hộ gia đình đang ở căn 12A05
INSERT INTO ho_gia_dinh (can_ho_id, ma_ho_khau, ngay_chuyen_den)
VALUES ((SELECT id FROM can_ho WHERE ma_can_ho = '12A05'), 'HK-12A05', '2020-03-01');

-- 4. Bốn nhân khẩu của hộ HK-12A05: chủ hộ, vợ và hai con
--    CCCD hư cấu: mã tỉnh 099 (không tồn tại) + mã giới tính/thế kỷ + 2 số cuối năm sinh + 6 số
--    Con gái sinh 2018 (dưới 14 tuổi) nên chưa có CCCD -> NULL
INSERT INTO nhan_khau (ho_gia_dinh_id, ho_ten, ngay_sinh, gioi_tinh, so_cccd, quan_he_chu_ho, is_chu_ho)
SELECT hgd.id, nk.ho_ten, nk.ngay_sinh::DATE, nk.gioi_tinh, nk.so_cccd, nk.quan_he_chu_ho, nk.is_chu_ho
FROM ho_gia_dinh hgd
CROSS JOIN (VALUES
    ('Đỗ Anh Tuấn',  '1982-04-12', 'Nam', '099082000001', 'Chủ hộ', TRUE),
    ('Ngô Thị Hạnh', '1985-09-23', 'Nữ',  '099185000002', 'Vợ',     FALSE),
    ('Đỗ Minh Khôi', '2010-06-05', 'Nam', '099210000003', 'Con',    FALSE),
    ('Đỗ Ngọc An',   '2018-11-30', 'Nữ',  NULL,           'Con',    FALSE)
) AS nk (ho_ten, ngay_sinh, gioi_tinh, so_cccd, quan_he_chu_ho, is_chu_ho)
WHERE hgd.ma_ho_khau = 'HK-12A05';

-- 5. Hai khoản thu bắt buộc tính theo m²: phí dịch vụ 5.000 đ/m²/tháng và phí quản lý 7.000 đ/m²/tháng
--    don_gia là BIGINT, đơn vị đồng (NFR-007)
INSERT INTO khoan_thu (ten_khoan_thu, loai_khoan_thu, don_gia, don_vi_tinh)
VALUES
('Phí dịch vụ chung cư', 'BAT_BUOC', 5000, 'VND/m2/thang'),
('Phí quản lý BlueMoon', 'BAT_BUOC', 7000, 'VND/m2/thang');

COMMIT;
