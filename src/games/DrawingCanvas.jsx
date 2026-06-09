import React, { useRef, useState, useEffect, useCallback } from 'react'

const COLORS = ['#3b0764', '#a855f7', '#e879f9', '#c084fc', '#ec4899', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#ffffff', '#000000']
const SIZES = [2, 5, 10, 18, 28]

export default function DrawingCanvas() {
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)
  const lastPos = useRef(null)
  const [color, setColor] = useState('#a855f7')
  const [size, setSize] = useState(5)
  const [eraser, setEraser] = useState(false)

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDraw = useCallback((e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    isDrawing.current = true
    lastPos.current = getPos(e, canvas)
  }, [])

  const draw = useCallback((e) => {
    e.preventDefault()
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = eraser ? '#ffffff' : color
    ctx.lineWidth = eraser ? size * 2.5 : size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
  }, [color, size, eraser])

  const endDraw = useCallback(() => {
    isDrawing.current = false
    lastPos.current = null
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const downloadCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'mi-dibujo-spaceYours.png'
    link.href = canvas.toDataURL()
    link.click()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const resize = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.putImageData(imageData, 0, 0)
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center px-1">
        {/* Colors */}
        <div className="flex gap-1 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setEraser(false) }}
              className="rounded-full transition-all"
              style={{
                width: 22, height: 22,
                background: c,
                border: color === c && !eraser ? '2.5px solid #3b0764' : '1.5px solid rgba(0,0,0,0.15)',
                transform: color === c && !eraser ? 'scale(1.2)' : 'scale(1)',
              }}
              title={c}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-purple-200 mx-1" />

        {/* Sizes */}
        <div className="flex gap-1 items-center">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className="rounded-full flex items-center justify-center transition-all"
              style={{
                width: 28, height: 28,
                background: size === s ? 'rgba(168,85,247,0.2)' : 'transparent',
                border: size === s ? '1.5px solid #a855f7' : '1.5px solid transparent',
              }}
            >
              <div className="rounded-full bg-current" style={{ width: s * 0.7 + 2, height: s * 0.7 + 2, background: '#3b0764' }} />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-purple-200 mx-1" />

        {/* Eraser */}
        <button
          onClick={() => setEraser((e) => !e)}
          className="px-3 py-1.5 rounded-xl text-xs font-songwriter font-medium transition-all"
          style={
            eraser
              ? { background: 'rgba(168,85,247,0.2)', color: '#7c3aed', border: '1.5px solid #a855f7' }
              : { background: 'rgba(255,255,255,0.5)', color: '#7c3aed' }
          }
        >
          🧹 Borrador
        </button>

        <button
          onClick={clearCanvas}
          className="px-3 py-1.5 rounded-xl text-xs font-songwriter font-medium transition-all hover:bg-red-50"
          style={{ background: 'rgba(255,255,255,0.5)', color: '#ef4444' }}
        >
          🗑️ Limpiar
        </button>

        <button
          onClick={downloadCanvas}
          className="px-3 py-1.5 rounded-xl text-xs font-songwriter font-medium transition-all"
          style={{ background: 'rgba(255,255,255,0.5)', color: '#7c3aed' }}
        >
          ⬇️ Guardar
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{
          height: 340,
          background: '#ffffff',
          border: '1.5px solid rgba(168,85,247,0.2)',
          cursor: eraser ? 'cell' : 'crosshair',
          touchAction: 'none',
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <p className="text-xs font-songwriter opacity-50 text-center" style={{ color: '#7c3aed' }}>
        Dibuja libremente — tus creaciones son tuyas 🎨
      </p>
    </div>
  )
}
