import React, { useEffect, useRef, useState, useCallback } from 'react'
import { playPopSound } from '../utils/audioUtils'

const COLORS = ['#c084fc', '#e879f9', '#a855f7', '#d8b4fe', '#f0abfc', '#7c3aed']

function createBubble(canvasW, canvasH) {
  const r = 18 + Math.random() * 30
  return {
    id: Math.random(),
    x: r + Math.random() * (canvasW - r * 2),
    y: canvasH + r,
    r,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -(0.5 + Math.random() * 1.2),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: 0.5 + Math.random() * 0.4,
    popping: false,
    popProgress: 0,
  }
}

export default function BubblePop() {
  const canvasRef = useRef(null)
  const bubblesRef = useRef([])
  const animRef = useRef(null)
  const [count, setCount] = useState(0)

  const getPosByEvent = useCallback((e, canvas) => {
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
  }, [])

  const handlePop = useCallback((e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const { x, y } = getPosByEvent(e, canvas)
    let popped = false
    bubblesRef.current = bubblesRef.current.map((b) => {
      if (!popped && !b.popping && Math.hypot(b.x - x, b.y - y) < b.r) {
        popped = true
        playPopSound()
        return { ...b, popping: true, popProgress: 0 }
      }
      return b
    })
    if (popped) setCount((c) => c + 1)
  }, [getPosByEvent])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initial bubbles
    for (let i = 0; i < 20; i++) {
      const b = createBubble(canvas.width, canvas.height)
      b.y = Math.random() * canvas.height
      bubblesRef.current.push(b)
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      bubblesRef.current = bubblesRef.current.filter((b) => {
        if (b.popping) {
          return b.popProgress < 1
        }
        return b.y + b.r > -10 && b.y - b.r < h + 10
      })

      // Spawn new bubbles
      while (bubblesRef.current.filter((b) => !b.popping).length < 22) {
        bubblesRef.current.push(createBubble(w, h))
      }

      bubblesRef.current = bubblesRef.current.map((b) => {
        if (b.popping) {
          const p = b.popProgress
          const numParticles = 8
          for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * Math.PI * 2
            const dist = p * b.r * 2
            const px = b.x + Math.cos(angle) * dist
            const py = b.y + Math.sin(angle) * dist
            ctx.beginPath()
            ctx.arc(px, py, b.r * 0.2 * (1 - p), 0, Math.PI * 2)
            ctx.fillStyle = b.color
            ctx.globalAlpha = (1 - p) * b.opacity
            ctx.fill()
            ctx.globalAlpha = 1
          }
          return { ...b, popProgress: b.popProgress + 0.1 }
        }

        const newX = b.x + b.vx
        const newY = b.y + b.vy
        const vx = newX < b.r || newX > w - b.r ? -b.vx : b.vx

        // Draw bubble
        const grad = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1, b.x, b.y, b.r)
        grad.addColorStop(0, 'rgba(255,255,255,0.6)')
        grad.addColorStop(0.4, b.color + '99')
        grad.addColorStop(1, b.color + '44')

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.globalAlpha = b.opacity
        ctx.fill()

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.strokeStyle = b.color + 'aa'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Shine
        ctx.beginPath()
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.35, b.r * 0.2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.fill()
        ctx.globalAlpha = 1

        return { ...b, x: newX, y: newY, vx }
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    canvas.addEventListener('click', handlePop)
    canvas.addEventListener('touchstart', handlePop, { passive: false })

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', handlePop)
      canvas.removeEventListener('touchstart', handlePop)
      bubblesRef.current = []
    }
  }, [handlePop])

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-songwriter font-semibold"
        style={{ background: 'rgba(168,85,247,0.15)', color: '#7c3aed' }}
      >
        🫧 Burbujas reventadas: <span className="text-lg font-bold">{count}</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl cursor-pointer"
        style={{ height: 360, touchAction: 'none', background: 'rgba(255,255,255,0.15)' }}
      />
      <p className="text-xs font-songwriter opacity-60" style={{ color: '#7c3aed' }}>
        ¡Toca las burbujas para reventarlas!
      </p>
    </div>
  )
}
