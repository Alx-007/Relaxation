import React, { useState, useEffect, useRef, useCallback } from 'react'
import { playBreathingTone } from '../utils/audioUtils'

const PHASES = [
  { key: 'inhale', label: 'Inhala...', duration: 4000, color: '#a855f7', scale: 1.35 },
  { key: 'hold', label: 'Sostén...', duration: 4000, color: '#e879f9', scale: 1.35 },
  { key: 'exhale', label: 'Exhala...', duration: 6000, color: '#7c3aed', scale: 0.75 },
  { key: 'pause', label: 'Pausa...', duration: 2000, color: '#c084fc', scale: 0.75 },
]

export default function BreathingExercise() {
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const intervalRef = useRef(null)

  const currentPhase = PHASES[phaseIdx]

  const advance = useCallback(() => {
    setPhaseIdx((i) => {
      const next = (i + 1) % PHASES.length
      playBreathingTone(PHASES[next].key)
      return next
    })
    setProgress(0)
  }, [])

  useEffect(() => {
    if (!running) {
      clearTimeout(timerRef.current)
      clearInterval(intervalRef.current)
      return
    }

    playBreathingTone(currentPhase.key)

    const startTime = Date.now()
    const dur = currentPhase.duration

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      setProgress(Math.min(elapsed / dur, 1))
    }, 50)

    timerRef.current = setTimeout(() => {
      clearInterval(intervalRef.current)
      advance()
    }, dur)

    return () => {
      clearTimeout(timerRef.current)
      clearInterval(intervalRef.current)
    }
  }, [running, phaseIdx, advance, currentPhase])

  const toggleRunning = () => {
    if (!running) {
      setPhaseIdx(0)
      setProgress(0)
    }
    setRunning((r) => !r)
  }

  const circleScale = running
    ? currentPhase.scale
    : 1

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Main circle */}
      <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
        {/* Outer ripple */}
        {running && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 220, height: 220,
              background: `radial-gradient(circle, ${currentPhase.color}22, transparent 70%)`,
              transform: `scale(${circleScale * 1.3})`,
              transition: `transform ${currentPhase.duration}ms ease-in-out`,
            }}
          />
        )}
        {/* Main circle */}
        <div
          className="rounded-full flex items-center justify-center shadow-lg"
          style={{
            width: 160, height: 160,
            background: `radial-gradient(circle at 35% 35%, ${currentPhase.color}cc, ${currentPhase.color}66)`,
            transform: `scale(${circleScale})`,
            transition: `transform ${currentPhase.duration}ms ease-in-out, background ${currentPhase.duration}ms ease-in-out`,
            boxShadow: `0 0 40px ${currentPhase.color}55`,
          }}
        >
          <div className="text-center">
            <div className="text-4xl mb-1">
              {currentPhase.key === 'inhale' ? '🌬️' :
               currentPhase.key === 'hold' ? '✨' :
               currentPhase.key === 'exhale' ? '💨' : '🌸'}
            </div>
          </div>
        </div>

        {/* Progress ring */}
        <svg
          className="absolute inset-0"
          width="220" height="220"
          viewBox="0 0 220 220"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle cx="110" cy="110" r="100" fill="none" stroke="#e9d5ff" strokeWidth="4" />
          <circle
            cx="110" cy="110" r="100"
            fill="none"
            stroke={currentPhase.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 100}`}
            strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress)}`}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
      </div>

      {/* Phase label */}
      <div className="text-center">
        <p
          className="font-playfair text-2xl font-semibold italic mb-1"
          style={{ color: running ? currentPhase.color : '#c084fc' }}
        >
          {running ? currentPhase.label : 'Listo para respirar'}
        </p>
        {running && (
          <p className="font-lato text-sm opacity-60" style={{ color: '#7c3aed' }}>
            {Math.ceil(currentPhase.duration / 1000 * (1 - progress))}s restantes
          </p>
        )}
      </div>

      {/* Cycle indicator */}
      <div className="flex gap-2">
        {PHASES.map((p, i) => (
          <div
            key={p.key}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i === phaseIdx && running ? currentPhase.color : '#e9d5ff',
              transform: i === phaseIdx && running ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={toggleRunning}
        className="px-6 py-3 rounded-2xl font-lato font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
        style={{
          background: running
            ? 'linear-gradient(135deg, #6b7280, #9ca3af)'
            : 'linear-gradient(135deg, #a855f7, #e879f9)',
          boxShadow: running ? 'none' : '0 4px 20px rgba(168,85,247,0.4)',
        }}
      >
        {running ? '⏸ Pausar' : '▶ Iniciar'}
      </button>

      <p className="text-xs font-lato text-center max-w-xs opacity-60" style={{ color: '#7c3aed' }}>
        Ciclo: Inhala 4s → Sostén 4s → Exhala 6s → Pausa 2s
      </p>
    </div>
  )
}
