import { useState, useEffect, useRef, useCallback } from 'react'
import {
  playStartSound,
  playRestBell,
  playEndBell,
  playLast10SecondsSound,
} from '../utils/sounds'

const PHASES = {
  IDLE: 'idle',
  ROUND: 'round',
  REST: 'rest',
  FINISHED: 'finished',
}

export function useTimer({ roundDuration, restDuration, totalRounds }) {
  const [phase, setPhase] = useState(PHASES.IDLE)
  const [timeLeft, setTimeLeft] = useState(roundDuration)
  const [currentRound, setCurrentRound] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  const intervalRef = useRef(null)
  const roundDurationRef = useRef(roundDuration)
  const restDurationRef = useRef(restDuration)
  const totalRoundsRef = useRef(totalRounds)

  useEffect(() => {
    roundDurationRef.current = roundDuration
    restDurationRef.current = restDuration
    totalRoundsRef.current = totalRounds
  }, [roundDuration, restDuration, totalRounds])

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setPhase(PHASES.ROUND)
    setCurrentRound(1)
    setTimeLeft(roundDurationRef.current)
    setIsPaused(false)
    playStartSound()
  }, [])

  const pause = useCallback(() => {
    setIsPaused(true)
    clearTimer()
  }, [clearTimer])

  const resume = useCallback(() => setIsPaused(false), [])

  const reset = useCallback(() => {
    clearTimer()
    setPhase(PHASES.IDLE)
    setCurrentRound(1)
    setTimeLeft(roundDurationRef.current)
    setIsPaused(false)
  }, [clearTimer])

  // Main countdown logic
  useEffect(() => {
    if (phase === PHASES.IDLE || phase === PHASES.FINISHED) {
      clearTimer()
      return
    }

    if (isPaused) {
      clearTimer()
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return () => clearTimer()
  }, [phase, isPaused, clearTimer])

  // Phase transition & 10-second warning
  useEffect(() => {
    // 10-second warning: only during round (not rest)
    if (phase === PHASES.ROUND && timeLeft === 10) {
      playLast10SecondsSound()
    }

    if (timeLeft !== 0) return

    if (phase === PHASES.ROUND) {
      if (currentRound >= totalRoundsRef.current) {
        setPhase(PHASES.FINISHED)
        playEndBell()
        clearTimer()
      } else {
        setPhase(PHASES.REST)
        setTimeLeft(restDurationRef.current)
        playRestBell()
      }
    } else if (phase === PHASES.REST) {
      const nextRound = currentRound + 1
      setCurrentRound(nextRound)
      setPhase(PHASES.ROUND)
      setTimeLeft(roundDurationRef.current)
      playStartSound()
    }
  }, [timeLeft, phase, currentRound, clearTimer])

  return {
    phase,
    timeLeft,
    currentRound,
    totalRounds,
    isPaused,
    isIdle: phase === PHASES.IDLE,
    isFinished: phase === PHASES.FINISHED,
    isRunning: (phase === PHASES.ROUND || phase === PHASES.REST) && !isPaused,
    start,
    pause,
    resume,
    reset,
  }
}