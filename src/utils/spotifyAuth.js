const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const SCOPES = 'user-read-currently-playing user-read-playback-state user-modify-playback-state user-read-private'

function getRedirectUri() {
  return import.meta.env.VITE_SPOTIFY_REDIRECT_URI || window.location.origin
}

function generateVerifier() {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function generateChallenge(verifier) {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function redirectToSpotifyLogin() {
  const verifier = generateVerifier()
  const challenge = await generateChallenge(verifier)
  sessionStorage.setItem('spotify_verifier', verifier)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: getRedirectUri(),
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })
  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCodeForToken(code) {
  const verifier = sessionStorage.getItem('spotify_verifier')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(),
      code_verifier: verifier,
    }),
  })
  const data = await res.json()
  if (data.access_token) {
    localStorage.setItem('spotify_token', data.access_token)
    localStorage.setItem('spotify_refresh', data.refresh_token)
    localStorage.setItem('spotify_expires', Date.now() + data.expires_in * 1000)
    sessionStorage.removeItem('spotify_verifier')
  }
  return data
}

async function refreshToken() {
  const refresh = localStorage.getItem('spotify_refresh')
  if (!refresh) return null
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refresh,
    }),
  })
  const data = await res.json()
  if (data.access_token) {
    localStorage.setItem('spotify_token', data.access_token)
    localStorage.setItem('spotify_expires', Date.now() + data.expires_in * 1000)
    if (data.refresh_token) localStorage.setItem('spotify_refresh', data.refresh_token)
    return data.access_token
  }
  return null
}

export async function getValidToken() {
  const token = localStorage.getItem('spotify_token')
  const expires = Number(localStorage.getItem('spotify_expires'))
  if (!token) return null
  if (Date.now() < expires - 60000) return token
  return refreshToken()
}

export function logout() {
  ;['spotify_token', 'spotify_refresh', 'spotify_expires'].forEach(k =>
    localStorage.removeItem(k)
  )
}
