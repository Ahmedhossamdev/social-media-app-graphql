const WebSocket = require('ws');

// WebSocket server URL (replace 'localhost' with your server hostname or IP)
const webSocketServerUrl = 'ws://localhost:3000/graphql';

const webSocketClient = new WebSocket(webSocketServerUrl);

webSocketClient.on('open', () => {
    console.log('WebSocket client connected to the server.');
});

webSocketClient.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received Message:', data.payload.data);
});

webSocketClient.on('error', (error) => {
    console.error('WebSocket client encountered an error:', error);
});
