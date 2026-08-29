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
  const [activeMenuId, setActiveMenuId] = useState(null)
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

  const toggleMenuActions = (e, id) => {
    e.stopPropagation()
    setActiveMenuId((prev) => (prev === id ? null : id))
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
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <button
                    className="more-btn"
                    onClick={(e) => toggleMenuActions(e, menu.id)}
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px 8px' }}
                  >
                    ⋮
                  </button>
                  {activeMenuId === menu.id && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      background: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      zIndex: 10
                    }}>
                      <button 
                        className="edit-btn" 
                        onClick={(e) => {
                          startEdit(e, menu);
                          setActiveMenuId(null);
                        }}
                        style={{ margin: 0, padding: '6px 12px', width: '60px', height: '32px', boxSizing: 'border-box' }}
                      >
                        수정
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => {
                          handleDelete(e, menu.id);
                          setActiveMenuId(null);
                        }}
                        style={{ margin: 0, padding: '6px 12px', width: '60px', height: '32px', boxSizing: 'border-box' }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
