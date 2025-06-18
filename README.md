## 📌 Deskripsi Proyek

**Backend-App_Skema** adalah implementasi RESTful API yang menjadi tulang punggung dari aplikasi edukasi *Skema*, sebuah platform pembelajaran digital. Backend ini dibangun menggunakan **Node.js** dan **Express.js**, dengan **Prisma ORM** sebagai pengelola database relasional berbasis PostgreSQL.

Aplikasi dirancang secara modular dengan pendekatan clean architecture agar mudah dikembangkan, dipelihara, dan diintegrasikan dengan frontend. Struktur folder dipisahkan berdasarkan tanggung jawab (controller, service, repository, middleware) untuk meningkatkan skalabilitas dan keterbacaan kode.

### 🔧 Teknologi yang Digunakan
- **Express.js** – Web framework ringan untuk membangun API
- **Prisma ORM** – ORM modern yang menyediakan query builder type-safe
- **PostgreSQL** – Sistem manajemen basis data relasional
- **JWT** – Autentikasi dan otorisasi berbasis token
- **Multer** – Middleware untuk menangani file upload
- **node-cron** – Scheduler untuk menjalankan tugas otomatis
- **dotenv** – Manajemen konfigurasi environment
- **Joi / Zod** – Validasi skema data (jika digunakan)

### 🧩 Fitur Utama
- CRUD data entitas seperti:
  - Sekolah
  - Kelas
  - Mata Pelajaran
  - Pengguna
  - Tugas & Pengumpulan
- Autentikasi pengguna menggunakan JSON Web Token (JWT)
- Upload file dengan penyimpanan lokal melalui Multer
- Middleware untuk validasi request dan otorisasi akses
- Penjadwalan proses otomatis menggunakan `node-cron` (contoh: pembersihan data, pengingat)
- Arsitektur repository pattern dengan Prisma untuk akses data yang bersih dan reusable
- Struktur respons API yang konsisten dengan standar JSON

> Backend ini dikembangkan dengan mempertimbangkan kemudahan scaling, kolaborasi tim, dan fleksibilitas integrasi dengan frontend berbasis web atau mobile.


