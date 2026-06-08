let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

export function playPopSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(600 + Math.random() * 400, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.12)

    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.start(now)
    osc.stop(now + 0.15)
  } catch (_) {}
}

export function playBreathingTone(phase) {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    filter.type = 'lowpass'
    filter.frequency.value = 800

    osc.type = 'sine'

    const freqs = { inhale: 220, hold: 262, exhale: 196, pause: 174 }
    const freq = freqs[phase] || 220

    osc.frequency.setValueAtTime(freq, now)
    gainNode.gain.setValueAtTime(0.08, now)
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.5)
    gainNode.gain.linearRampToValueAtTime(0.001, now + 1.5)

    osc.start(now)
    osc.stop(now + 1.6)
  } catch (_) {}
}

export function playSuccessSound() {
  try {
    const ctx = getAudioContext()
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.1
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.28)
    })
  } catch (_) {}
}

export function playSaveSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.setValueAtTime(660, now + 0.1)
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc.start(now)
    osc.stop(now + 0.32)
  } catch (_) {}
}
