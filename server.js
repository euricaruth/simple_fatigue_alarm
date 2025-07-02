const { WebSocketServer, WebSocket } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server dimulai di port 8080...");
console.log("Menunggu koneksi dari ESP8266 dan Browser...");

function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

wss.on('connection', function connection(ws) {
    console.log('Sebuah client baru terhubung.');

    ws.on('message', function message(data) {
        console.log('Menerima data: %s', data.toString());
        
        broadcast(data.toString());
    });

    ws.on('close', () => {
        console.log('Sebuah client terputus.');
    });

    ws.on('error', (error) => {
        console.error('Terjadi error:', error);
    });
});
