# QR Socket Auth

QR Socket Auth is an authentication system designed to provide a seamless login experience through QR code scanning. Users can effortlessly scan a QR code displayed on their app screen using their mobile devices, enter their credentials, and securely log in to their account via WebSocket connections.

## Preview

<video src="./github/preview.mp4" controls></video>

## Key Features
- Generate and display QR codes on the app interface
- Mobile-responsive web application for credential input
- Real-time authentication using WebSocket technology
- Secure session management between app and mobile devices

## Technologies
- Frontend: React.js (App and Mobile interfaces)
- Backend: Node.js with Express
- WebSocket: Socket.io for real-time communication
- Authentication: JWT (JSON Web Tokens)
- QR Code: qrcode.js

## How It Works
1. App interface generates and displays a unique QR code
2. User scans QR code with their mobile device
3. Mobile browser opens with login interface
4. User enters email and password
5. Upon successful authentication, app interface automatically updates and logs user in

## Security
- Encrypted WebSocket connections
- Secure credential handling
- Session-based QR code expiration
- Protected API endpoints

## Getting Started
[Installation and setup instructions will go here]