export default function TimerDisplay({ timeLeft, phase, currentRound, totalRounds }) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const phaseLabel = {
    idle: 'READY',
    round: `ROUND ${currentRound} / ${totalRounds}`,
    rest: 'REST',
    finished: 'FINISHED',
  }[phase]

  return (
    <div className="timer-display">
      <div className={`phase-label phase-label--${phase}`}>{phaseLabel}</div>
      <div className={`time ${phase !== 'idle' ? `time--${phase}` : ''}`}>{formatted}</div>
    </div>
  )
}