// server.js (versi baru)

const { WebSocketServer, WebSocket } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server dimulai di port 8080...");
console.log("Menunggu koneksi dari ESP8266 dan Browser...");

// Fungsi untuk broadcast ke semua client
function broadcast(data) {
    wss.clients.forEach(function each(client) {
        // Kirim hanya jika client dalam keadaan siap menerima
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

wss.on('connection', function connection(ws) {
    console.log('Sebuah client baru terhubung.');

    ws.on('message', function message(data) {
        // Tampilkan pesan di terminal server
        console.log('Menerima data: %s', data.toString());
        
        // Teruskan (broadcast) data ini ke SEMUA client yang terhubung
        broadcast(data.toString());
    });

    ws.on('close', () => {
        console.log('Sebuah client terputus.');
    });

    ws.on('error', (error) => {
        console.error('Terjadi error:', error);
    });
});