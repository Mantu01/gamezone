import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Home,Help,About,Games} from './pages/index.js'
import { BrowserRouter,Routes, Route,} from 'react-router'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/games" element={<Games />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
