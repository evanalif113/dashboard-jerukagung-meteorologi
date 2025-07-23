# Proyek Dasbor Cuaca - Stasiun Meteorologi Jerukagung

Proyek ini adalah aplikasi dasbor cuaca real-time yang dibangun dengan Next.js dan di-hosting di Cloudflare. Aplikasi ini mengambil dan memvisualisasikan data sensor dari Firebase Realtime Database.

## ✨ Fitur

-   **Visualisasi Data Real-time**: Menampilkan data cuaca terkini dalam bentuk grafik dan angka.
-   **Metrik Cuaca Lengkap**: Meliputi suhu, kelembapan, tekanan udara, titik embun, curah hujan, kecepatan angin, dan lainnya.
-   **Filter Waktu Dinamis**: Pengguna dapat memilih rentang waktu data yang ingin ditampilkan (misalnya, 60 menit terakhir, 24 jam terakhir).
-   **Data Astronomi**: Menampilkan informasi fase bulan, waktu matahari terbit/terbenam, dan panjang hari.
-   **Tema Terang & Gelap**: Dukungan untuk mode terang dan gelap yang dapat disesuaikan dengan preferensi sistem.
-   **Desain Responsif**: Antarmuka yang dioptimalkan untuk perangkat desktop dan seluler.

## 🛠️ Teknologi yang Digunakan

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Komponen UI**: [shadcn/ui](https://ui.shadcn.com/)
-   **Database**: [Firebase Realtime Database](https://firebase.google.com/products/realtime-database)
-   **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) dengan [OpenNext](https://open-next.js.org/)

## 🚀 Memulai

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

### 1. Prasyarat

-   Node.js (versi 18.x atau lebih baru)
-   npm, yarn, atau pnpm

### 2. Instalasi

1.  **Kloning repositori:**
    ```bash
    git clone https://github.com/evanalif113/weather-dashboard.git
    cd weather-dashboard
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Variabel Lingkungan:**
    Buat file `.env.local` di direktori root proyek dan tambahkan kredensial Firebase Anda. Anda bisa menemukannya di konsol Firebase proyek Anda.

    ```env
    # filepath: .env.local
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

### 3. Menjalankan Server Pengembangan

Setelah instalasi selesai, jalankan server pengembangan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## 📂 Struktur Proyek

-   `app/`: Direktori utama untuk halaman dan layout (menggunakan App Router Next.js).
-   `components/`: Komponen React yang dapat digunakan kembali.
    -   `ui/`: Komponen UI dari shadcn/ui.
-   `lib/`: Berisi fungsi utilitas, termasuk koneksi Firebase ([`FirebaseConfig.ts`](lib/FirebaseConfig.ts)) dan logika pengambilan data ([`FetchingSensorData.ts`](lib/FetchingSensorData.ts)).
-   `public/`: Aset statis seperti gambar dan ikon.
-   `styles/`: File CSS global.
-   `next.config.mjs`: File konfigurasi Next.js.
-   `open-