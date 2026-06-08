import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FlowerBackground from './components/FlowerBackground'
import SpotifyWidget from './components/SpotifyWidget'
import PlaySection from './sections/PlaySection'
import DiarySection from './sections/DiarySection'
import ChatSection from './sections/ChatSection'

export default function App() {
  const [activeSection, setActiveSection] = useState('home')

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#f3e8ff' }}>
      <FlowerBackground />

      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="relative z-10">
        {activeSection === 'home' && <Hero setActiveSection={setActiveSection} />}
        {activeSection === 'play' && <PlaySection />}
        {activeSection === 'diary' && <DiarySection />}
        {activeSection === 'chat' && <ChatSection />}
      </main>

      <SpotifyWidget />
    </div>
  )
}
