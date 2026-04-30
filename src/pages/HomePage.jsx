import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function HomePage() {
  const [menus, setMenus] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
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

  const startEdit = (e, menu) => {
    e.stopPropagation()
    setEditingId(menu.id)
    setEditTitle(menu.title)
    setEditDescription(menu.description || '')
  }

  const cancelEdit = (e) => {
    e.stopPropagation()
    setEditingId(null)
  }

  const handleEditSubmit = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    api.put(`/menus/${id}`, { title: editTitle, description: editDescription }).then(() => {
      setEditingId(null)
      fetchMenus()
    })
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
            {editingId === menu.id ? (
              <form 
                className="edit-form" 
                onSubmit={(e) => handleEditSubmit(e, menu.id)}
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}
              >
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  style={{ padding: '6px' }}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="설명"
                  style={{ padding: '6px' }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="submit" style={{ padding: '6px 12px' }}>저장</button>
                  <button type="button" onClick={cancelEdit} style={{ padding: '6px 12px' }}>취소</button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ flex: 1 }}>
                  <h2>{menu.title}</h2>
                  <p>{menu.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  <button 
                    className="edit-btn" 
                    onClick={(e) => startEdit(e, menu)}
                    style={{ margin: 0, padding: '6px 12px', width: '60px', height: '32px', boxSizing: 'border-box' }}
                  >
                    수정
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={(e) => handleDelete(e, menu.id)}
                    style={{ margin: 0, padding: '6px 12px', width: '60px', height: '32px', boxSizing: 'border-box' }}
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
