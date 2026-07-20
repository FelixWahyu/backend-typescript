# Backend TypeScript Express & Prisma API

Repositori ini berisi backend berbasis **TypeScript**, **Express**, dan **Prisma ORM** dengan arsitektur modern **Feature-Based Modular**. Backend ini dirancang untuk menyediakan layanan API yang aman, berkinerja tinggi, dan terstruktur rapi untuk frontend developer.

---

## 🛠️ Tech Stack

* **Runtime & Bahasa**: Node.js & TypeScript
* **Framework**: Express.js
* **Database & ORM**: MySQL / MariaDB (direkomendasikan menggunakan Laragon) & Prisma ORM
* **Validasi Skema**: Zod
* **Otentikasi & Keamanan**: JSON Web Tokens (JWT), Bcrypt, Helmet, & CORS
* **Upload File**: Multer
* **Dokumentasi API**: Swagger UI (`swagger-ui-express`)

---

## ✨ Fitur Utama

1. **Arsitektur Berbasis Fitur (Feature-Based Modular)**: Setiap modul (Auth, User, Product, Category, Blog, Post) mengelola routing, controller, service, skema validasi, dan model tipe data secara mandiri di foldernya masing-masing.
2. **Sistem Keamanan Ganda (Auth)**:
   * Autentikasi berbasis **JWT Access Token** (jangka pendek) & **Hashed Refresh Token** (jangka panjang, tersimpan aman di database dengan enkripsi SHA-256).
   * Fitur **Logout Aman**: Menghapus Refresh Token dari database serta mendaftarkan Access Token aktif ke dalam **Token Blacklist** untuk mencegah penyalahgunaan token sebelum masa kedaluwarsa berakhir.
   * Pembersihan otomatis (*Auto-Cleanup*) terjadwal untuk menghapus token kedaluwarsa agar database tetap ringan.
3. **Produk & Galeri Dinamis**: CRUD produk yang mendukung upload gambar utama serta beberapa gambar galeri tambahan dengan validasi batasan ukuran file, otomatis menghapus file di direktori lokal jika proses upload/database gagal.
4. **Error Handling Terstandar**: Menangkap error global, kesalahan sintaksis skema validasi Zod, error relasi database Prisma (misal: duplikasi data/data tidak ditemukan), serta penanganan token tidak valid secara aman tanpa membocorkan informasi internal server ke client.
5. **Pagination & Pencarian**: Pencarian cepat, pagination teratur, dan filtering category di berbagai endpoint daftar data.

---

## 🚀 Panduan Instalasi & Penggunaan

### 1. Prasyarat
* Node.js versi 18 ke atas.
* MySQL/MariaDB database server (direkomendasikan menjalankan Laragon).

### 2. Kloning & Install Dependensi
```bash
# Install seluruh library pendukung
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env` di direktori utama, lalu sesuaikan konfigurasi koneksi database dan port:
```env
PORT=3000
NODE_ENV=development
API_VERSION=v1

# Contoh Koneksi Database MySQL (Laragon)
DATABASE_URL="mysql://root:@localhost:3306/nama_database_anda"

# Secret Key untuk Token Keamanan
JWT_ACCESS_SECRET="ganti_dengan_secret_key_panjang_anda_di_sini"
JWT_REFRESH_SECRET="ganti_dengan_secret_key_panjang_anda_di_sini"
```

### 4. Sinkronisasi Database (Prisma Migrations)
Jalankan migrasi database agar tabel-tabel terbuat otomatis di server MySQL Anda:
```bash
# Generate Prisma Client lokal
npx prisma generate

# Sinkronisasi skema ke database
npx prisma migrate dev
```

### 5. Jalankan Server
* **Mode Development** (auto reload saat ada perubahan kode):
  ```bash
  npm run dev
  ```
* **Mode Produksi** (kompilasi kode TypeScript ke JavaScript):
  ```bash
  npm run build
  npm start
  ```

---

## 📖 Dokumentasi API (Swagger)

Aplikasi ini dilengkapi dengan **Swagger UI** interaktif untuk mempermudah integrasi oleh frontend engineer. 

### Akses Dokumentasi
Setelah server berjalan, buka browser dan akses tautan berikut:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Cara Melakukan Uji Coba (Testing) Endpoint Terproteksi:
1. Jalankan endpoint **`POST /auth/login`** dengan data kredensial Anda untuk mendapatkan respon `accessToken` dan `refreshToken`.
2. Salin (**copy**) nilai `accessToken` tersebut.
3. Klik tombol **Authorize** (ikon gembok) di sudut kanan atas halaman Swagger UI.
4. Tempelkan (**paste**) token ke kolom input, lalu klik **Authorize** -> **Close**.
5. Buka endpoint terproteksi yang ingin Anda coba (misal: `/auth/me` atau CRUD admin), klik **Try it out** dan **Execute**.
6. Saat melakukan **`POST /auth/logout`**, pastikan Anda memasukkan nilai **`refreshToken`** (bukan access token) ke dalam JSON request body untuk menghapus sesi aktif di database secara permanen.
