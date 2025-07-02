# simple_fatigue_alarm
Project ini merupakan adalah sistem peringatan dini secara sederhana untuk untuk mendeteksi kondisi tidak aktif yang dapat mengindikasikan kelelahan atau tertidur, terutama di lingkungan kerja atau belajar. Sistem ini menggunakan mikrokontroler **ESP8266** yang terhubung dengan sensor gerak **(PIR)** dan sensor cahaya **(LDR)**, dan berfokus pada pendeteksian cahaya. Sistem masih dalam tahap sederhana, membuatnya menjadi sistem yang perlu untuk dikembangkan lebih lanjut jika ingin dapat diterapkan untuk mengindikasikan kelelahan atau tertidur.

Data dari sensor ditampilkan secara *real-time* pada dashboard web melalui koneksi **WebSocket**.

## Cara Kerja Sistem
1. ESP8266 secara terus-menerus akan membaca data dari Sensor PIR dan Sensor LDR.
2. Logika utama ada di ESP8266. Alarm (buzzer) akan aktif jika dua kondisi terpenuhi secara bersamaan selama **3 detik**:
   - Sensor LDR mendeteksi kondisi **gelap** (`ldrVal == HIGH`).
   - Sensor PIR **tidak mendeteksi adanya gerakan** (`pirVal == LOW`).
3. ESP8266 akan mengirimkan status sensor (PIR dan LDR) dalam format JSON ke server WebSocket (Node.js) setiap 250ms.
4. Server Node.js akan menerima data dari ESP8266 dan menyiarkannya (*broadcast*) ke semua klien yang terhubung (pada sistem ini digunakan dashboard web).
5. Dashboard web (`index.html`) akan menerima data dari server dan menampilkan status sensor secara *real-time*, dan memberitahu pengguna apakah ada gerakan atau apakah ruangan dalam kondisi terang/gelap.

## Alat/bahan yang Dibutuhkan
1. Perangkat Keras (*Hardware*)
   - Mikrokontroler **ESP8266**
   - **Sensor PIR** (Passive Infrared) untuk deteksi gerakan
   - **Sensor LDR** (Light Dependent Resistor) untuk deteksi cahaya
   - **Buzzer Pasif** sebagai aktuator alarm
   - Kabel Jumper
2. Perangkat Lunak (*Software*)
   - **Arduino IDE**
   - **Node.js** (untuk menjalankan server WebSocket)
   - Web Browser (pada sistem ini digunakan Google Chrome)
  
## Instalasi & Konfigurasi
1. Perangkat Keras (Wiring)
Koneksikan semua alat ke pin ESP8266 sesuai dengan kode `fatigue_alarm.ino`:
- **Sensor LDR**: Hubungkan ke pin `D1` (GPIO 5)
- **Sensor PIR**: Hubungkan ke pin `D2` (GPIO 4)
- **Buzzer**: Hubungkan ke pin `D3` (GPIO 0)
2. Server (Node.js)
Jalankan server WebSocket di komputer Anda.
```bash
# 1. Masuk ke direktori proyek (pastikan semua file yang diperlukan ada di satu folder yang sama)
cd /path/to/your/project

# 2. Install dependency yang dibutuhkan (ws)
npm install

# 3. Jalankan server
node server.js
```
Server akan berjalan di port `8080`. Catat alamat IP lokal komputer (contoh: `192.168.1.4`).

3. Mikrokontroler (ESP8266)
Konfigurasi dan unggah kode ke ESP8266 melalui Arduino IDE.
- Buka file `fatigue_alarm.ino` di Arduino IDE.
- Install library yang dibutuhkan dari Library Manager:
  - `ESP8266WiFi` (biasanya sudah ada dengan board manager ESP8266)
  - `ArduinoWebsockets` oleh Markus Sattler
- **Sesuaikan konfigurasi** di dalam kode:
    ```cpp
    // Ganti dengan nama & password WiFi yang terhubung pada device
    const char* ssid = "NAMA_WIFI_ANDA";
    const char* password = "PASSWORD_WIFI_ANDA";

    // Ganti dengan alamat IP komputer tempat server.js berjalan
    const char* websocket_server = "ws://192.168.1.4:8080";
    ```
- Pilih board (misal: "NodeMCU 1.0 (ESP-12E Module)") dan Port yang benar.
- Upload kode ke ESP8266.

## Cara Menjalankan
1.  Pastikan **Server Node.js sudah berjalan** (`node server.js`).
2.  **Nyalakan rangkaian ESP8266**. Buka Serial Monitor di Arduino IDE (baud rate 115200) untuk melihat log koneksi dan status sensor.
3.  Buka file **`index.html`** di web browser. 
4.  Dashboard akan menampilkan status "Terhubung ke Server" dan data sensor akan mulai muncul.
5.  Untuk menguji alarm, buatlah kondisi di mana **ruangan menjadi gelap** (tutupi LDR) dan **jangan bergerak** di depan sensor PIR selama 3 detik, maka alarm buzzer akan berbunyi.
