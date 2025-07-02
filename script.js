document.addEventListener('DOMContentLoaded', () => {

    const statusElem = document.getElementById('status');
    const pirValElem = document.getElementById('pirVal');
    const ldrValElem = document.getElementById('ldrVal');

    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        console.log('WebSocket connection established');
        statusElem.textContent = 'Terhubung ke Server';
        statusElem.className = 'status connected';
    };

    socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
        
        const data = JSON.parse(event.data);

        if (data.pir === 0) {
            pirValElem.textContent = 'Tidak Ada Gerakan';
        } else {
            pirValElem.textContent = 'Gerakan Terdeteksi!';
        }

        if (data.ldr === 1) {
            ldrValElem.textContent = 'Gelap';
        } else {
            ldrValElem.textContent = 'Terang';
        }
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
        statusElem.textContent = 'Koneksi Terputus';
        statusElem.className = 'status disconnected';
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        statusElem.textContent = 'Koneksi Error';
        statusElem.className = 'status disconnected';
    };
});
