# TV QR Socket Auth

A modern TV authentication system that enables seamless login through QR code scanning. Users can scan the displayed QR code on their TV screen using their mobile devices, enter their credentials, and automatically log in to their TV account through secure WebSocket connections.

## Key Features
- QR code generation and display on TV interface
- Mobile-responsive web application for credential input
- Real-time authentication using WebSocket technology
- Secure session management between TV and mobile devices

## Technologies
- Frontend: React.js (TV and Mobile interfaces)
- Backend: Node.js with Express
- WebSocket: Socket.io for real-time communication
- Authentication: JWT (JSON Web Tokens)
- QR Code: qrcode.js

## How It Works
1. TV interface generates and displays a unique QR code
2. User scans QR code with their mobile device
3. Mobile browser opens with login interface
4. User enters email and password
5. Upon successful authentication, TV interface automatically updates and logs user in

## Security
- Encrypted WebSocket connections
- Secure credential handling
- Session-based QR code expiration
- Protected API endpoints

## Getting Started
[Installation and setup instructions will go here]