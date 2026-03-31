# Spotify Tracks Dataset Explorer

A lightweight Vite + React app for exploring and visualizing the Spotify Tracks dataset.

## 🔧 Requirements

- Node.js 16.x or newer
- npm 8.x or newer

## 🚀 Quick start

1. Clone or download this folder.
2. Mở terminal vào thư mục dự án.
3. Cài dependencies:

```bash
npm install
```

4. Chạy server dev:

```bash
npm run dev
```

5. Mở trình duyệt vào URL được in ra (mặc định `http://localhost:3000`).

## 🧭 Scripts

- `npm run dev`: khởi động Vite dev server.
- `npm run build`: build production (`dist/`).
- `npm run preview`: preview build trên máy local.

## 📁 Cấu trúc thư mục

- `src/` - mã React (component, logic, giao diện)
  - `App.tsx` - điểm vào ứng dụng
  - `main.tsx` - mount React
  - `lib/utils.ts` - helper xử lý dữ liệu
- `public/` (nếu có) - tài nguyên tĩnh
- `index.html` - entry point web
- `package.json` - dependencies + script
- `tsconfig.json` - cấu hình TypeScript
- `vite.config.ts` - cấu hình Vite
- `eda_spotify_tracks.json` - dataset Spotify để phân tích

## 📊 Dữ liệu dataset

`eda_spotify_tracks.json` chứa bảng track với các trường như:
- track name
- artist
- album
- duration
- popularity
- acousticness, danceability, energy, instrumentalness, liveness, valence

> Tùy repo, nếu file nặng, hãy tránh commit dataset rất lớn (nên chỉ commit mẫu).

## 🛠 Base tính năng (có thể mở rộng)

1. Đọc JSON dataset và hiển thị bảng track.
2. Lọc theo artist / album / tính năng âm nhạc.
3. Thống kê cơ bản: số bản ghi, tình trạng phổ biến, average tempo / energy / danceability.
4. Biểu đồ (nếu đã cài thêm chart library như `recharts` / `chart.js`).

## 💡 Mẹo khắc phục sự cố

- Nếu npm báo thiếu package, chạy lại `npm install`.
- Nếu Vite bị lỗi port, cho phép dùng port khác khi được hỏi.
- Nếu phát hiện TypeScript lỗi, kiểm tra `tsconfig.json` và các kiểu dữ liệu trong `src`.

## 📌 Kịch bản deploy

1. `npm run build`
2. `npm run preview` để kiểm tra local.
3. Deploy `dist/` lên Netlify/Vercel/GitHub Pages.

---

Chúc bạn làm project vui vẻ! 🎵
