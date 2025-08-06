# GameZone

A real-time multiplayer gaming platform with voice chat, modern UI, and a suite of classic and enhanced games.

## 🎮 Available Games

### 1. Cyber Snake
- **Navigate a neon snake through digital mazes**
- **Eat data packets to grow, avoid walls and your tail**
- **Features:** Neon graphics, power-ups, high scores, increasing speed
- **Controls:** Arrow keys or WASD
- **Modes:** Single player

### 2. Tic Tac Toe
- **Classic grid game with AI and multiplayer**
- **Play against friends, AI, or online**
- **Features:** Single player, multiplayer, AI opponent, custom difficulty, online support
- **Controls:** Click to place X or O
- **Modes:** Single player, local multiplayer, online multiplayer

### 3. Rock Paper Scissors (RPS)
- **Enhanced RPS with animated results and score tracking**
- **Play against AI, friends locally, or online**
- **Features:** AI opponent, best-of series, score tracking, animated results, observer mode
- **Controls:**
  - Player 1: A (Rock), S (Paper), D (Scissors)
  - Player 2: J (Rock), K (Paper), L (Scissors)
  - Or click/tap buttons
- **Modes:**
  - Local multiplayer (same device)
  - AI mode (vs computer)
  - Online multiplayer (with observer support)

## 🗣️ Real-Time Voice Chat
- **WebRTC-based peer-to-peer audio**
- **Automatic voice room for each game**
- **Mic and speaker controls, connection status, error handling**
- **Works in all modern browsers**

## 👀 Observer Mode
- **Online RPS supports unlimited observers**
- **Observers can watch the game in real time but cannot play**
- **During countdown, only your own choice is visible; observers see neither**

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Development server
```bash
npm run dev
```
- Runs the Next.js frontend on the default port (usually 3000)
- For full-stack (with custom server and sockets):
```bash
npm run start:dev
```
- This uses `nodemon` to run `server.js` (custom Node.js + Socket.IO + Next.js server)

### 3. Production build
```bash
npm run build
npm start
```
- `npm start` runs `server.js` in production mode

### 4. Environment variables
- Create a `.env` file in the root (see `.env.example` if available)
- Required:
  - `HOST` (e.g. localhost)
  - `PORT` (e.g. 3000)

## 🌐 Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 🛠️ Troubleshooting
- **Microphone not working:** Check browser permissions and hardware
- **No audio from others:** Check speaker settings and browser audio permissions
- **Connection issues:** Check internet/firewall
- **Game not syncing:** Refresh, or check server logs
- **Voice not connecting:** Ensure all users are in the same room

## 📚 Help & FAQ
- See the `/help` page in the app for detailed guides and pro tips for each game
- For 50+ common questions and answers, see [FAQ.md](./FAQ.md)

## 🏗️ Project Structure
- `components/` — React UI components
- `context/` — React context providers for game logic and state
- `helpers/` — Server-side game and socket logic
- `lib/constants/` — Game metadata, instructions, and tips
- `app/` — Next.js app directory (routes, pages, layouts)
- `public/` — Static assets (audio, images)
- `server.js` — Custom Node.js + Socket.IO + Next.js server

## 🧑‍💻 Contributing
- PRs and issues welcome! See the code, try the games, and suggest improvements.

---

**Enjoy GameZone — the cyber arcade for everyone!**
