# Aplikasi BK - Manajemen Laporan Siswa

Aplikasi ini dibuat untuk membantu guru dalam mengelola laporan siswa, khususnya untuk mencatat dan memantau siswa-siswa yang membutuhkan perhatian lebih (misalnya siswa yang nakal). Dengan aplikasi ini, guru dapat dengan mudah membuat laporan, mengedit, dan memonitor perkembangan siswa tanpa kesulitan dalam pencatatan manual.

## Deskripsi
Aplikasi ini memungkinkan dua jenis pengguna untuk mengakses sistem:
- **Admin**: Dapat mengelola laporan siswa, termasuk menambah, mengedit, dan menghapus data laporan siswa. Namun, Admin tidak dapat mengelola pengguna (user).
- **SuperAdmin**: Memiliki hak akses penuh, dapat menambah dan mengelola pengguna (user) selain mengelola laporan siswa.

Aplikasi ini dirancang dengan antarmuka yang sederhana dan mudah digunakan, dengan dukungan untuk responsivitas di berbagai perangkat.

## Fitur Utama
- **Login/Logout**: Pengguna dapat masuk menggunakan akun mereka (Admin/SuperAdmin).
- **Manajemen Laporan Siswa**: Admin dan SuperAdmin dapat menambah, mengedit, dan menghapus laporan siswa terkait pelanggaran atau masalah lain.
- **Peran Pengguna (Role-Based Access)**: 
  - **Admin**: Dapat mengelola laporan siswa tetapi tidak dapat menambah, mengubah, atau menghapus pengguna.
  - **SuperAdmin**: Dapat mengelola laporan siswa dan pengguna, termasuk menambah dan mengubah hak akses pengguna lainnya.
- **Antarmuka Responsif**: Dengan menggunakan Tailwind CSS, tampilan aplikasi dapat menyesuaikan dengan ukuran layar perangkat apapun.
- **Autentikasi Pengguna**: Menggunakan Firebase Authentication untuk sistem login yang aman.

## Teknologi yang Digunakan
1. **React**: Digunakan untuk membangun antarmuka aplikasi, memastikan aplikasi berjalan dengan lancar dan interaktif.
2. **Tailwind CSS**: Mempermudah styling antarmuka dengan utility-first CSS yang memungkinkan penyesuaian cepat dan fleksibel.
3. **Material UI**: Digunakan untuk menyediakan komponen UI yang siap pakai dan konsisten, seperti tombol, form, tabel, dan popover.
4. **Firebase**: Menyediakan backend untuk autentikasi pengguna dan penyimpanan data siswa (menggunakan Firestore).
   - **Firebase Firestore**: Penyimpanan data siswa dan laporan mereka secara real-time.
   - **Firebase Authentication**: Sistem autentikasi untuk login pengguna.

## Instalasi
### 1. Clone Repository
Untuk memulai, clone repository aplikasi ini dengan perintah berikut:
```bash
git clone https://github.com/HanBrokenHome/AplikasiBk
