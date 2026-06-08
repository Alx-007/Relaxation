import React, { useState, useCallback } from 'react'
import { playSaveSound } from '../utils/audioUtils'

const PRESETS = [
  // Rojos / rosas
  { r: 239, g: 68,  b: 68,  name: 'Rojo' },
  { r: 244, g: 114, b: 182, name: 'Rosa' },
  { r: 251, g: 113, b: 133, name: 'Sandía' },
  { r: 236, g: 72,  b: 153, name: 'Fucsia' },
  { r: 190, g: 18,  b: 60,  name: 'Carmesí' },
  // Naranjas / amarillos
  { r: 249, g: 115, b: 22,  name: 'Naranja' },
  { r: 251, g: 191, b: 36,  name: 'Ámbar' },
  { r: 234, g: 179, b: 8,   name: 'Oro' },
  { r: 253, g: 224, b: 71,  name: 'Amarillo' },
  { r: 255, g: 237, b: 153, name: 'Vainilla' },
  // Verdes
  { r: 34,  g: 197, b: 94,  name: 'Verde' },
  { r: 74,  g: 222, b: 128, name: 'Menta' },
  { r: 16,  g: 185, b: 129, name: 'Esmeralda' },
  { r: 6,   g: 148, b: 162, name: 'Pino' },
  { r: 187, g: 247, b: 208, name: 'Celadón' },
  // Azules / cielos
  { r: 59,  g: 130, b: 246, name: 'Azul' },
  { r: 96,  g: 165, b: 250, name: 'Cielo' },
  { r: 14,  g: 165, b: 233, name: 'Cian' },
  { r: 56,  g: 189, b: 248, name: 'Glaciar' },
  { r: 147, g: 197, b: 253, name: 'Bebé' },
  // Púrpuras / lila
  { r: 168, g: 85,  b: 247, name: 'Lila' },
  { r: 192, g: 132, b: 252, name: 'Lavanda' },
  { r: 232, g: 121, b: 249, name: 'Orquídea' },
  { r: 124, g: 58,  b: 237, name: 'Violeta' },
  { r: 216, g: 180, b: 254, name: 'Malva' },
  // Neutros / tierra
  { r: 120, g: 113, b: 108, name: 'Piedra' },
  { r: 180, g: 83,  b: 9,   name: 'Canela' },
  { r: 231, g: 229, b: 228, name: 'Humo' },
  { r: 15,  g: 23,  b: 42,  name: 'Medianoche' },
  { r: 255, g: 251, b: 235, name: 'Crema' },
]

export default function ColorPalette() {
  const [r, setR] = useState(168)
  const [g, setG] = useState(85)
  const [b, setB] = useState(247)
  const [saved, setSaved] = useState([])
  const [popId, setPopId] = useState(null)

  const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
  const rgb = `rgb(${r}, ${g}, ${b})`

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  const textColor = luminance > 140 ? '#3b0764' : '#f9f0ff'

  const saveColor = useCallback(() => {
    playSaveSound()
    const id = Date.now()
    setSaved((prev) => [...prev, { r, g, b, hex, id }])
    setPopId(id)
    setTimeout(() => setPopId(null), 400)
  }, [r, g, b, hex])

  const removeColor = useCallback((id) => {
    setSaved((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const SliderTrack = ({ value, channel }) => {
    const colors = {
      r: `linear-gradient(to right, #000, rgb(255,${g},${b}))`,
      g: `linear-gradient(to right, #000, rgb(${r},255,${b}))`,
      b: `linear-gradient(to right, #000, rgb(${r},${g},255))`,
    }
    const labels = { r: 'Rojo', g: 'Verde', b: 'Azul' }
    const setters = { r: setR, g: setG, b: setB }

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs font-lato mb-1 opacity-70" style={{ color: '#7c3aed' }}>
          <span>{labels[channel]}</span>
          <span>{value}</span>
        </div>
        <div className="relative h-5 flex items-center">
          <div
            className="absolute inset-0 rounded-full h-3 my-auto"
            style={{ background: colors[channel] }}
          />
          <input
            type="range"
            min={0}
            max={255}
            value={value}
            onChange={(e) => setters[channel](Number(e.target.value))}
            className="relative w-full appearance-none bg-transparent cursor-pointer"
            style={{ height: 12 }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Preview */}
      <div
        className="w-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300"
        style={{
          height: 140,
          background: rgb,
          boxShadow: `0 8px 32px ${hex}55`,
        }}
      >
        <span className="font-playfair text-3xl font-bold" style={{ color: textColor }}>
          {hex.toUpperCase()}
        </span>
        <span className="font-lato text-sm opacity-80" style={{ color: textColor }}>
          {rgb}
        </span>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-3 px-1">
        <SliderTrack value={r} channel="r" />
        <SliderTrack value={g} channel="g" />
        <SliderTrack value={b} channel="b" />
      </div>

      {/* Preset swatches */}
      <div>
        <p className="text-xs font-lato font-semibold mb-2" style={{ color: '#7c3aed' }}>
          Colores predefinidos
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((c) => (
            <button
              key={c.name}
              title={c.name}
              onClick={() => { setR(c.r); setG(c.g); setB(c.b) }}
              className="w-7 h-7 rounded-lg transition-all duration-150 hover:scale-125 active:scale-110"
              style={{
                background: `rgb(${c.r},${c.g},${c.b})`,
                border: r === c.r && g === c.g && b === c.b
                  ? '2px solid #3b0764'
                  : '2px solid rgba(255,255,255,0.5)',
                boxShadow: `0 2px 6px rgba(${c.r},${c.g},${c.b},0.4)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={saveColor}
        className="w-full py-2.5 rounded-2xl font-lato font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
        style={{ background: 'linear-gradient(135deg, #a855f7, #e879f9)', boxShadow: '0 4px 16px rgba(168,85,247,0.35)' }}
      >
        💾 Guardar color
      </button>

      {/* Saved gallery */}
      {saved.length > 0 && (
        <div>
          <p className="text-xs font-lato font-semibold mb-2" style={{ color: '#7c3aed' }}>
            Colores guardados ({saved.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {saved.map((c) => (
              <div
                key={c.id}
                className="relative group"
                style={{
                  transform: popId === c.id ? 'scale(1.25)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl cursor-pointer"
                  style={{
                    background: `rgb(${c.r},${c.g},${c.b})`,
                    border: '2px solid rgba(255,255,255,0.6)',
                    boxShadow: `0 2px 8px ${c.hex}55`,
                  }}
                  title={c.hex}
                />
                <button
                  onClick={() => removeColor(c.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-xs items-center justify-center hidden group-hover:flex"
                  style={{ background: '#e879f9', fontSize: 9 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #a855f7;
          box-shadow: 0 2px 6px rgba(168,85,247,0.4);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
