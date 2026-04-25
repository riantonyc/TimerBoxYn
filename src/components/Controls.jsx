export default function Controls({ isIdle, isFinished, isRunning, isPaused, onStart, onPause, onResume, onReset }) {
  return (
    <div className="controls">
      {(isIdle || isFinished) && (
        <button className="btn btn--start" onClick={onStart}>
          {isFinished ? 'RESTART' : 'START'}
        </button>
      )}

      {isRunning && !isPaused && (
        <button className="btn btn--pause" onClick={onPause}>
          PAUSE
        </button>
      )}

      {isPaused && !isFinished && (
        <>
          <button className="btn btn--resume" onClick={onResume}>
            RESUME
          </button>
          <button className="btn btn--reset" onClick={onReset}>
            RESET
          </button>
        </>
      )}
    </div>
  )
}