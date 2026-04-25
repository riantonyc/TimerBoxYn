import { useState } from 'react'
import { useHiitTimer } from '../hooks/useHiitTimer'

export default function HiitView() {
  const [workDuration, setWorkDuration] = useState(30)
  const [restDuration, setRestDuration] = useState(15)
  const [rounds, setRounds] = useState(8)

  // Local settings — only applied when user clicks Apply
  const [localWork, setLocalWork] = useState(30)
  const [localRest, setLocalRest] = useState(15)
  const [localRounds, setLocalRounds] = useState(8)
  const [applied, setApplied] = useState(false)

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
  } = useHiitTimer({ workDuration, restDuration, rounds })

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isActive = !isIdle && !isFinished

  const phaseLabel = {
    idle: 'READY',
    work: `WORK — ${currentRound} / ${rounds}`,
    rest: 'REST',
    finished: 'FINISHED',
  }[phase]

  const handleApply = () => {
    setWorkDuration(localWork)
    setRestDuration(localRest)
    setRounds(localRounds)
    setApplied(true)
    setTimeout(() => setApplied(false), 1500)
  }

  return (
    <div className="hiit-view">
      <div className={`hiit-timer ${phase !== 'idle' ? `hiit-timer--${phase}` : ''}`}>
        <div className={`phase-badge phase-badge--${phase}`}>{phaseLabel}</div>
        <div className={`hiit-time hiit-time--${phase}`}>{formatted}</div>
        <div className="hiit-progress">
          {[...Array(rounds)].map((_, i) => (
            <div
              key={i}
              className={`progress-dot ${i < currentRound ? 'progress-dot--done' : ''} ${i === currentRound - 1 && phase !== 'idle' && phase !== 'finished' ? `progress-dot--active progress-dot--active--${phase}` : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="hiit-controls">
        {(isIdle || isFinished) && (
          <button className="btn btn--start" onClick={start}>
            {isFinished ? 'RESTART' : 'START'}
          </button>
        )}
        {isRunning && !isPaused && (
          <button className="btn btn--pause" onClick={pause}>PAUSE</button>
        )}
        {isPaused && !isFinished && (
          <>
            <button className="btn btn--resume" onClick={resume}>RESUME</button>
            <button className="btn btn--reset" onClick={reset}>RESET</button>
          </>
        )}
      </div>

      <div className={`hiit-settings ${isActive ? 'hiit-settings--disabled' : ''}`}>
        <label>
          <span>Work (sec)</span>
          <input
            type="number"
            min="5"
            max="300"
            value={localWork}
            disabled={isActive}
            onChange={e => setLocalWork(Number(e.target.value))}
          />
        </label>
        <label>
          <span>Rest (sec)</span>
          <input
            type="number"
            min="5"
            max="300"
            value={localRest}
            disabled={isActive}
            onChange={e => setLocalRest(Number(e.target.value))}
          />
        </label>
        <label>
          <span>Rounds</span>
          <input
            type="number"
            min="1"
            max="50"
            value={localRounds}
            disabled={isActive}
            onChange={e => setLocalRounds(Number(e.target.value))}
          />
        </label>
        <button
          className={`btn-apply ${applied ? 'btn-apply--applied' : ''}`}
          onClick={handleApply}
          disabled={isActive}
        >
          {applied ? '✓ Applied' : 'Apply Settings'}
        </button>
      </div>

      <div className="watermark watermark--global">ryantonyc(232102565)</div>
    </div>
  )
}