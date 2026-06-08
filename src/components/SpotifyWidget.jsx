import React, { useState, useEffect, useRef } from 'react'
import {
  redirectToSpotifyLogin,
  exchangeCodeForToken,
  getValidToken,
  logout,
} from '../utils/spotifyAuth'
import {
  getCurrentlyPlaying,
  getUserProfile,
  pausePlayback,
  resumePlayback,
  skipToNext,
  skipToPrevious,
} from '../utils/spotifyApi'

export default function SpotifyWidget() {
  const [expanded, setExpanded] = useState(false)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [nowPlaying, setNowPlaying] = useState(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code) {
        await exchangeCodeForToken(code)
        window.history.replaceState({}, '', window.location.pathname)
      }
      const t = await getValidToken()
      setToken(t)
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (!token) { setUser(null); return }
    getUserProfile(token).then(setUser)
  }, [token])

  useEffect(() => {
    const poll = async () => {
      const t = await getValidToken()
      if (!t) { setToken(null); return }
      const data = await getCurrentlyPlaying(t)
      setNowPlaying(data)
    }

    if (expanded && token) {
      poll()
      intervalRef.current = setInterval(poll, 5000)
    }
    return () => clearInterval(intervalRef.current)
  }, [expanded, token])

  const handleControl = async (action) => {
    const t = await getValidToken()
    if (!t) return
    if (action === 'toggle') {
      nowPlaying?.is_playing ? await pausePlayback(t) : await resumePlayback(t)
    } else if (action === 'next') {
      await skipToNext(t)
    } else if (action === 'prev') {
      await skipToPrevious(t)
    }
    setTimeout(async () => {
      const t2 = await getValidToken()
      if (t2) setNowPlaying(await getCurrentlyPlaying(t2))
    }, 600)
  }

  const handleLogout = () => {
    logout()
    setToken(null)
    setNowPlaying(null)
  }

  const track = nowPlaying?.item
  const isPlaying = nowPlaying?.is_playing

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end" style={{ zIndex: 9999 }}>
      {expanded && (
        <div
          className="mb-3 rounded-2xl shadow-2xl p-4"
          style={{
            width: 280,
            background: 'rgba(243,232,255,0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168,85,247,0.25)',
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-16">
              <div
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: '#a855f7', borderTopColor: 'transparent' }}
              />
            </div>
          ) : !token ? (
            <NotConnected onConnect={redirectToSpotifyLogin} />
          ) : track ? (
            <NowPlaying
              track={track}
              isPlaying={isPlaying}
              user={user}
              onControl={handleControl}
              onLogout={handleLogout}
            />
          ) : (
            <Idle user={user} onLogout={handleLogout} />
          )}
        </div>
      )}

      <button
        onClick={() => setExpanded(e => !e)}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: expanded
            ? 'linear-gradient(135deg, #a855f7, #e879f9)'
            : '#1DB954',
          boxShadow: expanded
            ? '0 4px 20px rgba(168,85,247,0.45)'
            : '0 4px 20px rgba(29,185,84,0.4)',
        }}
        aria-label={expanded ? 'Cerrar reproductor' : 'Abrir Spotify'}
      >
        {expanded ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M19 13H5v-2h14v2z" />
          </svg>
        ) : (
          <SpotifyIcon size={22} color="white" />
        )}
      </button>
    </div>
  )
}

function NotConnected({ onConnect }) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <SpotifyIcon size={32} />
      <p className="text-purple-800 text-sm font-semibold text-center">Conecta tu Spotify</p>
      <p className="text-purple-400 text-xs text-center leading-relaxed">
        Controla la música que suena en cualquiera de tus dispositivos
      </p>
      <button
        onClick={onConnect}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        style={{ background: '#1DB954', boxShadow: '0 2px 12px rgba(29,185,84,0.35)' }}
      >
        <SpotifyIcon size={16} color="white" />
        Conectar con Spotify
      </button>
    </div>
  )
}

function NowPlaying({ track, isPlaying, user, onControl, onLogout }) {
  const albumImg = track.album?.images?.[0]?.url
  const artists = track.artists?.map(a => a.name).join(', ')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {albumImg ? (
          <img
            src={albumImg}
            alt={track.album?.name}
            className="w-14 h-14 rounded-xl shadow-md flex-shrink-0"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,0.15)' }}
          >
            <SpotifyIcon size={24} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-purple-900 font-semibold text-sm truncate">{track.name}</p>
          <p className="text-purple-500 text-xs truncate">{artists}</p>
          <p className="text-purple-400 text-xs truncate">{track.album?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <CtrlBtn onClick={() => onControl('prev')}>
          <PrevIcon />
        </CtrlBtn>
        <CtrlBtn onClick={() => onControl('toggle')} primary>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </CtrlBtn>
        <CtrlBtn onClick={() => onControl('next')}>
          <NextIcon />
        </CtrlBtn>
      </div>

      <div
        className="flex items-center justify-between pt-2"
        style={{ borderTop: '1px solid rgba(168,85,247,0.2)' }}
      >
        <span className="text-purple-400 text-xs truncate max-w-[160px]">
          {user?.display_name}
        </span>
        <button
          onClick={onLogout}
          className="text-purple-400 text-xs hover:text-purple-600 transition-colors"
        >
          Desconectar
        </button>
      </div>
    </div>
  )
}

function Idle({ user, onLogout }) {
  return (
    <div className="flex flex-col items-center gap-2 py-1">
      <SpotifyIcon size={28} />
      <p className="text-purple-700 text-sm font-semibold">Nada suena ahora</p>
      <p className="text-purple-400 text-xs text-center leading-relaxed">
        Abre Spotify en cualquier dispositivo y aparecerá aquí
      </p>
      <div
        className="flex items-center justify-between w-full pt-2 mt-1"
        style={{ borderTop: '1px solid rgba(168,85,247,0.2)' }}
      >
        <span className="text-purple-400 text-xs truncate">{user?.display_name}</span>
        <button
          onClick={onLogout}
          className="text-purple-400 text-xs hover:text-purple-600 transition-colors"
        >
          Desconectar
        </button>
      </div>
    </div>
  )
}

function CtrlBtn({ onClick, children, primary }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 ${
        primary ? 'w-10 h-10' : 'w-8 h-8'
      }`}
      style={{
        background: primary
          ? 'linear-gradient(135deg, #a855f7, #e879f9)'
          : 'rgba(168,85,247,0.12)',
      }}
    >
      {children}
    </button>
  )
}

function SpotifyIcon({ size = 24, color = '#1DB954' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function PlayIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
}
function PauseIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
}
function PrevIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="#a855f7"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
}
function NextIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="#a855f7"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
}
