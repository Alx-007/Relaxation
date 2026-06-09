async function call(token, path, method = 'GET') {
  try {
    const res = await fetch(`https://api.spotify.com/v1${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 204 || res.status === 202 || !res.ok) return null
    const text = await res.text()
    if (!text) return null
    return JSON.parse(text)
  } catch {
    return null
  }
}

export const getUserProfile = (token) => call(token, '/me')

export async function getCurrentlyPlaying(token) {
  const data = await call(token, '/me/player/currently-playing')
  if (data?.item) return data
  // fallback: full player state (más fiable en algunos dispositivos)
  const player = await call(token, '/me/player')
  return player?.item ? player : null
}

export const pausePlayback = (token) => call(token, '/me/player/pause', 'PUT')
export const resumePlayback = (token) => call(token, '/me/player/play', 'PUT')
export const skipToNext = (token) => call(token, '/me/player/next', 'POST')
export const skipToPrevious = (token) => call(token, '/me/player/previous', 'POST')
