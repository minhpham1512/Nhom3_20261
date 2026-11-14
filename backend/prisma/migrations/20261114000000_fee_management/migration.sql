-- Hỗ trợ API Fees / Contribution Campaigns (doc/swagger.yaml):
--  * khoan_thu.phan_loai: SERVICE_FEE được cảnh báo khung giá 2.500–16.500 VND/m²
--  * lich_su_don_gia: các mốc đơn giá theo ngày hiệu lực (US16)
--  * dot_dong_gop.mo_ta: mô tả đợt đóng góp (US15)

ALTER TABLE khoan_thu
    ADD COLUMN phan_loai VARCHAR(20) NOT NULL DEFAULT 'OTHER'
        CHECK (phan_loai IN ('SERVICE_FEE', 'OTHER'));

UPDATE khoan_thu SET phan_loai = 'SERVICE_FEE' WHERE ten_khoan_thu = 'Phí dịch vụ chung cư';

CREATE TABLE lich_su_don_gia (
    id SERIAL PRIMARY KEY,
    khoan_thu_id INT NOT NULL REFERENCES khoan_thu(id),
    don_gia BIGINT NOT NULL CHECK (don_gia >= 0),
    ngay_hieu_luc DATE NOT NULL,
    nguoi_tao_id INT REFERENCES tai_khoan(id),
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_don_gia_ngay UNIQUE (khoan_thu_id, ngay_hieu_luc)
);

-- Mốc giá đầu tiên của các khoản bắt buộc đã có
INSERT INTO lich_su_don_gia (khoan_thu_id, don_gia, ngay_hieu_luc)
SELECT id, don_gia, ngay_ap_dung FROM khoan_thu WHERE loai_khoan_thu = 'BAT_BUOC';

ALTER TABLE dot_dong_gop ADD COLUMN mo_ta TEXT;
