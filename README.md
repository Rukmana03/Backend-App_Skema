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
- **Joi / Zod** – Validasi skema data 

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
- Penjadwalan proses otomatis menggunakan `node-cron` 
- Arsitektur repository pattern dengan Prisma untuk akses data yang bersih dan reusable
- Struktur respons API yang konsisten dengan standar JSON

  ## 🗂️ Struktur Folder

Berikut adalah struktur direktori dari proyek Backend-App_Skema:

├── controllers/ # Menangani permintaan masuk (request handler)
├── services/ # Berisi logika bisnis utama aplikasi
├── repositories/ # Abstraksi akses data ke database (menggunakan Prisma)
├── routes/ # Definisi dan pengelompokan endpoint API
├── middleware/ # Middleware untuk autentikasi, validasi, dll
├── validations/ # Validasi skema data request (opsional: Joi/Zod)
├── scheduler/ # Proses background terjadwal (node-cron)
├── utils/ # Fungsi-fungsi pembantu (helpers, formatter, dll)
├── prisma/
│ ├── schema.prisma # Skema Prisma untuk generate model & migrasi
│ └── migrations/ # Folder hasil migrasi Prisma
├── uploads/ # Direktori untuk menyimpan file yang diunggah
├── .env.example # Contoh konfigurasi environment
├── index.js # Entry point server aplikasi
└── package.json # File konfigurasi NPM dan dependencies

## 🚀 Cara Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek ini secara lokal:

### 1. Clone Repository
```bash
git clone https://github.com/Rukmana03/Backend-App_Skema.git
cd Backend-App_Skema
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Salin File .env
Buat file konfigurasi environment dari contoh yang tersedia:
```bash
cp .env.example .env
```

### 4. Konfigurasi Environment
Edit file `.env` sesuai pengaturan lokal Anda. Contoh isi:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/skema_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 5. Setup Prisma dan Database
Generate Prisma Client dan jalankan migrasi awal:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Jalankan Server
```bash
npm run dev
```

Server akan berjalan di:
```
http://localhost:3000
```

## ⚙️ Contoh Konfigurasi .env

Buat file `.env` di root proyek dan isi dengan konfigurasi berikut:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/skema_db

# JWT
JWT_SECRET=your_jwt_secret_key

# App
PORT=3000

# Cron & File
CRON_TIME=0 7 * * *
CRON_TIME_RESET=0 0 * * 0
UPLOAD_DIR=uploads
```

## 📡 Dokumentasi API

Berikut adalah beberapa endpoint utama dari Backend Skema berdasarkan koleksi Postman:

### 🔐 Autentikasi
| Method | Endpoint                        | Keterangan                     |
|--------|----------------------------------|--------------------------------|
| POST   | `/api/auth/login`               | Login dan dapatkan token       |
| POST   | `/api/auth/refresh-token`       | Refresh access token           |
| POST   | `/api/auth/logout`              | Logout pengguna                |
| POST   | `/api/auth/forgot-password`     | Kirim kode reset ke email      |
| POST   | `/api/auth/reset-password`      | Reset password                 |
| PUT    | `/api/auth/change-password`     | Ganti password akun login      |

### 👤 Manajemen Pengguna
| Method | Endpoint                        | Keterangan                         |
|--------|----------------------------------|------------------------------------|
| POST   | `/api/users/`                   | Tambah pengguna                    |
| PUT    | `/api/users/:id`                | Update data pengguna               |
| DELETE | `/api/users/:id`                | Hapus pengguna                     |
| GET    | `/api/users/`                   | Ambil semua pengguna               |
| GET    | `/api/users/:id`                | Ambil pengguna berdasarkan ID      |
| GET    | `/api/users/role/Student`       | Ambil semua siswa                  |
| GET    | `/api/users/role/Teacher`       | Ambil semua guru                   |

### 🏫 Sekolah & Tahun Ajaran
| Method | Endpoint                        | Keterangan                         |
|--------|----------------------------------|------------------------------------|
| GET/POST/PUT/DELETE | `/api/schools/` dan `/api/academic-years/` | CRUD sekolah dan tahun ajaran |

### 🏷️ Kelas & Mata Pelajaran
| Method | Endpoint                                | Keterangan                         |
|--------|------------------------------------------|------------------------------------|
| GET/POST/PUT/DELETE | `/api/class/`              | CRUD data kelas                    |
| GET    | `/api/class/:id/subjects`               | Ambil mata pelajaran dalam kelas   |
| GET    | `/api/class/:id/members`                | Ambil anggota kelas                |
| GET/POST/PUT/DELETE | `/api/subjects/`           | CRUD mata pelajaran                |

### 🧩 Relasi Subject-Class & Student-Class
| Method | Endpoint                                  | Keterangan                             |
|--------|--------------------------------------------|----------------------------------------|
| POST/PUT/DELETE | `/api/subject-class/`             | Atur pengajaran mata pelajaran         |
| POST/PUT        | `/api/student-class/`             | Kelola siswa dalam kelas               |
| POST            | `/api/student-class/promote`      | Naikkan kelas siswa                    |
| PUT             | `/api/student-class/move`         | Pindahkan siswa ke kelas lain          |

### 📄 Tugas & Pengumpulan
| Method | Endpoint                           | Keterangan                                |
|--------|-------------------------------------|-------------------------------------------|
| GET/POST/PUT/DELETE | `/api/assignments/`   | CRUD tugas                                |
| POST/PUT/DELETE     | `/api/submissions/`   | Kirim & update jawaban tugas              |
| GET                 | `/api/submissions/:id`| Lihat pengumpulan tugas                   |

### 🎓 Penilaian
| Method | Endpoint                             | Keterangan                             |
|--------|---------------------------------------|----------------------------------------|
| POST   | `/api/grades`                         | Tambahkan nilai                        |
| PATCH  | `/api/grades/:id`                     | Update nilai                           |
| GET    | `/api/grades/assignment/:id`          | Nilai berdasarkan tugas                |
| GET    | `/api/grades/student/:id`             | Nilai berdasarkan siswa                |

### 💬 Komentar
| Method | Endpoint                                | Keterangan                                 |
|--------|------------------------------------------|--------------------------------------------|
| POST   | `/api/comments/assignment/:id`          | Komentar ke tugas                          |
| POST   | `/api/comments/submission/:id`          | Komentar ke jawaban                        |
| GET    | `/api/comments/assignment/:id`          | Ambil komentar dari tugas                  |
| GET    | `/api/comments/submission/:id`          | Ambil komentar dari pengumpulan tugas      |

### 📁 Manajemen File
| Method | Endpoint                                     | Keterangan                                |
|--------|-----------------------------------------------|-------------------------------------------|
| POST   | `/api/files/upload-files/:assignmentId`       | Upload file untuk tugas                   |
| GET    | `/api/files/submission/:submissionId`         | Ambil file jawaban                        |
| GET    | `/api/files/assignment/:assignmentId`         | Ambil file tugas                          |
| GET    | `/api/files/download/:fileId`                 | Unduh file                                |

---

🔗 **Link Koleksi Postman:**
[Klik di sini untuk mengakses koleksi Postman](https://red-meteor-460720.postman.co/workspace/skema-app~ae21d076-66f5-4fd0-b6a3-ae28704b6655/collection/29645213-ee2aa288-c9d3-4f35-a824-6f6d52a28bfa?action=share&source=collection_link&creator=40872524)



> Gantilah `user`, `password`, dan nama database sesuai dengan database lokal Anda.
> Pastikan Anda sudah menginstall dan menjalankan PostgreSQL secara lokal, serta `DATABASE_URL` mengarah ke database yang valid.
> Backend ini dikembangkan dengan mempertimbangkan kemudahan scaling, kolaborasi tim, dan fleksibilitas integrasi dengan frontend berbasis web atau mobile.


