// simpan sebagai script.js

// Tunggu hingga seluruh konten halaman web dimuat
document.addEventListener('DOMContentLoaded', () => {

    const statusElem = document.getElementById('status');
    const pirValElem = document.getElementById('pirVal');
    const ldrValElem = document.getElementById('ldrVal');

    // Alamat server WebSocket kita. 'localhost' sudah benar karena browser berjalan di komputer yang sama dengan server.
    const socket = new WebSocket('ws://localhost:8080');

    // Event saat koneksi berhasil dibuka
    socket.onopen = () => {
        console.log('WebSocket connection established');
        statusElem.textContent = 'Terhubung ke Server';
        statusElem.className = 'status connected';
    };

    // Event saat menerima pesan dari server
    socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
        
        // Ubah data JSON dari string menjadi objek
        const data = JSON.parse(event.data);

        // Perbarui tampilan berdasarkan data yang diterima
        // Untuk PIR (asumsi LOW = tidak ada gerakan)
        if (data.pir === 0) {
            pirValElem.textContent = 'Tidak Ada Gerakan';
        } else {
            pirValElem.textContent = 'Gerakan Terdeteksi!';
        }

        // Untuk LDR (asumsi HIGH = gelap)
        if (data.ldr === 1) {
            ldrValElem.textContent = 'Gelap';
        } else {
            ldrValElem.textContent = 'Terang';
        }
    };

    // Event saat koneksi ditutup
    socket.onclose = () => {
        console.log('WebSocket connection closed');
        statusElem.textContent = 'Koneksi Terputus';
        statusElem.className = 'status disconnected';
    };

    // Event jika terjadi error
    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        statusElem.textContent = 'Koneksi Error';
        statusElem.className = 'status disconnected';
    };
});