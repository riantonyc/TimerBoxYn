import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const STORAGE_KEY = 'training_web_workouts'

const now = () => new Date().toISOString()

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function WorkoutItem({ item, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [notes, setNotes] = useState(item.notes || '')
  const [finished, setFinished] = useState(item.finished || false)

  const save = () => {
    onEdit(item.id, { ...item, title, notes, finished })
    setEditing(false)
  }

  return (
    <div className={`workout-item ${editing ? 'workout-item--editing' : ''} ${finished ? 'workout-item--finished' : ''}`}>
      <div className="workout-item__top">
        <label className="finish-check" title="Mark as finished">
          <input
            type="checkbox"
            checked={finished}
            onChange={e => {
              setFinished(e.target.checked)
              onEdit(item.id, { ...item, title, notes, finished: e.target.checked })
            }}
          />
          <span className="finish-check__box">
            {finished && (
              <svg viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4L4.5 7.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="finish-check__label">{finished ? 'Finished' : 'Mark done'}</span>
        </label>
        <div className="workout-item__meta">
          <span className="workout-item__date">{formatDate(item.date)}</span>
          <span className="workout-item__type">{item.type}</span>
        </div>
      </div>

      {editing ? (
        <div className="workout-item__edit">
          <input
            className="edit-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Workout title"
          />
          <textarea
            className="edit-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes (rounds, duration, how you felt...)"
            rows={3}
          />
          <div className="edit-actions">
            <button className="btn-save" onClick={save}>Save</button>
            <button className="btn-cancel" onClick={() => { setEditing(false); setTitle(item.title); setNotes(item.notes || '') }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="workout-item__body">
          <h3 className="workout-item__title">{item.title}</h3>
          {item.notes && <p className="workout-item__notes">{item.notes}</p>}
          <div className="workout-item__actions">
            <button className="btn-edit" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn-delete" onClick={() => onDelete(item.id)}>Delete</button>
          </div>
        </div>
      )}

    </div>
  )
}

const TYPES = ['Boxing', 'HIIT', 'Strength', 'Cardio', 'Sparring', 'Other','StudyLearn']

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function WorkoutLog() {
  const [workouts, setWorkouts] = useLocalStorage(STORAGE_KEY, [
    {
      id: generateId(),
      title: 'Morning Boxing Session',
      type: 'Boxing',
      notes: '3 rounds sparring, felt strong',
      date: now(),
      finished: false,
    },
    {
      id: generateId(),
      title: 'HIIT Cardio Blast',
      type: 'HIIT',
      notes: '8 rounds, tough session',
      date: now(),
      finished: false,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('Boxing')
  const [newNotes, setNewNotes] = useState('')

  const addWorkout = () => {
    if (!newTitle.trim()) return
    setWorkouts(prev => [
      { id: generateId(), title: newTitle.trim(), type: newType, notes: newNotes.trim(), date: now(), finished: false },
      ...prev,
    ])
    setNewTitle('')
    setNewType('Boxing')
    setNewNotes('')
    setShowForm(false)
  }

  const editWorkout = (id, updated) => {
    setWorkouts(prev => prev.map(w => w.id === id ? updated : w))
  }

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  const finishedCount = workouts.filter(w => w.finished).length

  return (
    <div className="workout-log">
      <div className="log-header">
        <div className="log-header__left">
          <h2>Workout Log</h2>
          {finishedCount > 0 && (
            <span className="log-count">{finishedCount}/{workouts.length} done</span>
          )}
        </div>
        <button className="btn-add" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Cancel' : '+ Add Workout'}
        </button>
      </div>

      {showForm && (
        <div className="log-form">
          <input
            className="form-title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Workout title (e.g. Morning Boxing)"
          />
          <div className="form-row">
            <select className="form-type" value={newType} onChange={e => setNewType(e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <textarea
            className="form-notes"
            value={newNotes}
            onChange={e => setNewNotes(e.target.value)}
            placeholder="Notes — rounds, duration, how you felt..."
            rows={3}
          />
          <button className="btn-submit" onClick={addWorkout} disabled={!newTitle.trim()}>
            Save Workout
          </button>
        </div>
      )}

      <div className="workout-list">
        {workouts.length === 0 && (
          <div className="log-empty">
            <p>No workouts logged yet. Add your first workout above!</p>
          </div>
        )}
        {workouts.map(w => (
          <WorkoutItem key={w.id} item={w} onEdit={editWorkout} onDelete={deleteWorkout} />
        ))}
      </div>

      <div className="watermark watermark--global">ryantonyc(232102565)</div>
    </div>
  )
}
