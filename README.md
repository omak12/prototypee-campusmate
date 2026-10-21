# CampusMate – Prototipe Web

Prototipe aplikasi mobile **CampusMate** (Universitas Madura) versi web. Dibuat dengan HTML, CSS, dan JavaScript murni, tanpa framework dan tanpa build step.

## Alur yang sudah berfungsi

| Aksi | Tujuan |
| --- | --- |
| Tombol **Masuk** di Login | Beranda |
| Kartu **3 Kelas** (Beranda) | Halaman **Jadwal** |
| Kartu **4 Tugas** (Beranda) | Halaman **Tugas** |
| Kartu **Deadline terdekat** (Beranda) | Halaman **Info** |
| Menu bawah (Beranda, Jadwal, Tugas, Info, Profil) | Halaman masing-masing |
| Tombol **Log Out** (Profil) | Halaman "Kamu telah keluar" |
| Tombol **Masuk Kembali** | Login |

Tambahan kecil di luar prototipe: pilihan hari di Jadwal bisa diklik (hanya Selasa yang berisi data contoh), dan lingkaran centang di Tugas bisa ditandai selesai (jumlah tugas di Beranda ikut berubah).

> Semua data (nama, jadwal, tugas, tanggal, pengumuman) adalah **data contoh** dari prototipe.

## Struktur

Semua file berada di satu folder (tanpa subfolder):

```
index.html
style.css
app.js
logo-unira.png
favicon.png
```

## Jalankan di komputer

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
npx serve .
# atau
python3 -m http.server 8000
```

## Upload ke GitHub

```bash
git init
git add .
git commit -m "CampusMate prototype web"
git branch -M main
git remote add origin https://github.com/USERNAME/campusmate.git
git push -u origin main
```

## Deploy ke Vercel

1. Buka https://vercel.com dan masuk dengan akun GitHub.
2. Klik **Add New… → Project**, lalu pilih repositori `campusmate`.
3. Biarkan **Framework Preset = Other**, kosongkan Build Command dan Output Directory.
4. Klik **Deploy**. Setiap `git push` berikutnya akan otomatis ter-deploy.

Navigasi memakai hash (`#/jadwal`), jadi tidak perlu konfigurasi rewrite.
