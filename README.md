# Fei's Digital Space

Website personal **Link in Bio** untuk Syafei Alhizarroh Syafutra (Fei). Satu halaman statis berisi profil, tautan media sosial, portofolio, kontak, dan pemutar musik opsional. Dibuat dengan **HTML5, CSS3, dan JavaScript vanilla** tanpa framework dan tanpa build tools, siap dipasang di bio Instagram lewat **Vercel**.

> Tagline: *Create yourself, don't wait to be found.*

## Fitur

- Mobile-first, responsif untuk ponsel, tablet, dan desktop
- Foto sampul dan thumbnail dari Unsplash (gratis), otomatis kembali ke ilustrasi jika gagal dimuat
- Light mode (cream, putih, biru muda) dan dark mode (navy, biru terang). Pilihan tersimpan di `localStorage`
- Link hub 10 tombol dengan ikon, deskripsi, efek hover, dan efek saat ditekan
- Filter proyek: All, Web, Application, Networking
- Formulir kontak yang jujur: tidak ada notifikasi "terkirim" palsu (lihat bagian Formulir Kontak)
- Pemutar musik minimalis, tidak pernah memutar otomatis
- Tombol salin tautan, notifikasi toast, loader ringan, navigasi aktif saat scroll
- Aksesibilitas: link lewati konten, fokus keyboard terlihat, label ARIA, menghormati *reduced motion*
- Metadata SEO dan Open Graph

## Struktur Folder

```text
feis-digital-space/
├── index.html            Kerangka halaman + metadata SEO / Open Graph
├── css/
│   └── style.css         Semua gaya + token warna (light & dark)
├── js/
│   ├── config.js         ★ File yang kamu edit: profil, tautan, proyek, kontak
│   └── script.js         Logika halaman (membaca config.js)
├── assets/
│   ├── images/           profile-placeholder.png, project-placeholder.png, og-image.png
│   ├── icons/            favicon.svg
│   └── audio/            Taruh file lagu legal di sini
├── README.md
├── vercel.json           Konfigurasi Vercel (header keamanan & cache)
└── .gitignore
```

## Menjalankan Secara Lokal

Cara paling mudah: **klik dua kali `index.html`**. Halaman langsung terbuka di browser.

Agar sama persis dengan kondisi saat online (disarankan), jalankan server lokal dari dalam folder proyek:

```bash
# pilih salah satu
python3 -m http.server 8000
npx serve .
```

Lalu buka `http://localhost:8000`.

> Ikon (Font Awesome) dan font (Google Fonts) dimuat dari internet, jadi perlu koneksi saat pertama membuka.

## Mengganti Isi Website (Cukup Edit `js/config.js`)

Semua teks, tautan, proyek, dan kontak ada di `js/config.js`. Kamu tidak perlu menyentuh HTML, CSS, atau `script.js`.

### Mengganti foto profil

1. Siapkan foto persegi (disarankan 600×600 piksel, format PNG atau JPG, di bawah 300 KB).
2. Simpan di `assets/images/`, misalnya `foto-fei.jpg`.
3. Di `js/config.js`, ubah:
   ```js
   photo: "assets/images/foto-fei.jpg",
   ```

### Mengedit tautan

Di `js/config.js`, bagian `links`. Ganti nilai `url`:

```js
{ id: "instagram", icon: "fa-brands fa-instagram", title: "Instagram",
  desc: "Keseharian dan cerita singkat",
  url: "https://instagram.com/usernamekamu", newTab: true },
```

- **Menambah tautan:** salin satu blok `{ ... }` dan ubah isinya.
- **Menghapus tautan:** hapus blok tersebut.
- **Mengubah urutan:** pindahkan blok ke atas atau bawah.
- **Ikon:** cari nama kelas di [fontawesome.com/icons](https://fontawesome.com/icons).
- **Format WhatsApp:** `https://wa.me/628123456789` (kode negara tanpa tanda `+`).
- **Format email:** `mailto:nama@email.com`.

**Tentang placeholder:** semua nilai berisi kata `GANTI` dianggap belum diisi. Tombolnya tampil dengan garis putus-putus, dan saat diklik hanya memunculkan pengingat, tidak membuka alamat palsu. Setelah kamu isi URL asli, tampilan dan fungsinya otomatis normal. Hal yang sama berlaku untuk tombol **Live Demo** dan **Source Code** pada proyek (kosongkan `""` jika belum ada).

### Mengganti foto sampul dan gambar dari internet

- **Sampul hero:** ubah `profile.cover` dengan URL gambar. Kosongkan `""` untuk memakai ilustrasi langit dan gunung.
- **Thumbnail proyek:** isi `image` pada proyek dengan URL gambar (atau path lokal). `imagePos` mengatur bagian gambar yang tampil.
- Gambar bawaan berasal dari [Unsplash](https://unsplash.com) dan gratis dipakai di bawah Unsplash License (kredit fotografer ada di footer). Jika ganti, pilih foto bertanda *Free to use*, bukan *Unsplash+*.
- Gambar dari internet dimuat langsung dari server asalnya. Agar lebih stabil, unduh fotonya, simpan di `assets/images/`, lalu isi path lokalnya.
- Jika gambar gagal dimuat, halaman otomatis memakai ilustrasi atau emoji cadangan.

### Mengedit proyek

Bagian `projects` di `config.js`. Isi `demo` dan `source` dengan URL asli ketika sudah ada. Untuk thumbnail gambar, simpan file di `assets/images/` lalu isi `image: "assets/images/nama.png"`. Jika kosong, dipakai emoji pada `emoji`.

### Mengganti warna dan tema

Buka `css/style.css`, bagian paling atas:

- `:root { ... }` adalah **token light mode**
- `[data-theme="dark"] { ... }` adalah **token dark mode**

Ubah nilai seperti `--accent` (warna aksen), `--bg` (latar), `--surface` (kartu), `--ink` (teks). Seluruh halaman mengikuti otomatis. Font diganti di tag `<link>` Google Fonts pada `index.html` dan properti `font-family` di `style.css`.

### Formulir kontak

Website statis tidak punya server, jadi formulir tidak bisa mengirim pesan sendiri. Ada dua mode:

1. **Tanpa layanan (default):** `formEndpoint: ""`. Tombol Kirim membuka aplikasi email kamu dengan pesan yang sudah terisi (`mailto:`). Isi `contact.email` dengan emailmu.
2. **Dengan layanan formulir:** daftar gratis di [Formspree](https://formspree.io) (atau sejenisnya), buat form, lalu tempel endpoint-nya:
   ```js
   formEndpoint: "https://formspree.io/f/xxxxxxxx"
   ```
   Notifikasi sukses hanya muncul bila layanan benar-benar menerima pesan.

### Pemutar musik

1. Simpan file audio legal (milikmu sendiri atau bebas hak cipta) di `assets/audio/`.
2. Isi `music` di `config.js`:
   ```js
   music: { enabled: true, title: "Judul Lagu", artist: "Nama Artis", src: "assets/audio/lagu.mp3" }
   ```
3. Untuk menyembunyikan pemutar: `enabled: false`.

Selama `src` kosong, pemutar tampil nonaktif. Musik tidak pernah diputar otomatis.

### Metadata SEO dan Open Graph

Setelah mendapat domain Vercel, buka `index.html` dan ganti semua `https://GANTI-DOMAIN.vercel.app` (ada di `canonical`, `og:url`, `og:image`, `twitter:image`) dengan domain aslimu. Pratinjau tautan di Instagram/WhatsApp memakai `assets/images/og-image.png` (1200×630). Ganti gambar itu bila ingin tampilan sendiri. Judul dan deskripsi juga bisa diubah di bagian `<head>`.

## Mengunggah ke GitHub

1. Buat akun di [github.com](https://github.com), lalu buat repository baru (mis. `feis-digital-space`), kosong tanpa README.
2. Di terminal, dari dalam folder proyek:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Fei's Digital Space"
   git branch -M main
   git remote add origin https://github.com/USERNAME/feis-digital-space.git
   git push -u origin main
   ```
   Ganti `USERNAME` dengan username GitHub kamu.

   Tanpa terminal: di halaman repository klik **Add file → Upload files**, seret seluruh isi folder (bukan file ZIP-nya), lalu **Commit changes**.

## Menghubungkan ke Vercel dan Deployment

1. Masuk ke [vercel.com](https://vercel.com) dengan akun GitHub.
2. Klik **Add New… → Project**, pilih repository `feis-digital-space`, klik **Import**.
3. Pengaturan:
   - **Framework Preset:** `Other`
   - **Build Command:** kosongkan
   - **Output Directory:** kosongkan (root)
4. Klik **Deploy**. Dalam sekitar satu menit situs aktif di `https://nama-proyek.vercel.app`.
5. Setiap kali kamu `git push`, Vercel otomatis men-deploy versi terbaru.
6. Salin URL Vercel ke bio Instagram, lalu perbarui `GANTI-DOMAIN` di `index.html` (lihat bagian SEO).

Domain sendiri (opsional): **Project → Settings → Domains → Add**.

### Deploy tanpa GitHub (opsional)

```bash
npm i -g vercel
vercel        # preview
vercel --prod # produksi
```

## Daftar Periksa Sebelum Dibagikan

- [ ] Semua `GANTI...` di `js/config.js` sudah diisi (atau tombolnya kamu hapus)
- [ ] Foto profil sudah diganti
- [ ] `contact.email` terisi dan formulir sudah dites
- [ ] `GANTI-DOMAIN` di `index.html` sudah diganti
- [ ] Coba buka dari ponsel dan uji dark mode

## Lisensi

Bebas dipakai dan dimodifikasi untuk keperluan pribadi. Ikon oleh Font Awesome Free, font oleh Google Fonts, foto oleh Niklas Ohlrogge dan Christopher Gower via Unsplash.
