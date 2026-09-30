# Sistem Remote & Display Video Peresmian

Aplikasi web pengendali realtime berbasis WebSocket untuk sinkronisasi layar proyektor panggung dan tablet pejabat.

## Fitur Utama
1. **Layar Proyektor (`/display`)**:
   - Tampilan Fullscreen & borderless steril.
   - Fitur **ARM & Fullscreen** overlay (memenuhi policy browser HTML5 autoplay audio).
   - Sinkronisasi realtime nol jeda (WebSocket native).
   - Status ended otomatis lapor balik ke remote.

2. **Remote Tablet (`/remote`)**:
   - Proteksi PIN sederhana (Default: `1234`).
   - Tombol raksasa bercahaya `RESMIKAN` (dengan haptic vibration pada tablet/HP).
   - Tombol `RESET` dengan dialog konfirmasi agar tidak kepencet tidak sengaja.
   - Status badge realtime koneksi WebSocket & status pemutaran video.

## Cara Menjalankan

1. **Jalankan Server**:
   ```bash
   cd ~/projects/peresmian-display
   npm start
   ```

2. **Taruh Video Peresmian**:
   - Taruh file video peresmian kam di folder `public/video.mp4`.

3. **Buka di Browser**:
   - Proyektor / Laptop: `http://<IP_KOMPUTER>:3300/display`
   - Tablet Pejabat: `http://<IP_KOMPUTER>:3300/remote`
   - PIN Default: `1234`
