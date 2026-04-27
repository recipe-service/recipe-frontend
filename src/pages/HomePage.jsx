import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function HomePage() {
  const [menus, setMenus] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()

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

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (window.confirm("정말 삭제하시겠습니까?")) {
      api.delete(`/menus/${id}`).then(() => {
        fetchMenus()
      })
    }
  }

  return (
    <div>
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
        />
        <button type="submit">추가</button>
      </form>

      <ul className="menu-list">
        {menus.map((menu) => (
          <li
            key={menu.id}
            className="menu-item clickable"
            onClick={() => navigate(`/menus/${menu.id}`)}
          >
            <div>
              <h2>{menu.title}</h2>
              <p>{menu.description}</p>
            </div>
            <button 
              className="delete-btn" 
              onClick={(e) => handleDelete(e, menu.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
