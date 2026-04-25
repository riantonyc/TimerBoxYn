import { useState } from 'react'
import { useTimer } from '../hooks/useTimer'
import TimerDisplay from './TimerDisplay'
import Controls from './Controls'
import Settings from './Settings'

export default function BoxingView() {
  const [roundDuration, setRoundDuration] = useState(180)
  const [restDuration, setRestDuration] = useState(60)
  const [totalRounds, setTotalRounds] = useState(3)

  const {
    phase,
    timeLeft,
    currentRound,
    isIdle,
    isFinished,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
  } = useTimer({ roundDuration, restDuration, totalRounds })

  const isActive = !isIdle && !isFinished

  const handleApply = (newRound, newRest, newTotal) => {
    setRoundDuration(newRound)
    setRestDuration(newRest)
    setTotalRounds(newTotal)
  }

  return (
    <div className="boxing-view">
      <TimerDisplay
        timeLeft={timeLeft}
        phase={phase}
        currentRound={currentRound}
        totalRounds={totalRounds}
      />

      <Controls
        isIdle={isIdle}
        isFinished={isFinished}
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onReset={reset}
      />

      <Settings
        roundDuration={roundDuration}
        restDuration={restDuration}
        totalRounds={totalRounds}
        onApply={handleApply}
        disabled={isActive}
      />

      <div className="watermark watermark--global">ryantonyc(232102565)</div>
    </div>
  )
}