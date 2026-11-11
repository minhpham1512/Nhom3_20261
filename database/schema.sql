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
    vai_tro_id INT REFERENCES vai_tro(id),
    trang_thai VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, LOCKED
    so_lan_sai_mat_khau INT DEFAULT 0,
    khoa_den_thoi_gian TIMESTAMP,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nhat_ky_thao_tac (
    id BIGSERIAL PRIMARY KEY,
    tai_khoan_id INT REFERENCES tai_khoan(id),
    hanh_dong VARCHAR(100) NOT NULL, -- INSERT, UPDATE, DELETE
    ten_bang VARCHAR(50) NOT NULL,
    du_lieu_cu JSONB,
    du_lieu_moi JSONB,
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    can_ho_id INT REFERENCES can_ho(id),
    ma_ho_khau VARCHAR(50) UNIQUE,
    ngay_chuyen_den DATE DEFAULT CURRENT_DATE,
    trang_thai VARCHAR(20) DEFAULT 'DANG_O' -- DANG_O, DA_CHUYEN_DI
);

CREATE TABLE nhan_khau (
    id SERIAL PRIMARY KEY,
    ho_gia_dinh_id INT REFERENCES ho_gia_dinh(id),
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh VARCHAR(10) CHECK (gioi_tinh IN ('Nam', 'Nữ', 'Khác')),
    so_cccd VARCHAR(20) UNIQUE, -- NULL nếu dưới 14 tuổi
    quan_he_chu_ho VARCHAR(50) NOT NULL, -- Chủ hộ, Vợ, Chồng, Con...
    is_chu_ho BOOLEAN DEFAULT FALSE,
    trang_thai VARCHAR(20) DEFAULT 'THUONG_TRU', -- THUONG_TRU, TAM_TRU, TAM_VANG, DA_CHUYEN_DI
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bien_dong_nhan_khau (
    id SERIAL PRIMARY KEY,
    nhan_khau_id INT REFERENCES nhan_khau(id),
    loai_bien_dong VARCHAR(50) NOT NULL, -- Sinh mới, Đổi chủ hộ, Chuyển đi, Qua đời...
    ngay_bien_dong DATE NOT NULL DEFAULT CURRENT_DATE,
    ghi_chu TEXT,
    nguoi_thuc_hien_id INT REFERENCES tai_khoan(id)
);

CREATE TABLE tam_tru_tam_vang (
    id SERIAL PRIMARY KEY,
    nhan_khau_id INT REFERENCES nhan_khau(id),
    loai_khai_bao VARCHAR(20) CHECK (loai_khai_bao IN ('TAM_TRU', 'TAM_VANG')),
    tu_ngay DATE NOT NULL,
    den_ngay DATE NOT NULL,
    ly_do TEXT,
    dia_chi_lien_quan TEXT,
    CONSTRAINT check_ngay CHECK (den_ngay >= tu_ngay)
);

-- 4. PHÂN HỆ KHOẢN THU & PHÍ CHUNG CƯ (EP03, EP04, EP05)
CREATE TABLE khoan_thu (
    id SERIAL PRIMARY KEY,
    ten_khoan_thu VARCHAR(100) NOT NULL,
    loai_khoan_thu VARCHAR(30) NOT NULL, -- BAT_BUOC, TU_NGUYEN, GUI_XE, THU_HO
    don_gia NUMERIC(12, 2) DEFAULT 0,
    don_vi_tinh VARCHAR(20) DEFAULT 'VND/m2/thang',
    ngay_ap_dung DATE DEFAULT CURRENT_DATE,
    trang_thai VARCHAR(20) DEFAULT 'HOAT_DONG' -- HOAT_DONG, NGUNG_AP_DUNG
);

CREATE TABLE dot_dong_gop (
    id SERIAL PRIMARY KEY,
    khoan_thu_id INT REFERENCES khoan_thu(id),
    ten_dot VARCHAR(150) NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    CONSTRAINT check_ngay_dot CHECK (ngay_ket_thuc >= ngay_bat_dau)
);

CREATE TABLE phi_phai_nop (
    id SERIAL PRIMARY KEY,
    ho_gia_dinh_id INT REFERENCES ho_gia_dinh(id),
    khoan_thu_id INT REFERENCES khoan_thu(id),
    ky_thu VARCHAR(7) NOT NULL, -- Định dạng YYYY-MM
    so_tien_phai_nop NUMERIC(12, 2) NOT NULL CHECK (so_tien_phai_nop >= 0),
    so_tien_da_nop NUMERIC(12, 2) DEFAULT 0,
    trang_thai VARCHAR(20) DEFAULT 'CHUA_NOP', -- CHUA_NOP, NOP_THIEU, DA_NOP
    CONSTRAINT unique_phi_ho_ky UNIQUE (ho_gia_dinh_id, khoan_thu_id, ky_thu)
);

CREATE TABLE phieu_thu (
    id SERIAL PRIMARY KEY,
    so_phieu VARCHAR(50) UNIQUE NOT NULL,
    ho_gia_dinh_id INT REFERENCES ho_gia_dinh(id),
    nguoi_nop_tien VARCHAR(100) NOT NULL,
    tong_tien NUMERIC(12, 2) NOT NULL CHECK (tong_tien > 0),
    ngay_thu TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nguoi_thu_id INT REFERENCES tai_khoan(id),
    trang_thai VARCHAR(20) DEFAULT 'HOP_LE', -- HOP_LE, DA_HUY
    ly_do_huy TEXT
);

CREATE TABLE chi_tiet_phieu_thu (
    id SERIAL PRIMARY KEY,
    phieu_thu_id INT REFERENCES phieu_thu(id) ON DELETE CASCADE,
    phi_phai_nop_id INT REFERENCES phi_phai_nop(id),
    dot_dong_gop_id INT REFERENCES dot_dong_gop(id),
    so_tien NUMERIC(12, 2) NOT NULL CHECK (so_tien > 0)
);

-- 5. ROADMAP MỞ RỘNG V2.0 (EP06, EP07)
CREATE TABLE phuong_tien (
    id SERIAL PRIMARY KEY,
    ho_gia_dinh_id INT REFERENCES ho_gia_dinh(id),
    bien_so VARCHAR(20) UNIQUE NOT NULL,
    loai_xe VARCHAR(20) CHECK (loai_xe IN ('Xe máy', 'Ô tô', 'Xe điện')),
    ngay_dang_ky DATE DEFAULT CURRENT_DATE
);

CREATE TABLE hoa_don_thu_ho (
    id SERIAL PRIMARY KEY,
    ho_gia_dinh_id INT REFERENCES ho_gia_dinh(id),
    nha_cung_cap VARCHAR(100) NOT NULL,
    ky_thu VARCHAR(7) NOT NULL,
    so_tien NUMERIC(12, 2) NOT NULL,
    trang_thai VARCHAR(20) DEFAULT 'CHUA_THU'
);

-- 6. TẠO INDEX TỐI ƯU HIỆU NĂNG 
CREATE INDEX idx_nhan_khau_ho_ten_trgm ON nhan_khau USING gin (public.immutable_unaccent(ho_ten) gin_trgm_ops);
CREATE INDEX idx_nhan_khau_cccd ON nhan_khau(so_cccd);
CREATE INDEX idx_can_ho_ma ON can_ho(ma_can_ho);
CREATE INDEX idx_phi_phai_nop_ky ON phi_phai_nop(ky_thu, trang_thai);
CREATE INDEX idx_phieu_thu_ho ON phieu_thu(ho_gia_dinh_id, ngay_thu);
