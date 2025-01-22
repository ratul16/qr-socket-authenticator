const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const history = require('connect-history-api-fallback');

// Express app setup
const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected sockets
const appSockets = new Map();
const authAppSockets = new Map();

// Generate unique 6-digit app ID
function generateUniqueAppId() {
  let appId;
  do {
    appId = Math.floor(100000 + Math.random() * 900000).toString();
  } while (appSockets.has(appId));
  return appId;
}

// Socket connection handler
io.on('connection', (socket) => {
  console.log(`New connection established - Socket ID: ${socket.id}`);

  // Main app registration
  socket.on('register-app', () => {
    const appId = generateUniqueAppId();
    appSockets.set(appId, socket);
    socket.appId = appId;
    socket.emit('app-registered', appId);
    console.log(`App registered - Socket ID: ${socket.id}, App ID: ${appId}`);
  });

  // Auth app connection
  socket.on('connect-to-app', (appId) => {
    const appSocket = appSockets.get(appId);
    if (appSocket) {
      socket.appId = appId;
      authAppSockets.set(appId, socket);
      socket.emit('connected-to-app', true);
      console.log(`Auth app connected to app: ${appId}`);
    } else {
      socket.emit('connected-to-app', false);
      console.log(`Connection failed - App not found: ${appId}`);
    }
  });

  // Handle login result
  socket.on('login-result', (result) => {
    console.log('Login result received:', result);
    const authAppSocket = authAppSockets.get(socket.appId);

    if (authAppSocket) {
      authAppSocket.emit('login-result-client', result);
      console.log(`Login result sent to auth app (${authAppSocket.id}):`, result);
    } else {
      console.log(`No auth app found for ID: ${socket.appId}`);
    }
  });

  // Handle credential transmission
  socket.on('send-credentials', (credentials) => {
    const appSocket = appSockets.get(socket.appId);
    if (appSocket) {
      appSocket.emit('receive-credentials', credentials);
      console.log(`Credentials sent to app: ${socket.appId}`);
    } else {
      console.log(`No app found with ID: ${socket.appId}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.appId) {
      appSockets.delete(socket.appId);
      authAppSockets.delete(socket.appId);
      console.log(`Disconnected - App ID: ${socket.appId}`);
    }
  });
});

// Express middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(history());

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server startup
const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});