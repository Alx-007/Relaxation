import React, { useState, useRef, useEffect } from 'react'

const CATEGORIES = [
  { id: 'naturaleza', label: 'Naturaleza', emoji: '🌿', bg: 'rgba(74,222,128,0.12)',   border: '#4ade80' },
  { id: 'estudio',    label: 'Estudio',    emoji: '📚', bg: 'rgba(96,165,250,0.12)',   border: '#60a5fa' },
  { id: 'musica',     label: 'Música',     emoji: '🎵', bg: 'rgba(244,114,182,0.12)', border: '#f472b6' },
]

const POOL = {
  naturaleza: [
    { emoji: '🌸', label: 'Flor' },
    { emoji: '🌲', label: 'Árbol' },
    { emoji: '☀️', label: 'Sol' },
    { emoji: '🌊', label: 'Mar' },
    { emoji: '🌙', label: 'Luna' },
    { emoji: '🌈', label: 'Arcoíris' },
    { emoji: '🌺', label: 'Hibisco' },
    { emoji: '🍃', label: 'Hoja' },
    { emoji: '🦋', label: 'Mariposa' },
    { emoji: '🌻', label: 'Girasol' },
    { emoji: '🌷', label: 'Tulipán' },
    { emoji: '🍄', label: 'Hongo' },
    { emoji: '🌾', label: 'Trigo' },
    { emoji: '🦚', label: 'Pavo real' },
    { emoji: '🌵', label: 'Cactus' },
    { emoji: '🐚', label: 'Concha' },
  ],
  estudio: [
    { emoji: '📖', label: 'Libro' },
    { emoji: '✏️', label: 'Lápiz' },
    { emoji: '🔬', label: 'Microscopio' },
    { emoji: '📐', label: 'Escuadra' },
    { emoji: '🖊️', label: 'Bolígrafo' },
    { emoji: '📝', label: 'Notas' },
    { emoji: '🔭', label: 'Telescopio' },
    { emoji: '💡', label: 'Idea' },
    { emoji: '🖥️', label: 'Computadora' },
    { emoji: '📌', label: 'Tachuela' },
    { emoji: '🧮', label: 'Ábaco' },
    { emoji: '🗒️', label: 'Cuaderno' },
    { emoji: '📏', label: 'Regla' },
    { emoji: '🔋', label: 'Pila' },
    { emoji: '🧪', label: 'Tubo' },
    { emoji: '📊', label: 'Gráfica' },
  ],
  musica: [
    { emoji: '🎵', label: 'Nota' },
    { emoji: '🎸', label: 'Guitarra' },
    { emoji: '🎹', label: 'Piano' },
    { emoji: '🎺', label: 'Trompeta' },
    { emoji: '🎻', label: 'Violín' },
    { emoji: '🥁', label: 'Batería' },
    { emoji: '🎷', label: 'Saxofón' },
    { emoji: '🎤', label: 'Micrófono' },
    { emoji: '🎧', label: 'Audífonos' },
    { emoji: '🎼', label: 'Partitura' },
    { emoji: '🪗', label: 'Acordeón' },
    { emoji: '🎙️', label: 'Estudio' },
    { emoji: '🪘', label: 'Tambor' },
    { emoji: '🎶', label: 'Melodía' },
    { emoji: '🪈', label: 'Flauta' },
    { emoji: '🎚️', label: 'Mezclador' },
  ],
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRound() {
  let id = 0
  const items = []
  for (const catId of Object.keys(POOL)) {
    const picked = shuffle(POOL[catId]).slice(0, 4)
    for (const item of picked) {
      items.push({ id: ++id, ...item, category: catId })
    }
  }
  return shuffle(items)
}

export default function OrganizeGame() {
  const [items, setItems]       = useState(() => pickRound())
  const [placed, setPlaced]     = useState({})
  const [dragging, setDragging] = useState(null)
  const [hovered, setHovered]   = useState(null)
  const containerRef = useRef(null)
  const touchDraggingRef = useRef(null)

  const handleTouchStart = (e, item) => {
    touchDraggingRef.current = item
    setDragging(item)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove = (e) => {
      if (!touchDraggingRef.current) return
      e.preventDefault()
      const t = e.touches[0]
      const found = document.elementFromPoint(t.clientX, t.clientY)
      const catEl = found?.closest('[data-catid]')
      setHovered(catEl ? catEl.dataset.catid : null)
    }
    const onEnd = (e) => {
      const item = touchDraggingRef.current
      if (!item) return
      touchDraggingRef.current = null
      const t = e.changedTouches[0]
      const found = document.elementFromPoint(t.clientX, t.clientY)
      const catEl = found?.closest('[data-catid]')
      if (catEl && item.category === catEl.dataset.catid) {
        setPlaced(p => ({ ...p, [item.id]: catEl.dataset.catid }))
      }
      setDragging(null)
      setHovered(null)
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

  const total = items.length
  const placedCount = Object.keys(placed).length
  const done = placedCount === total
  const unplaced = items.filter(item => !placed[item.id])

  const reset = () => {
    setItems(pickRound())
    setPlaced({})
    setDragging(null)
    setHovered(null)
  }

  const onDrop = (catId) => {
    if (!dragging) return
    if (dragging.category === catId) {
      setPlaced(p => ({ ...p, [dragging.id]: catId }))
    }
    setDragging(null)
    setHovered(null)
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: '#5b21b6' }}>
          {placedCount} / {total} organizados
        </span>
        <button
          onClick={reset}
          className="text-xs px-3 py-1 rounded-full transition-all hover:scale-105 active:scale-95"
          style={{ background: 'rgba(168,85,247,0.12)', color: '#7c3aed' }}
        >
          Reiniciar
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(168,85,247,0.12)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(placedCount / total) * 100}%`,
            background: 'linear-gradient(90deg, #a855f7, #e879f9)',
          }}
        />
      </div>

      {done ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <span className="text-5xl">🎉</span>
          <p className="font-muthiara text-lg font-semibold" style={{ color: '#3b0764' }}>
            ¡Todo en su lugar!
          </p>
          <p className="text-sm text-center" style={{ color: '#7c3aed' }}>
            Una mente ordenada estudia mejor 🌸
          </p>
          <button
            onClick={reset}
            className="mt-2 px-5 py-2 rounded-full text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #a855f7, #e879f9)' }}
          >
            Nueva ronda
          </button>
        </div>
      ) : (
        <>
          {/* Scattered items */}
          <div
            className="flex flex-wrap gap-2 justify-center p-3 rounded-2xl min-h-[90px]"
            style={{
              background: 'rgba(168,85,247,0.05)',
              border: '1.5px dashed rgba(168,85,247,0.2)',
            }}
          >
            {unplaced.length === 0 ? (
              <span className="self-center text-sm" style={{ color: '#a855f7' }}>Sin elementos</span>
            ) : unplaced.map(item => (
              <div
                key={item.id}
                data-itemid={item.id}
                draggable
                onDragStart={() => setDragging(item)}
                onDragEnd={() => { setDragging(null); setHovered(null) }}
                onTouchStart={(e) => handleTouchStart(e, item)}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl cursor-grab active:cursor-grabbing select-none transition-all duration-200"
                style={{
                  background: 'rgba(243,232,255,0.9)',
                  border: '1.5px solid rgba(168,85,247,0.25)',
                  boxShadow: '0 2px 8px rgba(168,85,247,0.1)',
                  opacity: dragging?.id === item.id ? 0.4 : 1,
                  transform: dragging?.id === item.id ? 'scale(0.95)' : 'scale(1)',
                  touchAction: 'none',
                }}
              >
                <span className="text-2xl leading-none">{item.emoji}</span>
                <span className="text-xs font-medium" style={{ color: '#7c3aed' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Category drop zones */}
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => {
              const catItems = Object.entries(placed)
                .filter(([, c]) => c === cat.id)
                .map(([id]) => items.find(it => it.id === Number(id)))
              const isHovered = hovered === cat.id

              return (
                <div
                  key={cat.id}
                  data-catid={cat.id}
                  onDragOver={e => { e.preventDefault(); setHovered(cat.id) }}
                  onDragLeave={() => setHovered(null)}
                  onDrop={() => onDrop(cat.id)}
                  className="rounded-2xl p-2 flex flex-col gap-1.5 transition-all duration-200"
                  style={{
                    minHeight: 110,
                    background: isHovered ? cat.bg.replace('0.12', '0.28') : cat.bg,
                    border: `2px dashed ${isHovered ? cat.border : cat.border + '55'}`,
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm">{cat.emoji}</span>
                    <span className="text-xs font-semibold" style={{ color: '#5b21b6' }}>{cat.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {catItems.map(item => (
                      <div
                        key={item.id}
                        className="flex flex-col items-center px-1.5 py-1 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.65)' }}
                      >
                        <span className="text-lg leading-none">{item.emoji}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-center text-xs" style={{ color: '#a855f7', opacity: 0.7 }}>
            Arrastra cada elemento a su categoría
          </p>
        </>
      )}
    </div>
  )
}
