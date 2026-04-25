// Sound system using real MP3 files from public/sound/
// All sounds are triggered by calling these functions

let audioInstances = []

export function playStartSound() {
  const audio = new Audio('/sound/StartTimer.mp3')
  audioInstances.push(audio)
  audio.play().catch(() => {})
  audio.addEventListener('ended', () => {
    audioInstances = audioInstances.filter(a => a !== audio)
  })
}

export function playLast10SecondsSound() {
  const audio = new Audio('/sound/LastRound_10Second.mp3')
  audioInstances.push(audio)
  audio.play().catch(() => {})
  audio.addEventListener('ended', () => {
    audioInstances = audioInstances.filter(a => a !== audio)
  })
}

// Fallback Web Audio API bell (used if MP3 fails or for rest transition)
let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

function playBell(frequency, duration, volume = 0.4) {
  const ctx = getAudioContext()
  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gainNode = ctx.createGain()

  osc1.type = 'sine'
  osc2.type = 'triangle'
  osc1.frequency.setValueAtTime(frequency, ctx.currentTime)
  osc2.frequency.setValueAtTime(frequency * 2.5, ctx.currentTime)

  gainNode.gain.setValueAtTime(volume, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc1.connect(gainNode)
  osc2.connect(gainNode)
  gainNode.connect(ctx.destination)

  osc1.start(ctx.currentTime)
  osc2.start(ctx.currentTime)
  osc1.stop(ctx.currentTime + duration)
  osc2.stop(ctx.currentTime + duration)
}

export function playRestBell() {
  playBell(523, 1.0, 0.4)
}

export function playEndBell() {
  playBell(440, 3.0, 0.5)
  setTimeout(() => playBell(554, 2.8, 0.4), 50)
  setTimeout(() => playBell(659, 2.5, 0.3), 100)
  setTimeout(() => playBell(880, 2.2, 0.2), 150)
}