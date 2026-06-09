import React, { useState, useEffect, useRef, useCallback } from 'react'
import { sendMessageToLuna } from '../utils/anthropicChat'

const STORAGE_KEY = 'spaceYours_chat'
const MAX_HISTORY = 50

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content: '¡Hola! Soy Luna 🌙 ¿Qué tema quieres repasar hoy? Estoy aquí para ayudarte ✨',
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || [WELCOME]
  } catch {
    return [WELCOME]
  }
}

function LunaAvatar({ typing }) {
  return (
    <div
      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-sm"
      style={{ background: 'linear-gradient(135deg,#a855f7,#e879f9)' }}
    >
      {typing ? (
        <span className="text-white text-sm font-bold animate-pulse-soft">🌙</span>
      ) : (
        <span>🌙</span>
      )}
    </div>
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && <LunaAvatar />}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl font-songwriter text-sm leading-relaxed ${
          isUser ? 'rounded-br-sm' : 'rounded-bl-sm'
        }`}
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg,#a855f7,#e879f9)',
                color: '#fff',
                boxShadow: '0 2px 12px rgba(168,85,247,0.3)',
              }
            : {
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(8px)',
                color: '#3b0764',
                border: '1px solid rgba(168,85,247,0.2)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }
        }
      >
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <LunaAvatar typing />
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm font-songwriter text-sm"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(168,85,247,0.2)', color: '#7c3aed' }}
      >
        <span>Luna está escribiendo</span>
        <span className="typing-dots" />
      </div>
    </div>
  )
}

export default function ChatSection() {
  const [messages, setMessages] = useState(loadHistory)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const hasApiKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY

  useEffect(() => {
    const toSave = messages.slice(-MAX_HISTORY)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText, loading])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setError('')
    setInput('')

    const userMsg = { id: Date.now(), role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)
    setStreamingText('')

    try {
      let full = ''
      await sendMessageToLuna(history, (chunk, accumulated) => {
        full = accumulated
        setStreamingText(accumulated)
      })
      const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: full }
      setMessages((prev) => [...prev, assistantMsg])
      setStreamingText('')
    } catch (err) {
      setError(err.message || 'Error al conectar con Luna. Verifica tu API key.')
      setStreamingText('')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [input, loading, messages])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const newSession = () => {
    setMessages([WELCOME])
    setError('')
    setStreamingText('')
    setInput('')
  }

  return (
    <section className="min-h-screen pt-20 pb-4 px-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1" style={{ height: 'calc(100vh - 5rem)' }}>
        {/* Header */}
        <div className="text-center py-4 animate-fade-in-up">
          <h2 className="font-muthiara text-3xl sm:text-4xl font-bold" style={{ color: '#3b0764' }}>
            Repasar con Luna 🌙
          </h2>
          <p className="font-songwriter text-sm opacity-65 mt-1" style={{ color: '#5b21b6' }}>
            Tu tutora personal de IA — amable, paciente y siempre aquí
          </p>
        </div>

        {/* No API key warning */}
        {!hasApiKey && (
          <div
            className="glass rounded-2xl px-4 py-3 mb-3 text-sm font-songwriter text-center animate-fade-in-up"
            style={{ color: '#b91c1c', background: 'rgba(254,226,226,0.7)' }}
          >
            ⚠️ Falta la API key de Anthropic. Crea un archivo <code>.env</code> con{' '}
            <code>VITE_ANTHROPIC_API_KEY=tu-key</code> y reinicia el servidor.
          </div>
        )}

        {/* Chat window */}
        <div
          className="flex-1 glass rounded-3xl overflow-hidden flex flex-col"
          style={{ minHeight: 0 }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4" style={{ minHeight: 0 }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {loading && !streamingText && <TypingIndicator />}
            {streamingText && (
              <div className="flex items-end gap-2">
                <LunaAvatar />
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-sm font-songwriter text-sm leading-relaxed"
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#3b0764',
                    border: '1px solid rgba(168,85,247,0.2)',
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{streamingText}</div>
                  <span className="inline-block w-0.5 h-4 ml-0.5 bg-purple-400 animate-pulse align-middle" />
                </div>
              </div>
            )}
            {error && (
              <div
                className="text-center text-xs font-songwriter px-3 py-2 rounded-xl"
                style={{ background: 'rgba(254,226,226,0.7)', color: '#b91c1c' }}
              >
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div
            className="px-4 py-3 border-t flex items-end gap-2"
            style={{ borderColor: 'rgba(192,132,252,0.2)', background: 'rgba(255,255,255,0.4)' }}
          >
            <button
              onClick={newSession}
              className="px-3 py-2 rounded-xl text-xs font-songwriter font-medium transition-all hover:bg-purple-100 flex-shrink-0"
              style={{ color: '#7c3aed', background: 'rgba(255,255,255,0.5)' }}
              title="Nueva sesión"
            >
              🔄
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe tu pregunta a Luna..."
              disabled={loading || !hasApiKey}
              rows={1}
              className="flex-1 resize-none bg-white/60 rounded-2xl px-4 py-2.5 font-songwriter text-sm outline-none border transition-all"
              style={{
                color: '#3b0764',
                borderColor: 'rgba(168,85,247,0.3)',
                maxHeight: 100,
                overflowY: 'auto',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading || !hasApiKey}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#a855f7,#e879f9)', boxShadow: '0 4px 16px rgba(168,85,247,0.35)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-xs font-songwriter opacity-40 pt-2" style={{ color: '#7c3aed' }}>
          Presiona Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </section>
  )
}
