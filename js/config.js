/* ==========================================================================
   config.js — SATU-SATUNYA file yang perlu kamu edit untuk mengganti isi web.
   Semua teks, tautan, proyek, dan kontak dibaca dari sini oleh js/script.js.

   Aturan placeholder:
   - Nilai yang mengandung kata "GANTI" (atau kosong "") dianggap BELUM DIISI.
   - Tautan yang belum diisi tetap tampil, tetapi saat diklik hanya memunculkan
     notifikasi pengingat (tidak membuka alamat palsu).
   - Setelah kamu isi dengan URL asli, tombol otomatis berfungsi normal.
   ========================================================================== */

window.SITE_CONFIG = {

  /* ---------- Info situs ---------- */
  site: {
    name: "Fei's Digital Space"
    // Judul tab & Open Graph ada di index.html (bagian <head>). Lihat README.
  },

  /* ---------- Profil (bagian Hero) ---------- */
  profile: {
    fullName: "Syafei Alhizarroh Syafutra",
    nickname: "Fei",
    tagline: "Create yourself, don't wait to be found.",
    role: "Student | Tech Enthusiast | Future Engineer",
    fields: ["Networking", "Programming", "Cybersecurity", "AI", "Robotics"],
    status: "Exploring the Future 🚀",
    // Ganti dengan fotomu: taruh file di assets/images/ lalu ubah nama file di sini.
    photo: "assets/images/profile-placeholder.png",
    photoAlt: "Foto profil Fei",
    // Foto sampul bagian atas kartu (foto gratis dari Unsplash, dimuat dari internet).
    // Ganti dengan URL gambar lain, atau kosongkan "" untuk memakai ilustrasi langit dan gunung.
    cover: "assets/images/og-image.png"
  },

  /* ---------- Link hub ----------
     icon  : kelas Font Awesome (https://fontawesome.com/icons)
     newTab: true = buka di tab baru
     Tambah / hapus / ubah urutan: cukup tambah, hapus, atau pindahkan satu blok { ... }. */
  links: [
    { id: "instagram", icon: "fa-brands fa-instagram", title: "Instagram", desc: "Keseharian dan cerita singkat", url: "https://instagram.com/GANTI_USERNAME", newTab: true },
    { id: "tiktok",    icon: "fa-brands fa-tiktok",    title: "TikTok",    desc: "Video pendek seputar teknologi", url: "https://tiktok.com/@GANTI_USERNAME", newTab: true },
    { id: "github",    icon: "fa-brands fa-github",    title: "GitHub",    desc: "Kode dan proyek open source", url: "https://github.com/GANTI_USERNAME", newTab: true },
    { id: "linkedin",  icon: "fa-brands fa-linkedin-in", title: "LinkedIn", desc: "Profil profesional dan koneksi", url: "https://linkedin.com/in/GANTI_USERNAME", newTab: true },
    { id: "youtube",   icon: "fa-brands fa-youtube",   title: "YouTube",   desc: "Tutorial dan dokumentasi proyek", url: "https://youtube.com/@GANTI_USERNAME", newTab: true },
    { id: "whatsapp",  icon: "fa-brands fa-whatsapp",  title: "WhatsApp",  desc: "Chat langsung, dibalas secepatnya", url: "https://wa.me/GANTI_NOMOR_TANPA_PLUS", newTab: true },
    { id: "email",     icon: "fa-solid fa-envelope",   title: "Email",     desc: "Untuk kerja sama dan pertanyaan", url: "mailto:GANTI@email.com", newTab: false },
    { id: "website",   icon: "fa-solid fa-globe",      title: "Website Pribadi", desc: "Rumah digital saya yang lain", url: "https://GANTI-WEBSITE-KAMU.example", newTab: true },
    { id: "portfolio", icon: "fa-solid fa-briefcase",  title: "Portofolio", desc: "Kumpulan karya terpilih", url: "#projects", newTab: false },
    { id: "cv",        icon: "fa-solid fa-file-lines", title: "Curriculum Vitae", desc: "Lihat atau unduh CV terbaru", url: "https://GANTI-LINK-CV.example", newTab: true }
  ],

  /* ---------- Proyek ----------
     category : salah satu dari `categories` di bawah (selain "All")
     emoji    : dipakai sebagai ilustrasi thumbnail jika `image` kosong
     image    : (opsional) path lokal ("assets/images/proyek-1.png") atau URL gambar dari internet.
                Jika gagal dimuat, otomatis kembali ke emoji.
     imagePos : (opsional) posisi potong gambar, mis. "50% 30%"
     demo / source : isi URL asli. Kosongkan ("") jika belum ada — tombol tampil nonaktif. */
  categories: ["All", "Web", "Application", "Networking"],
  projects: [
    {
      title: "Habit Tracker Web App",
      desc: "Aplikasi web untuk mencatat kebiasaan harian dan melihat perkembangannya dari waktu ke waktu.",
      category: "Web", emoji: "🌱", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=75", imagePos: "30% 50%",
      tech: ["HTML", "CSS", "JavaScript"],
      demo: "verify.html?project=habit-tracker", source: ""
    },
    {
      title: "Drink Sales Cashier App",
      desc: "Aplikasi kasir untuk usaha minuman: pilih menu, hitung pesanan, dan catat penjualan.",
      category: "Application", emoji: "🥤", image: "",
      tech: ["Next.js", "Supabase"],
      demo: "verify.html?project=cashier-app", source: ""
    },
    {
      title: "QR Attendance System",
      desc: "Sistem absensi berbasis QR Code untuk mencatat kehadiran anggota kegiatan dengan cepat.",
      category: "Application", emoji: "📲", image: "",
      tech: ["AppSheet", "Google Sheets", "QR Code"],
      demo: "verify.html?project=qr-attendance", source: ""
    },
    {
      title: "Networking Projects",
      desc: "Kumpulan latihan dan konfigurasi jaringan, dari routing dasar sampai hotspot dengan MikroTik.",
      category: "Networking", emoji: "🛰️", image: "",
      tech: ["MikroTik", "Linux", "Routing"],
      demo: "", source: ""
    },
    {
      title: "Personal Website",
      desc: "Website personal ini: satu halaman tautan yang ringan, responsif, dan mudah diubah lewat config.",
      category: "Web", emoji: "☁️", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=75", imagePos: "80% 40%",
      tech: ["HTML5", "CSS3", "JavaScript"],
      demo: "", source: ""
    }
  ],

  /* ---------- Kontak ----------
     buttons     : id dari daftar `links` yang tampil sebagai tombol kontak
     email       : alamat email tujuan (dipakai formulir saat formEndpoint kosong)
     formEndpoint:
        ""  (kosong) -> tombol Kirim membuka aplikasi email dengan isi pesan sudah terisi (mailto).
        "https://formspree.io/f/xxxx" -> pesan dikirim lewat layanan formulir.
        Notifikasi sukses HANYA muncul jika layanan benar-benar menerima pesan. */
  contact: {
    heading: "Let's build something great together!",
    text: "Punya ide, proyek, atau sekadar ingin menyapa? Kirim pesan, saya senang mengobrol.",
    buttons: ["whatsapp", "email", "instagram", "github"],
    email: "alhzrrh5@email.com",
    formEndpoint: ""
  },

  /* ---------- Pemutar musik (opsional) ----------
     enabled: false untuk menyembunyikan pemutar.
     src    : path file audio lokal (mis. "assets/audio/lagu.mp3") atau URL audio legal.
              Kosong = pemutar tampil nonaktif. Musik TIDAK pernah diputar otomatis. */
  music: {
    enabled: true,
    title: "the sound of my all-time favorite musical instrument",
    artist: "Jacob Pianist",
    src: "assets/audio/canon-jacobpiano.mp3"
  },

  /* ---------- Footer ---------- */
  footer: {
    text: "Made with ♡ by Fei",
    socials: ["instagram", "tiktok", "github", "linkedin", "youtube"]
  },
  /* ---------- Supabase ---------- */
  supabase: {
    url: "https://ktnerldmbivprhzsdugi.supabase.co",
    publishableKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bmVybGRtYml2cHJoenNkdWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTkyMjksImV4cCI6MjEwNjg5NTIyOX0.bqHRdU8yG-NxJp9rODDlWxgMFcWRKl_j2jhK1VMu-qA"
  }
};
