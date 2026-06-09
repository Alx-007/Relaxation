import React, { useState, useCallback } from 'react'

const NAV_ITEMS = [
  { id: 'play', label: 'Jugar', emoji: '🫧' },
  { id: 'diary', label: 'Mi diario', emoji: '📓' },
  { id: 'chat', label: 'Repasar', emoji: '🧠' },
]

export default function Navbar({ activeSection, setActiveSection }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleNav = useCallback((id) => {
    setActiveSection(id)
    setDrawerOpen(false)
  }, [setActiveSection])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 glass"
        style={{
          background: 'rgba(243, 232, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(192, 132, 252, 0.25)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="font-muthiara text-2xl md:text-3xl transition-opacity hover:opacity-80"
            style={{ color: '#7c3aed' }}
          >
            SpaceYours
            <span className="ml-1 text-base">🌸</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-4 py-2 rounded-xl font-songwriter font-medium text-sm transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-white shadow-md'
                    : 'text-plum-800 hover:bg-white/50'
                }`}
                style={
                  activeSection === item.id
                    ? { background: 'linear-gradient(135deg, #a855f7, #e879f9)' }
                    : { color: '#4c0882' }
                }
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl transition-colors hover:bg-white/40"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Menú"
            style={{ color: '#7c3aed' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {drawerOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20"
          onClick={() => setDrawerOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-64 glass flex flex-col pt-20 px-6 gap-2 transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ background: 'rgba(243, 232, 255, 0.92)' }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full px-4 py-3 rounded-2xl font-songwriter font-medium text-base text-left transition-all duration-200 ${
                activeSection === item.id ? 'text-white shadow-md' : ''
              }`}
              style={
                activeSection === item.id
                  ? { background: 'linear-gradient(135deg, #a855f7, #e879f9)', color: '#fff' }
                  : { color: '#4c0882' }
              }
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
