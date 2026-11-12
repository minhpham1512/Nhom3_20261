-- 1. KÍCH HOẠT EXTENSION & HÀM BỌC TÌM KIẾM TIẾNG VIỆT
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA public;

-- Tạo hàm bọc IMMUTABLE hỗ trợ Index tìm kiếm tiếng Việt không dấu
CREATE OR REPLACE FUNCTION public.immutable_unaccent(text)
  RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  SET search_path = public, pg_catalog
  AS $$ SELECT public.unaccent($1) $$;

-- 2. PHÂN HỆ QUẢN TRỊ & BẢO MẬT (EP01)
CREATE TABLE vai_tro (
    id SERIAL PRIMARY KEY,
    ten_vai_tro VARCHAR(50) UNIQUE NOT NULL,
    mo_ta TEXT
);

INSERT INTO vai_tro (ten_vai_tro, mo_ta) VALUES 
('ADMIN', 'Quản trị hệ thống'),
('KE_TOAN', 'Kế toán / Thủ quỹ'),
('CAN_BO_CU_DAN', 'Cán bộ quản lý nhân khẩu'),
('TRUONG_BQT', 'Trưởng Ban quản trị');

CREATE TABLE tai_khoan (
    id SERIAL PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL, -- Lưu chuỗi bcrypt hash
    ho_ten VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(15),
    email VARCHAR(100),
    vai_tro_id INT NOT NULL REFERENCES vai_tro(id),
    -- Khóa tạm do sai mật khẩu được quyết định bởi khoa_den_thoi_gian, không dùng trạng thái riêng
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (trang_thai IN ('ACTIVE', 'INACTIVE')),
    so_lan_sai_mat_khau INT NOT NULL DEFAULT 0,
    khoa_den_thoi_gian TIMESTAMPTZ,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nhat_ky_thao_tac (
    id BIGSERIAL PRIMARY KEY,
    tai_khoan_id INT REFERENCES tai_khoan(id),
    hanh_dong VARCHAR(100) NOT NULL, -- INSERT, UPDATE, DELETE
    ten_bang VARCHAR(50) NOT NULL,
    du_lieu_cu JSONB,
    du_lieu_moi JSONB,
    thoi_gian TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. PHÂN HỆ HỘ GIA ĐÌNH & NHÂN KHẨU (EP02)
CREATE TABLE can_ho (
    id SERIAL PRIMARY KEY,
    ma_can_ho VARCHAR(20) UNIQUE NOT NULL, -- Ví dụ: 12A05
    dien_tich NUMERIC(8, 2) NOT NULL CHECK (dien_tich > 0),
    tang INT,
    mo_ta TEXT
);

CREATE TABLE ho_gia_dinh (
    id SERIAL PRIMARY KEY,
    can_ho_id INT NOT NULL REFERENCES can_ho(id),
    ma_ho_khau VARCHAR(50) UNIQUE NOT NULL,
    ngay_chuyen_den DATE NOT NULL DEFAULT CURRENT_DATE,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'DANG_O'
        CHECK (trang_thai IN ('DANG_O', 'DA_CHUYEN_DI'))
);

-- Mỗi căn hộ chỉ có tối đa 1 hộ đang ở; các hộ đã chuyển đi không bị giới hạn (giữ lịch sử)
CREATE UNIQUE INDEX uq_ho_gia_dinh_can_ho_dang_o
    ON ho_gia_dinh (can_ho_id)
    WHERE trang_thai = 'DANG_O';

CREATE TABLE nhan_khau (
    id SERIAL PRIMARY KEY,
    ho_gia_dinh_id INT NOT NULL REFERENCES ho_gia_dinh(id),
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh VARCHAR(10) NOT NULL CHECK (gioi_tinh IN ('Nam', 'Nữ', 'Khác')),
    so_cccd VARCHAR(20) UNIQUE, -- NULL nếu dưới 14 tuổi
    quan_he_chu_ho VARCHAR(50) NOT NULL, -- Chủ hộ, Vợ, Chồng, Con...
    is_chu_ho BOOLEAN NOT NULL DEFAULT FALSE,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'THUONG_TRU'
        CHECK (trang_thai IN ('THUONG_TRU', 'TAM_TRU', 'TAM_VANG', 'DA_CHUYEN_DI', 'DA_QUA_DOI')),
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Mỗi hộ có tối đa 1 chủ hộ
CREATE UNIQUE INDEX uq_nhan_khau_chu_ho
    ON nhan_khau (ho_gia_dinh_id)
    WHERE is_chu_ho;

CREATE TABLE bien_dong_nhan_khau (
    id SERIAL PRIMARY KEY,
    nhan_khau_id INT NOT NULL REFERENCES nhan_khau(id),
    loai_bien_dong VARCHAR(50) NOT NULL
        CHECK (loai_bien_dong IN ('SINH_MOI', 'CHUYEN_DEN', 'CHUYEN_DI', 'QUA_DOI', 'DOI_CHU_HO')),
    ngay_bien_dong DATE NOT NULL DEFAULT CURRENT_DATE,
    ghi_chu TEXT,
    nguoi_thuc_hien_id INT NOT NULL REFERENCES tai_khoan(id)
);

CREATE TABLE tam_tru_tam_vang (
    id SERIAL PRIMARY KEY,
    nhan_khau_id INT NOT NULL REFERENCES nhan_khau(id),
    loai_khai_bao VARCHAR(20) NOT NULL CHECK (loai_khai_bao IN ('TAM_TRU', 'TAM_VANG')),
    tu_ngay DATE NOT NULL,
    den_ngay DATE NOT NULL,
    ly_do TEXT,
    dia_chi_lien_quan TEXT,
    CONSTRAINT check_ngay CHECK (den_ngay >= tu_ngay)
);

-- 4. PHÂN HỆ KHOẢN THU & PHÍ CHUNG CƯ (EP03, EP04, EP05)
-- Quy ước: mọi cột tiền là BIGINT, đơn vị đồng (NFR-007)
CREATE TABLE khoan_thu (
    id SERIAL PRIMARY KEY,
    ten_khoan_thu VARCHAR(100) NOT NULL,
    loai_khoan_thu VARCHAR(30) NOT NULL
        CHECK (loai_khoan_thu IN ('BAT_BUOC', 'TU_NGUYEN')),
    don_gia BIGINT NOT NULL DEFAULT 0,
    don_vi_tinh VARCHAR(20) NOT NULL DEFAULT 'VND/m2/thang',
    ngay_ap_dung DATE NOT NULL DEFAULT CURRENT_DATE,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'HOAT_DONG'
        CHECK (trang_thai IN ('HOAT_DONG', 'NGUNG_AP_DUNG'))
);

CREATE TABLE dot_dong_gop (
    id SERIAL PRIMARY KEY,
    khoan_thu_id INT NOT NULL REFERENCES khoan_thu(id),
    ten_dot VARCHAR(150) NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    CONSTRAINT check_ngay_dot CHECK (ngay_ket_thuc >= ngay_bat_dau)
);

CREATE TABLE phi_phai_nop (
    id SERIAL PRIMARY KEY,
    ho_gia_dinh_id INT NOT NULL REFERENCES ho_gia_dinh(id),
    khoan_thu_id INT NOT NULL REFERENCES khoan_thu(id),
    ky_thu VARCHAR(7) NOT NULL, -- Định dạng YYYY-MM
    so_tien_phai_nop BIGINT NOT NULL CHECK (so_tien_phai_nop >= 0),
    so_tien_da_nop BIGINT NOT NULL DEFAULT 0,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'CHUA_NOP'
        CHECK (trang_thai IN ('CHUA_NOP', 'NOP_THIEU', 'DA_NOP')),
    CONSTRAINT chk_ky_thu_dinh_dang CHECK (ky_thu ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
    CONSTRAINT unique_phi_ho_ky UNIQUE (ho_gia_dinh_id, khoan_thu_id, ky_thu)
);

CREATE TABLE phieu_thu (
    id SERIAL PRIMARY KEY,
    so_phieu VARCHAR(50) UNIQUE NOT NULL,
    ho_gia_dinh_id INT NOT NULL REFERENCES ho_gia_dinh(id),
    nguoi_nop_tien VARCHAR(100) NOT NULL,
    tong_tien BIGINT NOT NULL CHECK (tong_tien > 0),
    ngay_thu TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nguoi_thu_id INT NOT NULL REFERENCES tai_khoan(id),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'HOP_LE'
        CHECK (trang_thai IN ('HOP_LE', 'DA_HUY')),
    ly_do_huy TEXT,
    -- Hủy phiếu bắt buộc phải có lý do (US22)
    CONSTRAINT chk_phieu_huy_co_ly_do CHECK (trang_thai <> 'DA_HUY' OR ly_do_huy IS NOT NULL)
);

CREATE TABLE chi_tiet_phieu_thu (
    id SERIAL PRIMARY KEY,
    -- Không CASCADE: phiếu thu chỉ được hủy mềm (trang_thai = 'DA_HUY'), không bao giờ xóa
    phieu_thu_id INT NOT NULL REFERENCES phieu_thu(id),
    phi_phai_nop_id INT REFERENCES phi_phai_nop(id),
    dot_dong_gop_id INT REFERENCES dot_dong_gop(id),
    so_tien BIGINT NOT NULL CHECK (so_tien > 0),
    -- Mỗi dòng chi tiết trả cho đúng 1 nguồn: hoặc phí bắt buộc, hoặc đợt đóng góp
    CONSTRAINT chk_chi_tiet_mot_nguon CHECK (num_nonnulls(phi_phai_nop_id, dot_dong_gop_id) = 1)
);

-- 5. TẠO INDEX TỐI ƯU HIỆU NĂNG
-- Lưu ý: cột UNIQUE (so_cccd, ma_can_ho, ...) đã được PostgreSQL tự tạo index, không tạo lại
CREATE INDEX idx_nhan_khau_ho_ten_trgm ON nhan_khau USING gin (public.immutable_unaccent(ho_ten) gin_trgm_ops);
CREATE INDEX idx_phi_phai_nop_ky ON phi_phai_nop(ky_thu, trang_thai);
CREATE INDEX idx_phieu_thu_ho ON phieu_thu(ho_gia_dinh_id, ngay_thu);
