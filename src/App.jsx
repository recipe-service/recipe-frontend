import { useState, useEffect } from 'react'
import api from './api/axios'
import './App.css'

function App() {
  const [menus, setMenus] = useState([])

  useEffect(() => {
    api.get('/menus').then((res) => {
      setMenus(res.data)
    })
  }, [])

  return (
    <div className="app">
      <h1>가민's Prep</h1>
      <ul className="menu-list">
        {menus.map((menu) => (
          <li key={menu.id} className="menu-item">
            <h2>{menu.title}</h2>
            <p>{menu.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
