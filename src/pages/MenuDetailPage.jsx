import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import api from '../api/axios'

function SortableStep({ step, index, onContentChange, onAdd, onRemove, onEnter }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.dndId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li ref={setNodeRef} style={style} className="step-item editing">
      <span className="drag-handle" {...attributes} {...listeners}>
        ≡
      </span>
      <span className="step-number">{index + 1}</span>
      <input
        type="text"
        className="step-input"
        value={step.content}
        autoFocus={step.isNew}
        onChange={(e) => onContentChange(index, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (onEnter) onEnter(index)
          }
        }}
        placeholder="스텝 내용 입력"
      />
      <div className="step-controls">
        <button onClick={() => onAdd(index)}>+</button>
        <button onClick={() => onRemove(index)}>×</button>
      </div>
    </li>
  )
}

let nextDndId = 1

export default function MenuDetailPage() {
  const { menuId } = useParams()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editSteps, setEditSteps] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const fetchMenu = () => {
    api.get(`/menus/${menuId}`).then((res) => setMenu(res.data))
  }

  useEffect(() => {
    fetchMenu()
  }, [menuId])

  const startEdit = () => {
    setEditSteps(
      menu.steps.map((s) => ({ ...s, dndId: `step-${nextDndId++}` }))
    )
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
  }

  const handleContentChange = (index, value) => {
    const updated = [...editSteps]
    updated[index] = { ...updated[index], content: value }
    setEditSteps(updated)
  }

  const addStep = (index) => {
    const updated = [...editSteps]
    updated.splice(index + 1, 0, { content: '', dndId: `step-${nextDndId++}`, isNew: true })
    setEditSteps(updated)
  }

  const removeStep = (index) => {
    setEditSteps(editSteps.filter((_, i) => i !== index))
  }

  const handleEnter = (index) => {
    const updated = [...editSteps]
    updated.splice(index + 1, 0, { content: '', dndId: `step-${nextDndId++}`, isNew: true })
    setEditSteps(updated)

    const body = updated.map((s, i) => ({
      content: s.content,
      stepNumber: i + 1,
    }))
    api.put(`/steps/menu/${menuId}`, body).then(() => {
      fetchMenu()
    })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = editSteps.findIndex((s) => s.dndId === active.id)
    const newIndex = editSteps.findIndex((s) => s.dndId === over.id)
    setEditSteps(arrayMove(editSteps, oldIndex, newIndex))
  }

  const saveSteps = () => {
    const body = editSteps.map((s, i) => ({
      content: s.content,
      stepNumber: i + 1,
    }))
    api.put(`/steps/menu/${menuId}`, body).then(() => {
      setEditing(false)
      fetchMenu()
    })
  }

  if (!menu) return null

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/')}>
        ← 목록으로
      </button>

      <h1>{menu.title}</h1>
      <p className="menu-desc">{menu.description}</p>

      {!editing ? (
        <>
          <button className="edit-btn" onClick={startEdit}>편집</button>
          {menu.steps.length === 0 ? (
            <p className="empty">등록된 레시피 단계가 없습니다.</p>
          ) : (
            <ol className="step-list">
              {menu.steps.map((step) => (
                <li key={step.id} className="step-item">
                  <span className="step-number">{step.stepNumber}</span>
                  <p>{step.content}</p>
                </li>
              ))}
            </ol>
          )}
        </>
      ) : (
        <>
          <div className="edit-actions">
            <button className="save-btn" onClick={saveSteps}>완료</button>
            <button className="cancel-btn" onClick={cancelEdit}>취소</button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={editSteps.map((s) => s.dndId)}
              strategy={verticalListSortingStrategy}
            >
              <ol className="step-list">
                {editSteps.map((step, index) => (
                  <SortableStep
                    key={step.dndId}
                    step={step}
                    index={index}
                    onContentChange={handleContentChange}
                    onAdd={addStep}
                    onRemove={removeStep}
                    onEnter={handleEnter}
                  />
                ))}
              </ol>
            </SortableContext>
          </DndContext>
          {editSteps.length === 0 && (
            <button
              className="add-first-btn"
              onClick={() =>
                setEditSteps([{ content: '', dndId: `step-${nextDndId++}`, isNew: true }])
              }
            >
              첫 번째 스텝 추가
            </button>
          )}
        </>
      )}
    </div>
  )
}
