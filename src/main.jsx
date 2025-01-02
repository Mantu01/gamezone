import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Home, Help, About, Games, GameField, TicTacToe, RockPaperScissor } from './pages/index.js'
import { BrowserRouter, Routes, Route, } from 'react-router'
import { store } from './store/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/allgames" element={<Games />} />
          <Route path='/game/tic-tac-toe' element={<GameField><TicTacToe /></GameField>} />
          <Route path='game/rock-paper-scissors' element={<GameField><RockPaperScissor /></GameField>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
)