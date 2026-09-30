const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3300;
const PIN_CODE = process.env.PIN_CODE || "1234";

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// State server
let currentState = {
  status: 'STANDBY', // STANDBY, PLAYING, ENDED
  lastUpdated: Date.now()
};

// Broadcast function
function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// WebSocket Connection
wss.on('connection', (ws) => {
  // Kirim state saat ini ke client baru yang connect
  ws.send(JSON.stringify({ type: 'STATE_SYNC', state: currentState }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      
      if (parsed.type === 'COMMAND') {
        const { action, pin } = parsed;

        // Validasi PIN sederhana untuk perintah berbahaya / remote
        if (pin !== PIN_CODE) {
          ws.send(JSON.stringify({ type: 'ERROR', message: 'PIN Salah!' }));
          return;
        }

        if (action === 'PLAY') {
          currentState.status = 'PLAYING';
          currentState.lastUpdated = Date.now();
          broadcast({ type: 'TRIGGER_PLAY' });
          broadcast({ type: 'STATE_SYNC', state: currentState });
          console.log(`[ACTION] TRIGGER PLAY diterima pada ${new Date().toISOString()}`);
        } else if (action === 'RESET') {
          currentState.status = 'STANDBY';
          currentState.lastUpdated = Date.now();
          broadcast({ type: 'TRIGGER_RESET' });
          broadcast({ type: 'STATE_SYNC', state: currentState });
          console.log(`[ACTION] TRIGGER RESET diterima pada ${new Date().toISOString()}`);
        }
      } else if (parsed.type === 'DISPLAY_STATE_UPDATE') {
        // Laporan dari display player (misal video ended)
        if (parsed.status) {
          currentState.status = parsed.status;
          currentState.lastUpdated = Date.now();
          broadcast({ type: 'STATE_SYNC', state: currentState });
        }
      }
    } catch (e) {
      console.error('Invalid WS message:', e);
    }
  });
});

// Routing
app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

app.get('/remote', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'remote.html'));
});

app.get('/api/pin-check', (req, res) => {
  const pin = req.query.pin;
  if (pin === PIN_CODE) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false, message: 'PIN Tidak Valid' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Sistem Remote & Display Peresmian Berjalan`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔑 PIN Default: ${PIN_CODE}`);
  console.log(`🖥️  Display URL: http://localhost:${PORT}/display`);
  console.log(`📱 Remote URL : http://localhost:${PORT}/remote`);
  console.log(`====================================================`);
});
