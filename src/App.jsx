import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MenuDetailPage from './pages/MenuDetailPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menus/:menuId" element={<MenuDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
