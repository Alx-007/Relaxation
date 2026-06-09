import React, { useState } from 'react'
import BubblePop from '../games/BubblePop'
import BreathingExercise from '../games/BreathingExercise'
import SortGame from '../games/SortGame'
import DrawingCanvas from '../games/DrawingCanvas'
import OrganizeGame from '../games/OrganizeGame'

const GAMES = [
  {
    id: 'bubbles',
    emoji: '🫧',
    title: 'Reventar burbujas',
    desc: 'Relájate reventando burbujas que flotan',
    component: BubblePop,
    color: '#c084fc',
  },
  {
    id: 'breathing',
    emoji: '🌬️',
    title: 'Respiración guiada',
    desc: 'Un ejercicio de respiración para calmarte',
    component: BreathingExercise,
    color: '#a855f7',
  },
  {
    id: 'sort',
    emoji: '🔀',
    title: 'Ordenar de mayor a menor',
    desc: 'Arrastra números o colores y ponlos en orden',
    component: SortGame,
    color: '#e879f9',
  },
  {
    id: 'drawing',
    emoji: '✏️',
    title: 'Dibujar libremente',
    desc: 'Un lienzo para expresarte sin límites',
    component: DrawingCanvas,
    color: '#c084fc',
  },
  {
    id: 'organize',
    emoji: '🗂️',
    title: 'Organizar todo',
    desc: 'Arrastra cada cosa a su categoría correcta',
    component: OrganizeGame,
    color: '#818cf8',
  },
]

function Modal({ game, onClose }) {
  const Component = game.component
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(59,7,100,0.3)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in-up overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: 'rgba(192,132,252,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{game.emoji}</span>
            <h3 className="font-playfair text-xl font-semibold" style={{ color: '#3b0764' }}>
              {game.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-purple-100"
            style={{ color: '#7c3aed' }}
          >
            ✕
          </button>
        </div>

        {/* Game */}
        <div className="p-5">
          <Component />
        </div>
      </div>
    </div>
  )
}

export default function PlaySection() {
  const [activeGame, setActiveGame] = useState(null)

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold mb-3" style={{ color: '#3b0764' }}>
            Jugar y respirar 🫧
          </h2>
          <p className="font-lato text-lg opacity-70 max-w-md mx-auto" style={{ color: '#5b21b6' }}>
            Mini-juegos y ejercicios para relajar la mente antes del examen
          </p>
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES.map((game, i) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game)}
              className="glass rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group animate-fade-in-up"
              style={{
                animationDelay: `${i * 0.08}s`,
                borderColor: `${game.color}33`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${game.color}22`, boxShadow: `0 4px 16px ${game.color}33` }}
              >
                {game.emoji}
              </div>
              <h3 className="font-playfair text-lg font-semibold mb-1" style={{ color: '#3b0764' }}>
                {game.title}
              </h3>
              <p className="font-lato text-sm opacity-65" style={{ color: '#5b21b6' }}>
                {game.desc}
              </p>
              <div
                className="mt-4 flex items-center gap-1 text-xs font-lato font-semibold"
                style={{ color: game.color }}
              >
                Jugar ahora
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeGame && <Modal game={activeGame} onClose={() => setActiveGame(null)} />}
    </section>
  )
}
