import React, { useState, useCallback, useEffect } from 'react'
import { playSuccessSound } from '../utils/audioUtils'

const MOTIVATIONAL = [
  '¡Perfecto! 🌟 Eres increíble.',
  '¡Lo lograste! 💜 Sigues brillando.',
  '¡Excelente! ✨ Tu mente es poderosa.',
  '¡Genial! 🌸 Lo tienes todo.',
]

// Each entry: a hue family used in rotation
const HUE_FAMILIES = [
  { hue: 0,   name: 'Rojos',     sat: 75 },
  { hue: 25,  name: 'Naranjas',  sat: 80 },
  { hue: 50,  name: 'Amarillos', sat: 70 },
  { hue: 90,  name: 'Verdes',    sat: 65 },
  { hue: 160, name: 'Turquesas', sat: 60 },
  { hue: 210, name: 'Azules',    sat: 70 },
  { hue: 250, name: 'Índigos',   sat: 65 },
  { hue: 280, name: 'Lila',      sat: 70 },
  { hue: 320, name: 'Rosas',     sat: 75 },
  { hue: 340, name: 'Frambuesa', sat: 70 },
]

let lastHueIdx = -1

function pickNextFamily() {
  let idx
  do { idx = Math.floor(Math.random() * HUE_FAMILIES.length) }
  while (idx === lastHueIdx)
  lastHueIdx = idx
  return HUE_FAMILIES[idx]
}

function generateItems(mode) {
  if (mode === 'numbers') {
    const nums = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10)
    return nums.map((v, i) => ({ id: i, value: v, label: String(v) }))
  }
  // colors: one hue family, 8 evenly-spread lightness steps, shuffled
  const family = pickNextFamily()
  const baseLights = [12, 22, 32, 42, 52, 62, 72, 82]
  const lights = baseLights
    .map(b => b + Math.floor(Math.random() * 6) - 2) // small jitter
    .sort(() => Math.random() - 0.5)                  // shuffle
  return lights.map((l, i) => ({
    id: i,
    value: l,
    label: '',
    color: `hsl(${family.hue}, ${family.sat}%, ${l}%)`,
    family: family.name,
  }))
}

// numbers: descending (mayor a menor) — colors: ascending (más oscuro a más claro)
function isSorted(items, mode) {
  for (let i = 1; i < items.length; i++) {
    if (mode === 'colors') {
      if (items[i].value < items[i - 1].value) return false
    } else {
      if (items[i].value > items[i - 1].value) return false
    }
  }
  return true
}

export default function SortGame() {
  const [mode, setMode]           = useState('numbers')
  const [items, setItems]         = useState(() => generateItems('numbers'))
  const [dragging, setDragging]   = useState(null)
  const [over, setOver]           = useState(null)
  const [won, setWon]             = useState(false)
  const [attempts, setAttempts]   = useState(0)
  const [message, setMessage]     = useState('')
  const [celebration, setCelebration] = useState(false)

  const reset = useCallback(() => {
    setItems(generateItems(mode))
    setWon(false)
    setAttempts(0)
    setMessage('')
    setCelebration(false)
    setDragging(null)
    setOver(null)
  }, [mode])

  useEffect(() => { reset() }, [mode])

  const handleDragStart = (id) => setDragging(id)
  const handleDragOver  = (e, id) => { e.preventDefault(); setOver(id) }

  const handleDrop = (targetId) => {
    if (dragging === null || dragging === targetId) { setDragging(null); setOver(null); return }
    const newItems = [...items]
    const fromIdx  = newItems.findIndex((it) => it.id === dragging)
    const toIdx    = newItems.findIndex((it) => it.id === targetId)
    const [removed] = newItems.splice(fromIdx, 1)
    newItems.splice(toIdx, 0, removed)
    setItems(newItems)
    setDragging(null)
    setOver(null)
    setAttempts((a) => a + 1)

    if (isSorted(newItems, mode)) {
      playSuccessSound()
      setWon(true)
      setCelebration(true)
      setMessage(MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)])
      setTimeout(() => setCelebration(false), 2000)
    }
  }

  const containerRef = React.useRef(null)
  const touchDraggingRef = React.useRef(null)
  const stateRef = React.useRef({ items, mode })
  useEffect(() => { stateRef.current = { items, mode } })

  const handleTouchStart = (e, id) => {
    touchDraggingRef.current = id
    setDragging(id)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove = (e) => {
      if (touchDraggingRef.current === null) return
      e.preventDefault()
      const t = e.touches[0]
      const found = document.elementFromPoint(t.clientX, t.clientY)
      const itemEl = found?.closest('[data-itemid]')
      const id = itemEl ? Number(itemEl.dataset.itemid) : null
      setOver(id !== touchDraggingRef.current ? id : null)
    }
    const onEnd = (e) => {
      const dragId = touchDraggingRef.current
      if (dragId === null) return
      touchDraggingRef.current = null
      const t = e.changedTouches[0]
      const found = document.elementFromPoint(t.clientX, t.clientY)
      const itemEl = found?.closest('[data-itemid]')
      const targetId = itemEl ? Number(itemEl.dataset.itemid) : null
      if (targetId !== null && targetId !== dragId) {
        const { items: cur, mode: curMode } = stateRef.current
        const next = [...cur]
        const from = next.findIndex(it => it.id === dragId)
        const to   = next.findIndex(it => it.id === targetId)
        const [removed] = next.splice(from, 1)
        next.splice(to, 0, removed)
        setItems(next)
        setAttempts(a => a + 1)
        if (isSorted(next, curMode)) {
          playSuccessSound()
          setWon(true)
          setCelebration(true)
          setMessage(MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)])
          setTimeout(() => setCelebration(false), 2000)
        }
      }
      setDragging(null)
      setOver(null)
    }
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('touchcancel', onEnd)
    return () => {
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
      el.removeEventListener('touchcancel', onEnd)
    }
  }, [])

  const currentFamily = mode === 'colors' ? items[0]?.family : null

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mode selector */}
      <div className="flex gap-2">
        {['numbers', 'colors'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="px-3 py-1.5 rounded-xl text-sm font-songwriter font-medium transition-all"
            style={
              mode === m
                ? { background: 'linear-gradient(135deg,#a855f7,#e879f9)', color: '#fff' }
                : { background: 'rgba(255,255,255,0.5)', color: '#7c3aed' }
            }
          >
            {m === 'numbers' ? '🔢 Números' : '🌈 Colores'}
          </button>
        ))}
      </div>

      {/* Hint */}
      <p className="text-xs font-songwriter opacity-60 text-center" style={{ color: '#7c3aed' }}>
        {mode === 'numbers'
          ? <>Arrastra para ordenar de <strong>mayor a menor</strong></>
          : <>Ordena los <strong>{currentFamily}</strong> del más oscuro al más claro</>
        }
      </p>

      {/* Items */}
      <div
        ref={containerRef}
        className="flex flex-wrap justify-center gap-3 min-h-[80px] py-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-itemid={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            onDragOver={(e) => handleDragOver(e, item.id)}
            onDrop={() => handleDrop(item.id)}
            onTouchStart={(e) => handleTouchStart(e, item.id)}
            className="rounded-2xl flex items-center justify-center font-songwriter font-bold text-lg cursor-grab active:cursor-grabbing transition-all duration-200 select-none"
            style={{
              width:  mode === 'numbers' ? 60 : 48,
              height: mode === 'numbers' ? 60 : 48,
              background: mode === 'colors' ? item.color : 'rgba(255,255,255,0.7)',
              color: mode === 'numbers' ? '#3b0764' : 'transparent',
              border: `2px solid ${over === item.id ? '#a855f7' : 'rgba(168,85,247,0.3)'}`,
              transform: dragging === item.id ? 'scale(1.1) rotate(3deg)' : over === item.id ? 'scale(1.05)' : 'scale(1)',
              opacity: dragging === item.id ? 0.7 : 1,
              touchAction: 'none',
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {won && (
        <div
          className="text-center px-6 py-3 rounded-2xl font-songwriter font-semibold animate-fade-in-up"
          style={{ background: 'rgba(168,85,247,0.15)', color: '#7c3aed' }}
        >
          {message}
          {celebration && <div className="text-2xl mt-1 animate-bounce">🎉🌸✨</div>}
          <div className="text-xs mt-1 opacity-70">Intentos: {attempts}</div>
        </div>
      )}

      <div className="flex gap-3">
        {won && (
          <button
            onClick={reset}
            className="px-5 py-2 rounded-xl font-songwriter font-semibold text-sm text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#a855f7,#e879f9)' }}
          >
            🔄 Nuevo juego
          </button>
        )}
        <button
          onClick={reset}
          className="px-5 py-2 rounded-xl font-songwriter font-medium text-sm transition-all hover:bg-white/50"
          style={{ background: 'rgba(255,255,255,0.4)', color: '#7c3aed' }}
        >
          Reiniciar
        </button>
      </div>

      {!won && (
        <p className="text-xs font-songwriter opacity-50" style={{ color: '#7c3aed' }}>
          Intentos: {attempts}
        </p>
      )}
    </div>
  )
}
