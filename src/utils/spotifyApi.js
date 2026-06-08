async function call(token, path, method = 'GET') {
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 204 || res.status === 202 || !res.ok) return null
  return res.json()
}

export const getUserProfile = (token) => call(token, '/me')
export const getCurrentlyPlaying = (token) => call(token, '/me/player/currently-playing')
export const pausePlayback = (token) => call(token, '/me/player/pause', 'PUT')
export const resumePlayback = (token) => call(token, '/me/player/play', 'PUT')
export const skipToNext = (token) => call(token, '/me/player/next', 'POST')
export const skipToPrevious = (token) => call(token, '/me/player/previous', 'POST')
