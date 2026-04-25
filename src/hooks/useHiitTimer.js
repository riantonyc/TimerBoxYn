import { useState, useEffect, useRef, useCallback } from 'react'
import {
  playStartSound,
  playRestBell,
  playEndBell,
  playLast10SecondsSound,
  stopLast10SecondsSound,
} from '../utils/sounds'

const PHASES = { IDLE: 'idle', WORK: 'work', REST: 'rest', FINISHED: 'finished' }

export function useHiitTimer({ workDuration, restDuration, rounds }) {
  const [phase, setPhase] = useState(PHASES.IDLE)
  const [timeLeft, setTimeLeft] = useState(workDuration)
  const [currentRound, setCurrentRound] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  const intervalRef = useRef(null)
  const workDurationRef = useRef(workDuration)
  const restDurationRef = useRef(restDuration)
  const roundsRef = useRef(rounds)

  useEffect(() => {
    workDurationRef.current = workDuration
    restDurationRef.current = restDuration
    roundsRef.current = rounds
  }, [workDuration, restDuration, rounds])

  // Sync timeLeft when duration changes while idle
  useEffect(() => {
    if (phase === PHASES.IDLE) {
      setTimeLeft(workDuration)
    }
  }, [workDuration, phase])

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setPhase(PHASES.WORK)
    setCurrentRound(1)
    setTimeLeft(workDurationRef.current)
    setIsPaused(false)
    playStartSound()
  }, [])

  const pause = useCallback(() => {
    setIsPaused(true)
    stopLast10SecondsSound()
    clearTimer()
  }, [clearTimer])

  const resume = useCallback(() => setIsPaused(false), [])

  const reset = useCallback(() => {
    clearTimer()
    stopLast10SecondsSound()
    setPhase(PHASES.IDLE)
    setCurrentRound(1)
    setTimeLeft(workDurationRef.current)
    setIsPaused(false)
  }, [clearTimer])

  useEffect(() => {
    if (phase === PHASES.IDLE || phase === PHASES.FINISHED) { clearTimer(); return }
    if (isPaused) { clearTimer(); return }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return () => clearTimer()
  }, [phase, isPaused, clearTimer])

  useEffect(() => {
    // 10-second warning during active work phase (not paused)
    if (phase === PHASES.WORK && !isPaused && timeLeft === 11) {
      playLast10SecondsSound()
    }

    if (timeLeft !== 0) return

    if (phase === PHASES.WORK) {
      if (currentRound >= roundsRef.current) {
        setPhase(PHASES.FINISHED)
        playEndBell()
        clearTimer()
      } else {
        setPhase(PHASES.REST)
        setTimeLeft(restDurationRef.current)
        playRestBell()
      }
    } else if (phase === PHASES.REST) {
      setCurrentRound(prev => prev + 1)
      setPhase(PHASES.WORK)
      setTimeLeft(workDurationRef.current)
      playStartSound()
    }
  }, [timeLeft, phase, currentRound, isPaused, clearTimer])

  return {
    phase,
    timeLeft,
    currentRound,
    isPaused,
    isIdle: phase === PHASES.IDLE,
    isFinished: phase === PHASES.FINISHED,
    isRunning: (phase === PHASES.WORK || phase === PHASES.REST) && !isPaused,
    start,
    pause,
    resume,
    reset,
  }
}