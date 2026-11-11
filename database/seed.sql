-- 1. Thêm 1 Căn hộ mẫu (Tầng 12, căn 12A05, diện tích 70m²)
INSERT INTO can_ho (ma_can_ho, dien_tich, tang, mo_ta) 
VALUES ('12A05', 70.00, 12, 'Căn hộ chung cư tiêu chuẩn');

-- 2. Thêm Hộ gia đình cho căn 12A05
INSERT INTO ho_gia_dinh (can_ho_id, ma_ho_khau) 
VALUES (1, 'HK-12A05');

-- 3. Thêm 2 cư dân vào hộ 12A05 (Chủ hộ Nguyễn Văn Tuấn & Vợ)
INSERT INTO nhan_khau (ho_gia_dinh_id, ho_ten, ngay_sinh, gioi_tinh, so_cccd, quan_he_chu_ho, is_chu_ho) 
VALUES 
(1, 'Vũ Đức Tuấn', '1980-05-15', 'Nam', '001088012345', 'Chủ hộ', TRUE),
(1, 'Phạm Trọng Minh', '1990-01-01', 'Nam', '001090054321', 'Con', FALSE);

-- 4. Thêm 2 Khoản thu bắt buộc (Phí dịch vụ 5.000 đ/m² và Phí quản lý 7.000 đ/m²)
INSERT INTO khoan_thu (ten_khoan_thu, loai_khoan_thu, don_gia, don_vi_tinh) 
VALUES 
('Phí dịch vụ chung cư', 'BAT_BUOC', 5000, 'VND/m2/thang'),
('Phí quản lý BlueMoon', 'BAT_BUOC', 7000, 'VND/m2/thang');