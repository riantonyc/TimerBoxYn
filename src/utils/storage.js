const KEYS = {
  WORKOUTS: 'training_web_workouts',
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

// ===== WORKOUTS =====

export function getWorkouts() {
  return safeParse(localStorage.getItem(KEYS.WORKOUTS), [])
}

export function saveWorkouts(workouts) {
  localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts))
}

export function addWorkout(workout) {
  const existing = getWorkouts()
  saveWorkouts([workout, ...existing])
  return [workout, ...existing]
}

export function updateWorkout(id, updated) {
  const existing = getWorkouts()
  const next = existing.map(w => w.id === id ? updated : w)
  saveWorkouts(next)
  return next
}

export function removeWorkout(id) {
  const existing = getWorkouts()
  const next = existing.filter(w => w.id !== id)
  saveWorkouts(next)
  return next
}

export function clearWorkouts() {
  localStorage.removeItem(KEYS.WORKOUTS)
}