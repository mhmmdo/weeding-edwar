# Undangan Pernikahan Digital — Capt. Edwar & dr. Icha

Website undangan pernikahan digital premium, mobile-first, sangat cepat dimuat, ringan, dan aksesibel. Dibangun menggunakan teknologi web murni: **HTML5, CSS3, dan Vanilla JavaScript** tanpa library eksternal yang berat, tanpa database, dan tanpa proses build/kompilasi.

Proyek ini siap diunggah langsung ke web hosting static, VPS, GitHub Pages, Netlify, Vercel, atau cPanel.

---

## Struktur Folder Proyek

```text
wedding-invitation/
├── index.html               # Halaman utama undangan (markup & SEO)
├── README.md                # Dokumentasi proyek (file ini)
├── css/
│   └── style.css            # Pengaturan layout, variabel warna, & animasi
├── js/
│   ├── invitation-data.js   # Konfigurasi data mempelai, acara, & musik (EDIT DI SINI)
│   └── script.js            # Logika interaksi, galeri scroll-snap, audio, & modal
└── assets/
    ├── images/
    │   ├── cover.jpg               # Foto vertikal (sampul awal)
    │   ├── couple-horizontal.jpg   # Foto mendatar (konten profil)
    │   ├── gallery-1.jpg           # Galeri foto 1 (portrait)
    │   └── gallery-2.jpg           # Galeri foto 2 (portrait)
    ├── music/
    │   └── wedding-song.m4a        # File musik latar belakang (M4A atau MP3)
    └── icons/
        └── favicon.svg             # Favicon website (SVG ringan)
```

---

## Cara Menjalankan Website

Karena website ini adalah *static website*, Anda tidak memerlukan instalasi node_modules, npm, atau package manager apa pun. Anda dapat membukanya dengan beberapa cara berikut:

### Metode 1: Buka Langsung (Tanpa Server)
Cukup klik ganda (double-click) file `index.html` pada komputer Anda untuk langsung membukanya di browser (Chrome, Safari, Edge, Firefox).
*Catatan: Beberapa browser memblokir fungsi audio lokal (`file://`) karena kebijakan keamanan browser. Gunakan Metode 2 atau 3 agar fungsi musik berjalan sempurna.*

### Metode 2: Menggunakan Visual Studio Code Live Server (Direkomendasikan)
1. Buka folder proyek ini di VS Code.
2. Pasang ekstensi **Live Server** (jika belum ada).
3. Klik tombol **Go Live** di sudut kanan bawah VS Code.
4. Browser akan terbuka otomatis di alamat `http://127.0.0.1:5500`.

### Metode 3: Server Lokal Sederhana Python
Jika komputer Anda memiliki Python terinstal, jalankan perintah ini di terminal dalam direktori proyek:
*   Untuk Python 3: `python -m http.server 8000`
*   Untuk Python 2: `python -m SimpleHTTPServer 8000`

Buka browser di alamat `http://localhost:8000`.

---

## Cara Mengubah Data Undangan

Semua konfigurasi data disimpan dalam satu file: `js/invitation-data.js`. **Anda tidak perlu mengedit file `index.html`** untuk mengubah konten undangan.

Buka file `js/invitation-data.js` menggunakan text editor dan sesuaikan isinya:

### 1. Nama Pasangan dan Gelar
Ganti nilai di dalam tanda kutip pada objek `couple`:
```javascript
groom: {
    shortName: "Captain Edwar",
    fullName: "Capt. Muhammad Edwar, S.E., M.M., M.Mar.",
    title: "Capt.",
    ...
}
```

### 2. Informasi Orang Tua
Jika nama orang tua belum tersedia, kosongkan stringnya (`""`). Sistem secara otomatis akan menyembunyikan tulisan "Putra dari" atau "Putri dari" di halaman website agar tidak ada tampilan kosong:
```javascript
groom: {
    ...
    fatherName: "", // Kosongkan
    motherName: ""  // Kosongkan
}
```

### 3. Mengubah atau Menambah Acara
Anda dapat menambah acara baru (misalnya Akad Nikah, Resepsi, Unduh Mantu) dengan menambahkan objek baru di dalam array `events`. Website akan mendeteksinya secara dinamis:
```javascript
events: [
    {
        name: "Akad Nikah",
        date: "Minggu, 24 Agustus 2026",
        startTime: "08.00 WITA",
        endTime: "Selesai",
        venue: "Masjid Raya",
        address: "Jl. Protokol No. 1",
        mapUrl: "https://maps.google.com/...", // Tombol maps akan otomatis disembunyikan jika dikosongkan
        calendarTitle: "Akad Nikah Edwar & Icha"
    }
]
```

### 4. Memasukkan Google Maps (Iframe Embed)
Untuk menampilkan peta interaktif di bagian Lokasi Acara:
1. Buka Google Maps di browser, cari lokasi acara Anda.
2. Klik tombol **Bagikan (Share)** -> pilih tab **Sematkan peta (Embed a map)**.
3. Salin tautan URL yang berada di dalam atribut `src` iframe tersebut (hanya URL-nya saja yang dimulai dengan `https://www.google.com/maps/embed...`).
4. Masukkan URL tersebut ke dalam `mapEmbedUrl` di `js/invitation-data.js`:
```javascript
location: {
    venue: "Nama Gedung Utama",
    address: "Alamat lengkap...",
    mapUrl: "https://maps.google.com/...", // Link peta redirect tombol
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=..." // Letakkan di sini
}
```
*Jika `mapEmbedUrl` dikosongkan (`""`), frame peta interaktif tidak akan ditampilkan tetapi teks alamat dan tombol penunjuk jalan tetap muncul rapi.*

*Catatan Barcode (QR Code): Website secara otomatis menghasilkan sebuah QR Code lokasi berwarna navy di atas peta jika field `mapUrl` diisi. QR Code ini memudahkan tamu yang membuka undangan di desktop/komputer untuk memindai dan membuka arah lokasi Maps langsung menggunakan smartphone mereka.*

### 5. Pengaturan Musik
Anda dapat mematikan lagu undangan atau menyesuaikan volume suaranya:
```javascript
music: {
    enabled: true,               // Ubah ke false jika tidak ingin ada musik sama sekali
    file: "assets/music/wedding-song.m4a",
    title: "Wedding Song",
    autoplayAfterOpen: true,     // Lagu mulai berputar otomatis saat tombol Buka Undangan ditekan
    defaultVolume: 0.45          // Volume awal (nilai antara 0.0 hingga 1.0)
}
```

---

## Panduan Ukuran & Optimasi Gambar

Untuk menjaga kecepatan memuat website (elegan dan premium), pastikan gambar dioptimalkan sebelum diunggah ke server:

1.  **cover.jpg**: Foto vertikal/portrait (Rasio 3:4 atau 9:16). Disarankan resolusi sekitar `1080 × 1440` piksel. Foto ini digunakan sebagai halaman sampul utama.
2.  **couple-horizontal.jpg**: Foto horizontal/landscape (Rasio 3:2). Disarankan resolusi sekitar `1200 × 800` piksel.
3.  **gallery-1.jpg & gallery-2.jpg**: Foto portrait untuk galeri. Disarankan resolusi `800 × 1000` piksel.
4.  **Optimasi Ukuran**: Kompres gambar Anda menggunakan alat seperti [TinyJPG](https://tinyjpg.com/) untuk mengurangi ukuran berkas di bawah 300KB per gambar tanpa mengurangi kualitas visual secara signifikan. Format `.webp` sangat disarankan untuk performa loading terbaik, namun berkas `.jpg` asli tetap didukung.

---

## Cara Unggah ke Hosting / Server

Setelah Anda selesai mengedit data dan gambar:
1. Pilih semua file di dalam folder `wedding-invitation/` (termasuk `index.html`, folder `css`, `js`, `assets`).
2. Masukkan ke dalam arsip ZIP.
3. Masuk ke panel hosting Anda (misalnya cPanel, DirectAdmin, Plesk, atau dashboard Netlify/Vercel).
4. Unggah dan ekstrak arsip ZIP tersebut ke folder `public_html` atau direktori root server Anda.
5. Undangan digital Anda siap diakses oleh para tamu undangan!
