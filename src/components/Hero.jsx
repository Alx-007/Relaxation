import React from 'react'

export default function Hero({ setActiveSection }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-16">
      {/* Floating decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute rounded-full animate-float"
          style={{
            width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(232,121,249,0.15) 0%, transparent 70%)',
            top: '10%', left: '5%',
            animationDelay: '0s',
          }}
        />
        <div
          className="absolute rounded-full animate-float"
          style={{
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
            top: '20%', right: '10%',
            animationDelay: '1.5s',
          }}
        />
        <div
          className="absolute rounded-full animate-float"
          style={{
            width: 150, height: 150,
            background: 'radial-gradient(circle, rgba(192,132,252,0.2) 0%, transparent 70%)',
            bottom: '25%', left: '15%',
            animationDelay: '3s',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
        {/* Subtitle chip */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-lato mb-6 glass"
          style={{ color: '#7c3aed' }}
        >
          <span className="animate-pulse-soft">🌸</span>
          <span>Tu espacio personal de calma</span>
        </div>

        {/* Main headline */}
        <h1
          className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ color: '#3b0764' }}
        >
          Todos los días,
          <br />
          <span
            className="italic"
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            todo el día contigo
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-lato text-lg sm:text-xl md:text-2xl mb-10 leading-relaxed max-w-xl mx-auto"
          style={{ color: '#5b21b6', opacity: 0.85 }}
        >
          Este es tu espacio. Respira. Juega. Escribe.{' '}
          <span className="font-semibold" style={{ color: '#7c3aed' }}>Tú puedes.</span>
        </p>

        {/* CTA cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { id: 'play', emoji: '🫧', title: 'Jugar', desc: 'Relájate con mini-juegos', delay: '0.1s' },
            { id: 'diary', emoji: '📓', title: 'Mi diario', desc: 'Escribe lo que sientes', delay: '0.2s' },
            { id: 'chat', emoji: '🧠', title: 'Repasar', desc: 'Estudia con Luna IA', delay: '0.3s' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="glass rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group animate-fade-in-up"
              style={{ animationDelay: item.delay, color: '#3b0764' }}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {item.emoji}
              </div>
              <div className="font-playfair font-semibold text-base mb-1">{item.title}</div>
              <div className="font-lato text-xs opacity-70">{item.desc}</div>
            </button>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="mt-12 flex flex-col items-center gap-2 opacity-50 animate-float" style={{ animationDelay: '2s' }}>
          <span className="font-lato text-xs" style={{ color: '#7c3aed' }}>Elige una sección para empezar</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
