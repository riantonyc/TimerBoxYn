import { useState, useEffect } from 'react'

export default function Settings({ roundDuration, restDuration, totalRounds, onApply, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [applied, setApplied] = useState(false)

  // Local state for form — only applied when button is clicked
  const [localRound, setLocalRound] = useState(roundDuration)
  const [localRest, setLocalRest] = useState(restDuration)
  const [localRounds, setLocalRounds] = useState(totalRounds)

  // Sync local state when props change (e.g. when timer resets)
  useEffect(() => {
    setLocalRound(roundDuration)
    setLocalRest(restDuration)
    setLocalRounds(totalRounds)
  }, [roundDuration, restDuration, totalRounds])

  const handleApply = () => {
    onApply(localRound, localRest, localRounds)
    setApplied(true)
    setTimeout(() => setApplied(false), 1500)
  }

  return (
    <div className="settings">
      <button className="settings-toggle" onClick={() => setIsOpen(o => !o)}>
        {isOpen ? '▲ Hide Settings' : '▼ Settings'}
      </button>

      {isOpen && (
        <div className="settings-panel">
          <label>
            Round Duration (sec)
            <input
              type="number"
              min="30"
              max="600"
              value={localRound}
              disabled={disabled}
              onChange={e => setLocalRound(Number(e.target.value))}
            />
          </label>

          <label>
            Rest Duration (sec)
            <input
              type="number"
              min="10"
              max="300"
              value={localRest}
              disabled={disabled}
              onChange={e => setLocalRest(Number(e.target.value))}
            />
          </label>

          <label>
            Total Rounds
            <input
              type="number"
              min="1"
              max="20"
              value={localRounds}
              disabled={disabled}
              onChange={e => setLocalRounds(Number(e.target.value))}
            />
          </label>

          <button
            className={`btn-apply ${applied ? 'btn-apply--applied' : ''}`}
            onClick={handleApply}
            disabled={disabled}
          >
            {applied ? '✓ Applied' : 'Apply Settings'}
          </button>
        </div>
      )}
    </div>
  )
}