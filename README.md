# GameZone

A real-time multiplayer gaming platform with voice chat capabilities and enhanced Rock Paper Scissors game.

## Enhanced Rock Paper Scissors Game

### Game Modes

#### Offline Multiplayer Mode
- **Two players on the same device**
- **Player 1 Controls**: A (Rock), S (Paper), D (Scissors)
- **Player 2 Controls**: J (Rock), K (Paper), L (Scissors)
- **3-second countdown timer** after both players make selections
- **Simultaneous reveal** of both choices
- **Real-time score tracking**

#### Offline AI Mode
- **Player vs Computer**
- **Player Controls**: A (Rock), S (Paper), D (Scissors) or click buttons
- **AI randomly selects** moves
- **3-second countdown timer** after player selection
- **Simultaneous reveal** of choices
- **Score tracking** for both player and AI

#### Online Mode (Placeholder)
- **Structured for future online multiplayer implementation**
- **Socket-based real-time gameplay**
- **Room-based matchmaking system**

### Key Features
- **Keyboard input handling** with visual feedback
- **Countdown timer** with animated display
- **Clean state management** using React Context
- **Responsive UI** with modern design
- **Game phase management** (choosing, countdown, revealing, result)
- **Score persistence** across rounds
- **Visual animations** and transitions

### Technical Implementation
- **React Context API** for state management
- **Custom hooks** for game logic
- **Keyboard event listeners** for input handling
- **Timer management** with cleanup
- **Socket.IO integration** for online mode
- **TypeScript** for type safety

## Features

### Real-Time Voice Chat
- **WebRTC-based voice communication** for low-latency audio
- **Automatic peer-to-peer connections** between users in the same game room
- **Mic and speaker controls** with visual indicators
- **Real-time connection status** showing voice activity
- **Automatic cleanup** when users leave or disconnect
- **Error handling** for microphone permissions and connection issues

### Voice Controls
- **Microphone toggle**: Mute/unmute your microphone
- **Speaker toggle**: Mute/unmute incoming audio from other users
- **Connection status**: Visual indicator showing if voice is active
- **Error messages**: Clear feedback for permission and connection issues

### Technical Implementation
- **WebRTC Peer Connections**: Direct peer-to-peer audio streaming
- **Socket.IO signaling**: Handles WebRTC offer/answer exchange
- **STUN servers**: Google and Twilio STUN servers for NAT traversal
- **Audio optimization**: Echo cancellation, noise suppression, and auto gain control
- **Automatic reconnection**: Handles network disconnections gracefully

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Allow microphone permissions** when prompted for voice chat

4. **Join a game room** and start chatting with voice!

## Voice Chat Usage

1. **Join a game room** - Voice chat automatically initializes
2. **Use the mic button** to mute/unmute your microphone
3. **Use the speaker button** to mute/unmute incoming audio
4. **Check the voice status indicator** to see connection state
5. **Voice works automatically** with other users in the same room

## Browser Support

Voice chat requires a modern browser with WebRTC support:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Troubleshooting

- **Microphone not working**: Check browser permissions and ensure microphone is connected
- **No audio from others**: Check speaker settings and browser audio permissions
- **Connection issues**: Check internet connection and firewall settings
- **Voice not connecting**: Ensure you're in the same game room as other users

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
