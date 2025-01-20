const express = require('express');
// const https = require('https');
const http = require('http');
const fs = require('fs');
const { Server } = require('socket.io');
// const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

// Read SSL certificate files
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/login.wellnesstv.co.uk/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/login.wellnesstv.co.uk/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/login.wellnesstv.co.uk/chain.pem', 'utf8');

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca
// };

// const server = https.createServer(credentials, app);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const tvSockets = new Map();
const mobileSockets = new Map();

// Function to generate a unique 6-digit TV ID
function generateUniqueTVId() {
  let tvId;
  do {
    tvId = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
  } while (tvSockets.has(tvId)); // Ensure uniqueness
  return tvId;
}

io.on('connection', (socket) => {
  console.log(`New socket connection - Socket ID: ${socket.id}`);

  socket.on('register-tv', () => {
    const tvId = generateUniqueTVId();
    tvSockets.set(tvId, socket);
    socket.tvId = tvId;
    socket.emit('tv-registered', tvId);
    console.log(`TV Registration - Socket ID: ${socket.id}, Assigned TV ID: ${tvId}`);
  });

  socket.on('connect-to-tv', (tvId) => {
    const tvSocket = tvSockets.get(tvId);
    if (tvSocket) {
      socket.tvId = tvId;
      mobileSockets.set(tvId, socket); // Store mobile socket with TV ID as key
      socket.emit('connected-to-tv', true);
      console.log(`Mobile connected to TV: ${tvId}`);
    } else {
      socket.emit('connected-to-tv', false);
      console.log(`Failed to connect to TV: ${tvId}`);
    }
  });

  socket.on('login-result', (result) => {
    console.log('Login result received in server:', result);
    const mobileSocket = mobileSockets.get(socket.tvId);

    if (mobileSocket) {
      mobileSocket.emit('login-result-client', result);
      console.log(`Login result sent to client(${mobileSocket.id}):`, result);
    } else {
      console.log(`No client found for TV ID: ${socket.tvId}`);
    }
  });

  socket.on('send-credentials', (credentials) => {
    const tvSocket = tvSockets.get(socket.tvId);
    if (tvSocket) {
      tvSocket.emit('receive-credentials', credentials);
      console.log(`Credentials sent to TV: ${socket.tvId}`);
    } else {
      console.log(`No TV connected with ID: ${socket.tvId}`);
    }
  });

  socket.on('disconnect', () => {
    if (socket.tvId) {
      tvSockets.delete(socket.tvId);
      mobileSockets.delete(socket.tvId);
      console.log(`Socket disconnected: ${socket.tvId}`);
    }
  });

  socket.on('simple-test', (message) => {
    console.log('Received simple-test from TV:', message);

    // Emit the message to all clients
    io.emit('simple-test', message);

    // Alternatively, emit to the specific mobile client
    if (socket.tvId) {
      const mobileSocket = Array.from(io.sockets.sockets.values()).find(s => s.tvId === socket.tvId);
      if (mobileSocket) {
        mobileSocket.emit('simple-test', message); // Pass the message to the login app
      }
    }
  });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const history = require('connect-history-api-fallback');
// Enable history mode for Vue Router
app.use(history());

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
  console.log(`HTTPS Server is running on port ${PORT}`);
});