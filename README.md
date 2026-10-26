# NailVibe - Nền Tảng SaaS Đặt Lịch Nail Đa Khách Hàng (Multi-Tenant)

NailVibe là nền tảng SaaS (Software as a Service) giúp các chủ tiệm nail tự động hóa quy trình nhận lịch hẹn và tạo website đặt lịch riêng biệt theo địa chỉ `https://domain.vn/s/ten-tiem` chỉ trong vòng 5–10 phút mà **không cần bất kỳ kiến thức lập trình hay kỹ thuật máy chủ nào**.

---

## 🌟 Điểm Nổi Bật Của Hệ Thống

1. **Mô hình Multi-Tenant hoàn chỉnh:**
   - Một nền tảng tập trung duy nhất phục vụ hàng nghìn tiệm nail.
   - Mỗi tiệm có tài khoản quản trị, danh sách dịch vụ, thợ móng, giờ làm việc, lịch hẹn và thương hiệu riêng.
   - **Bảo mật cách ly dữ liệu tuyệt đối:** Backend kiểm tra quyền membership ở mọi request, không bao giờ tin cậy `tenantId` từ client gửi lên. Tiệm A tuyệt đối không thể xem hoặc sửa dữ liệu của Tiệm B.
2. **Onboarding Wizard 7 bước trực quan (5–10 phút):**
   - **Bước 1:** Thông tin tiệm (Tên, hotline, địa chỉ, slug URL).
   - **Bước 2:** Logo, banner và bộ màu thương hiệu (Theme colors).
   - **Bước 3:** Giờ mở cửa theo từng thứ trong tuần (Thứ 2 – Chủ Nhật).
   - **Bước 4:** Dịch vụ & bảng giá (Có nút **1-Click Áp Dụng Mẫu Chuẩn** điền sẵn các dịch vụ nail phổ biến nhất Việt Nam).
   - **Bước 5:** Thợ làm móng (Tùy chọn: có thể bỏ qua nếu tiệm làm 1 mình).
   - **Bước 6:** Kiểm tra & xem trước website đặt lịch.
   - **Bước 7:** Xuất bản website, lấy link `/s/:slug` và mã QR đặt lịch.
   - Tự động lưu tiến trình (Autosave), đóng trình duyệt mở lại tiếp tục thiết lập bình thường.
3. **Website đặt lịch công khai `/s/:slug`:**
   - Giao diện đặt lịch sang trọng phong cách salon Hàn Quốc / Châu Âu.
   - Khách hàng không cần cài ứng dụng, thao tác ngay trên trình duyệt điện thoại.
   - **Hệ thống tự động tính khung giờ còn trống:** Tự trừ đi các lịch đã hẹn trước, ngày nghỉ và giờ đóng cửa để tránh trùng lịch 100%.
   - Tạo mã QR tức thì để in đặt tại quầy thu ngân hoặc bàn làm móng.
4. **Bảng điều khiển (Dashboard) thân thiện cho chủ tiệm:**
   - Thống kê lịch hẹn hôm nay, lịch chờ duyệt, lịch đã xác nhận và lịch sắp tới.
   - Checklist **"Hoàn thiện tiệm của bạn"** hiển thị tiến trình % hoàn thiện.
   - Thêm lịch thủ công khi khách gọi điện hoặc ghé tiệm trực tiếp (Walk-in).
   - Đổi slug website linh hoạt kèm cảnh báo đường dẫn cũ.
   - Tùy chỉnh màu sắc, dịch vụ, thợ móng mà không cần viết code.
5. **Cơ chế phân gói dịch vụ (Tiers):**
   - Hỗ trợ **Free Trial (14 ngày)**, **Basic** và **Pro**.
   - Quản lý hạn mức thợ móng và dịch vụ theo gói.
   - Không khóa dữ liệu đột ngột khi hết hạn gói dùng thử.

---

## 🛠 Kiến Trúc Công Nghệ

- **Frontend:** React 18, TypeScript, Vite, React Router v7, Lucide Icons, QRCode.react, Vanilla CSS Design System sang trọng (Rose-gold, Soft Blush, Glassmorphism).
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, JWT, Bcrypt, Zod validation, Multer upload.
- **Database:**
  - **Môi trường phát triển & kiểm thử nội bộ:** SQLite (Zero-config, chạy ngay không cần cài đặt thêm server).
  - **Môi trường Production:** PostgreSQL (Hỗ trợ 100% qua `prisma/schema.postgresql.prisma` tương thích hoàn toàn với Render, Neon, Supabase, AWS RDS, Docker).
- **Testing:** Vitest + Supertest với 17 bài test tích hợp và kiểm thử bảo mật cách ly tenant tự động.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Môi Trường Local

### Yêu cầu hệ thống:
- Node.js >= 18.x (khuyến nghị v20 hoặc v22)
- npm >= 9.x

### Bước 1: Cài đặt dependencies
Chạy lệnh sau tại thư mục gốc:
```bash
npm run install:all
```
*(Hoặc chạy `npm install` lần lượt trong thư mục `backend/` và `frontend/`)*

### Bước 2: Khởi tạo database và dữ liệu mẫu
```bash
cd backend
npx prisma db push
npx tsx prisma/seed.ts
```

Lệnh seed sẽ tạo sẵn 2 tiệm nail độc lập để trải nghiệm ngay:
1. **Tiệm 1: Luna Nail Studio**
   - Slug: `/s/luna-nail`
   - Tài khoản chủ tiệm: `luna@nailvibe.vn` / Mật khẩu: `123456`
   - Tông màu: Hồng Pastel (Rose-gold)
2. **Tiệm 2: Mi Nail Studio**
   - Slug: `/s/mi-nail-studio`
   - Tài khoản chủ tiệm: `minail@nailvibe.vn` / Mật khẩu: `123456`
   - Tông màu: Xanh Ngọc Emerald (Sage)

### Bước 3: Khởi động hệ thống
Mở 2 cửa sổ terminal:
- **Terminal 1 (Backend API port 5000):**
  ```bash
  cd backend
  npm run dev
  ```
- **Terminal 2 (Frontend Web port 5173):**
  ```bash
  cd frontend
  npm run dev
  ```

Truy cập:
- **Trang chủ NailVibe SaaS:** `http://localhost:5173/`
- **Đăng nhập quản trị:** `http://localhost:5173/login`
- **Onboarding Wizard:** `http://localhost:5173/onboarding`
- **Website khách đặt lịch Luna Nail:** `http://localhost:5173/s/luna-nail`
- **Website khách đặt lịch Mi Nail:** `http://localhost:5173/s/mi-nail-studio`
- **Health check Backend:** `http://localhost:5000/api/health`
- **Health check Database:** `http://localhost:5000/api/health/db`

---

## 🧪 Kết Quả Chạy Kiểm Thử Tự Động (Automated Tests)

Chạy test bộ kiểm thử bảo mật & luồng nghiệp vụ:
```bash
cd backend
npm test
```

Hệ thống đã vượt qua toàn bộ **17/17 automated test cases**:
- `Health Check`: `/api/health` và `/api/health/db` trả về 200 OK.
- `Register Tenant 1`: Đăng ký tài khoản, sinh slug tự động, tạo draft và cài đặt mặc định.
- `Slug Collision & Register Tenant 2`: Hai tiệm trùng tên sẽ tự động sinh slug phân biệt, không gây xung đột.
- `Auth Validation`: Chặn đăng ký trùng email.
- `Login`: Xác thực mật khẩu băm bcrypt và trả về ngữ cảnh tiệm nail đang kích hoạt.
- `Onboarding Wizard Persistence`: Tự động lưu tiến trình bước 2 (thương hiệu, chính sách) và khôi phục khi reload.
- `1-Click Apply Sample Template`: Tự động điền danh mục dịch vụ chuẩn cho tiệm nail Việt Nam.
- `Publish Website`: Kích hoạt trạng thái xuất bản và mở link đặt lịch công khai.
- `DATA ISOLATION`: Xác minh Tiệm 1 **không thể nhìn thấy** dịch vụ độc quyền của Tiệm 2.
- `SECURITY TEST`: Tiệm 1 giả mạo ID để cố tình xóa dịch vụ của Tiệm 2 bị chặn ngay lập tức (404/403).
- `SECURITY TEST`: Người dùng không thể giả mạo header `x-tenant-id` để xem dữ liệu tiệm khác (403 Forbidden).
- `Public Website`: Khách hàng xem thông tin tiệm và menu dịch vụ mà không thấy dữ liệu nhạy cảm (doanh thu, mật khẩu).
- `Public Booking`: Khách hàng kiểm tra lịch trống và đặt lịch thành công với mã hẹn `NV-XXXX`.
- `Slot Conflict Prevention`: Khung giờ vừa đặt sẽ chuyển sang trạng thái đã kín lịch.
- `Dashboard Scoping`: Dashboard Tiệm 1 hiển thị đúng lịch hẹn của Tiệm 1; Tiệm 2 thấy 0 lịch.
- `No-Code Salon Config`: Đổi tên tiệm, cập nhật màu sắc thương hiệu mượt mà từ Dashboard.
- `Slug Change & Warning`: Cho phép đổi slug website kèm cảnh báo đường dẫn cũ sẽ không còn hiệu lực.

---

## 🐳 Triển Khai Bằng Docker & Docker Compose

Nếu bạn muốn chạy toàn bộ hệ thống gồm PostgreSQL, Backend và Frontend trong môi trường Dockerized:

```bash
docker-compose up -d --build
```
Hệ thống sẽ khởi chạy:
- PostgreSQL 16 tại cổng `5432`
- Backend API tại cổng `5000`
- Frontend Web tại cổng `8080` (truy cập `http://localhost:8080`)

---

## ☁️ Hướng Dẫn Triển Khai Production (Managed Cloud)

NailVibe được thiết kế để triển khai dễ dàng trên các dịch vụ Cloud hiện đại không đòi hỏi quản trị máy chủ phức tạp:

### 1. Cơ sở dữ liệu PostgreSQL (Managed Database)
Khuyến nghị sử dụng các nhà cung cấp Managed PostgreSQL miễn phí hoặc chi phí thấp:
- **Neon Serverless Postgres** (https://neon.tech): 0.5 GB lưu trữ miễn phí, có connection pooling.
- **Supabase** (https://supabase.com): 500 MB Postgres miễn phí.
- **Render PostgreSQL** (https://render.com): Miễn phí hoặc 7$/tháng cho database ổn định.

Lấy chuỗi kết nối `DATABASE_URL` (ví dụ: `postgresql://user:password@ep-host.neon.tech/nailvibe?sslmode=require`).

### 2. Triển khai Backend API (Render / Railway / Fly.io)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npx prisma generate --schema=prisma/schema.postgresql.prisma && npm run build`
- **Start Command:** `node dist/index.js`
- **Environment Variables:**
  ```env
  NODE_ENV=production
  PORT=5000
  DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
  JWT_SECRET=chuoi_khoa_bao_mat_ngau_nhien_dai_32_ky_tu
  JWT_EXPIRES_IN=7d
  APP_URL=https://nailvibe.vn
  BACKEND_URL=https://api.nailvibe.vn
  UPLOAD_DIR=./uploads
  ```

### 3. Triển khai Frontend Web (Vercel / Netlify / Cloudflare Pages)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  ```env
  VITE_API_URL=https://api.nailvibe.vn/api
  ```
- **Rewrites (SPA Routing):** Trên Vercel hoặc Netlify, cấu hình rewrite `/*` về `/index.html` để hỗ trợ các đường dẫn `/s/:slug` và `/dashboard`.

---

## 🔒 Quy Trình Sao Lưu & Phục Hồi Dữ Liệu (Backup & Restore)

### 1. Sao lưu database (Backup)
Sử dụng công cụ `pg_dump`:
```bash
pg_dump -h <host> -U <user> -d <dbname> -F c -b -v -f "nailvibe_backup_$(date +%Y%m%d_%H%M%S).dump"
```

### 2. Khôi phục dữ liệu (Restore)
Sử dụng công cụ `pg_restore`:
```bash
pg_restore -h <host> -U <user> -d <dbname> -v --clean --if-exists "nailvibe_backup_20261026.dump"
```

### 3. Cập nhật phiên bản (Migration Safety)
Mỗi khi có cập nhật schema trong Prisma:
1. Chạy `npx prisma migrate dev --name <ten_migration>` trên môi trường staging.
2. Kiểm tra log migration xem có lệnh phá hủy dữ liệu (`DROP TABLE`, `DROP COLUMN`) không mong muốn hay không.
3. Trên production, chạy `npx prisma migrate deploy` để áp dụng migration an toàn.

---

## 💰 Ước Tính Chi Phí Dịch Vụ Bên Ngoài (Infrastructure Cost Analysis)

| Dịch vụ | Nhà cung cấp đề xuất | Mức sử dụng khởi điểm (0–50 tiệm) | Mức mở rộng (100–500 tiệm) |
| :--- | :--- | :--- | :--- |
| **Managed PostgreSQL** | Neon / Supabase / Render | **0đ / tháng** (Gói Free Tier) | 350.000đ – 600.000đ / tháng (10GB–25GB) |
| **Backend Hosting** | Render / Railway / VPS OVH | **170.000đ / tháng** (Web Service cơ bản) | 450.000đ – 1.000.000đ / tháng |
| **Frontend Web Hosting** | Vercel / Cloudflare Pages | **0đ / tháng** (Unlimited bandwidth) | **0đ** hoặc gói Pro 500.000đ / tháng |
| **Object Storage (Ảnh)** | Cloudinary / Cloudflare R2 | **0đ / tháng** (10GB free trên R2) | ~50.000đ / tháng |
| **Tên miền (.vn / .com)** | Matbao / Cloudflare | ~250.000đ – 650.000đ / năm | ~250.000đ – 650.000đ / năm |
| **Tổng chi phí ước tính** | — | **~170.000đ – 250.000đ / tháng** | **~850.000đ – 2.000.000đ / tháng** |

> Nhờ mô hình Multi-tenant dùng chung một cụm backend và database phân vùng theo `tenantId`, chi phí hạ tầng trên mỗi tiệm nail chỉ dao động từ **3.000đ – 10.000đ / tiệm / tháng**, mang lại biên lợi nhuận trên 95% cho nhà cung cấp phần mềm SaaS.
