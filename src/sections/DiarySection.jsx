import React, { useState, useEffect, useRef, useCallback } from 'react'
import { getRandomPhrase } from '../utils/motivationalPhrases'
import { playSaveSound } from '../utils/audioUtils'

const BACKGROUNDS = [
  { id: 'plain', label: 'Liso', style: {} },
  { id: 'lines', label: 'Líneas', style: { backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(168,85,247,0.12) 28px)', backgroundSize: '100% 28px' } },
  { id: 'grid', label: 'Cuadrícula', style: { backgroundImage: 'linear-gradient(rgba(168,85,247,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' } },
  { id: 'parchment', label: 'Pergamino', style: { background: 'linear-gradient(135deg, #fef9ec 0%, #fef3c7 50%, #fef9ec 100%)' } },
]

const FONT_SIZES = [
  { label: 'Pequeño', value: '14px' },
  { label: 'Normal', value: '16px' },
  { label: 'Grande', value: '20px' },
]

const TEXT_COLORS = ['#3b0764', '#a855f7', '#1e40af', '#166534', '#b91c1c', '#92400e', '#1f2937']

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem('spaceYours_notes') || '[]')
  } catch { return [] }
}

function saveNotes(notes) {
  localStorage.setItem('spaceYours_notes', JSON.stringify(notes))
}

export default function DiarySection() {
  const [notes, setNotes] = useState(loadNotes)
  const [activeId, setActiveId] = useState(null)
  const [title, setTitle] = useState('')
  const [saved, setSaved] = useState(false)
  const [phrase] = useState(getRandomPhrase)
  const [bgId, setBgId] = useState('plain')
  const [fontSize, setFontSize] = useState('16px')
  const [textColor, setTextColor] = useState('#3b0764')
  const [showPanel, setShowPanel] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const editorRef = useRef(null)
  const saveTimerRef = useRef(null)

  const activeNote = notes.find((n) => n.id === activeId)
  const bg = BACKGROUNDS.find((b) => b.id === bgId)

  const createNote = useCallback(() => {
    const id = Date.now()
    const newNote = { id, title: 'Nueva nota', content: '', createdAt: new Date().toISOString() }
    setNotes((prev) => {
      const updated = [newNote, ...prev]
      saveNotes(updated)
      return updated
    })
    setActiveId(id)
    setTitle('Nueva nota')
    setTimeout(() => editorRef.current?.focus(), 100)
  }, [])

  const selectNote = useCallback((id) => {
    setActiveId(id)
    const note = notes.find((n) => n.id === id)
    if (note) {
      setTitle(note.title)
      if (editorRef.current) {
        editorRef.current.innerHTML = note.content || ''
      }
    }
    setShowPanel(false)
  }, [notes])

  useEffect(() => {
    if (activeNote && editorRef.current) {
      editorRef.current.innerHTML = activeNote.content || ''
    }
  }, [activeId])

  const autoSave = useCallback(() => {
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      if (!activeId || !editorRef.current) return
      const content = editorRef.current.innerHTML
      setNotes((prev) => {
        const updated = prev.map((n) => n.id === activeId ? { ...n, content, title } : n)
        saveNotes(updated)
        return updated
      })
      playSaveSound()
      setSaved(true)
      setTimeout(() => setSaved(false), 1800)
    }, 800)
  }, [activeId, title])

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    autoSave()
  }

  const execFormat = (cmd, value) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, value)
    autoSave()
  }

  const deleteNote = useCallback((id) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id)
      saveNotes(updated)
      if (activeId === id) {
        setActiveId(updated[0]?.id || null)
        setTitle(updated[0]?.title || '')
      }
      return updated
    })
    setDeleteConfirm(null)
  }, [activeId])

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold mb-3" style={{ color: '#3b0764' }}>
            Mi diario 📓
          </h2>
          <p
            className="font-lato text-sm italic px-4 py-2 rounded-xl inline-block glass"
            style={{ color: '#7c3aed' }}
          >
            "{phrase}"
          </p>
        </div>

        <div className="flex gap-4 h-[600px]">
          {/* Notes panel — sidebar on desktop, sheet on mobile */}
          <div
            className={`${
              showPanel
                ? 'fixed inset-0 z-40 flex items-start justify-start pt-20 pl-4'
                : 'hidden md:flex'
            } md:relative md:inset-auto md:z-auto md:pt-0 md:pl-0`}
          >
            <div
              className="glass rounded-3xl flex flex-col overflow-hidden"
              style={{ width: 220, height: showPanel ? '80vh' : '100%', minHeight: 0 }}
            >
              <div className="flex items-center justify-between p-4 pb-2">
                <span className="font-playfair font-semibold text-sm" style={{ color: '#3b0764' }}>
                  Notas ({notes.length})
                </span>
                <button
                  onClick={createNote}
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-base transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#e879f9)' }}
                  title="Nueva nota"
                >
                  +
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-2 pb-2">
                {notes.length === 0 ? (
                  <div className="text-center py-8 opacity-50">
                    <div className="text-3xl mb-2">📝</div>
                    <p className="text-xs font-lato" style={{ color: '#7c3aed' }}>Sin notas aún</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="relative group">
                      <button
                        onClick={() => selectNote(note.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all text-xs font-lato ${
                          activeId === note.id ? 'text-white' : ''
                        }`}
                        style={
                          activeId === note.id
                            ? { background: 'linear-gradient(135deg,#a855f7,#e879f9)', color: '#fff' }
                            : { color: '#3b0764', background: 'rgba(255,255,255,0.3)' }
                        }
                      >
                        <div className="font-semibold truncate">{note.title}</div>
                        <div className="opacity-60 text-xs mt-0.5">{formatDate(note.createdAt)}</div>
                      </button>
                      {deleteConfirm === note.id ? (
                        <div className="flex gap-1 px-3 pb-2">
                          <button onClick={() => deleteNote(note.id)} className="text-xs text-red-500 font-semibold">Eliminar</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-xs opacity-50 ml-2" style={{ color: '#7c3aed' }}>Cancelar</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(note.id)}
                          className="absolute right-1 top-1.5 w-5 h-5 rounded-lg items-center justify-center text-xs text-red-400 hidden group-hover:flex"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Backdrop mobile */}
            {showPanel && (
              <div className="fixed inset-0 -z-10 bg-black/20" onClick={() => setShowPanel(false)} />
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col glass rounded-3xl overflow-hidden min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b" style={{ borderColor: 'rgba(192,132,252,0.2)' }}>
              {/* Mobile: notes toggle */}
              <button
                onClick={() => setShowPanel(true)}
                className="md:hidden px-2.5 py-1 rounded-lg text-xs font-lato"
                style={{ background: 'rgba(168,85,247,0.15)', color: '#7c3aed' }}
              >
                📋 Notas
              </button>

              <div className="w-px h-5 bg-purple-200 hidden md:block" />

              {/* Format buttons */}
              {[
                { cmd: 'bold', label: <strong>B</strong>, title: 'Negrita' },
                { cmd: 'italic', label: <em>I</em>, title: 'Cursiva' },
                { cmd: 'underline', label: <u>U</u>, title: 'Subrayado' },
              ].map(({ cmd, label, title }) => (
                <button
                  key={cmd}
                  onMouseDown={(e) => { e.preventDefault(); execFormat(cmd) }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all hover:bg-purple-100"
                  style={{ color: '#7c3aed' }}
                  title={title}
                >
                  {label}
                </button>
              ))}

              <div className="w-px h-5 bg-purple-200" />

              {/* Font size */}
              <select
                value={fontSize}
                onChange={(e) => { setFontSize(e.target.value); execFormat('fontSize', e.target.value === '14px' ? '1' : e.target.value === '16px' ? '3' : '5') }}
                className="rounded-lg px-2 py-1 text-xs font-lato border-0 outline-none"
                style={{ background: 'rgba(255,255,255,0.5)', color: '#7c3aed' }}
              >
                {FONT_SIZES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>

              {/* Text colors */}
              <div className="flex gap-1">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c}
                    onMouseDown={(e) => { e.preventDefault(); execFormat('foreColor', c) }}
                    className="w-4 h-4 rounded-full border border-white/60"
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </div>

              <div className="w-px h-5 bg-purple-200" />

              {/* Bg options */}
              <select
                value={bgId}
                onChange={(e) => setBgId(e.target.value)}
                className="rounded-lg px-2 py-1 text-xs font-lato border-0 outline-none"
                style={{ background: 'rgba(255,255,255,0.5)', color: '#7c3aed' }}
              >
                {BACKGROUNDS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>

              {/* Save indicator */}
              <div className={`ml-auto flex items-center gap-1 text-xs font-lato transition-opacity duration-500 ${saved ? 'opacity-100' : 'opacity-0'}`} style={{ color: '#a855f7' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Guardado
              </div>
            </div>

            {/* Title */}
            {activeId ? (
              <>
                <input
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Título de la nota..."
                  className="px-5 pt-4 pb-2 text-lg font-playfair font-semibold bg-transparent outline-none border-b"
                  style={{ color: '#3b0764', borderColor: 'rgba(192,132,252,0.15)' }}
                />
                {/* Content editable */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={autoSave}
                  className="flex-1 px-5 py-4 outline-none overflow-y-auto font-lato leading-relaxed"
                  style={{
                    color: '#3b0764',
                    fontSize,
                    minHeight: 0,
                    ...bg.style,
                  }}
                  data-placeholder="Escribe lo que quieras... este espacio es solo tuyo 💜"
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="text-5xl">📝</div>
                <p className="font-playfair text-xl italic" style={{ color: '#7c3aed' }}>
                  {notes.length === 0 ? 'Comienza tu primera nota' : 'Selecciona una nota'}
                </p>
                <button
                  onClick={createNote}
                  className="px-6 py-2.5 rounded-2xl font-lato font-semibold text-white transition-all hover:scale-105 shadow-md"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#e879f9)' }}
                >
                  + Nueva nota
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(92,33,182,0.35);
          pointer-events: none;
        }
      `}</style>
    </section>
  )
}
