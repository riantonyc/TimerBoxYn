import { useState, useEffect } from 'react'

/**
 * Like useState, but backed by localStorage.
 * Initial value is only used when there is no stored value yet.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.warn(`storage.setItem failed for key "${key}":`, err)
    }
  }

  return [storedValue, setValue]
}