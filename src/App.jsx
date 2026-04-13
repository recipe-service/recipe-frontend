import { useState, useEffect } from 'react'
import api from './api/axios'
import './App.css'

function App() {
  const [menus, setMenus] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const fetchMenus = () => {
    api.get('/menus').then((res) => {
      setMenus(res.data)
    })
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    api.post('/menus', { title, description }).then(() => {
      setTitle('')
      setDescription('')
      fetchMenus()
    })
  }

  return (
    <div className="app">
      <h1>가민's Prep</h1>

      <form className="menu-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="메뉴 이름"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">추가</button>
      </form>

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
