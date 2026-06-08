# spaceYours 🌸

Un espacio web personal, cálido y relajante para desestresarse antes de los exámenes.

## Setup

```bash
npm install
cp .env.example .env
# Edita .env y agrega tu API key de Anthropic
npm run dev
```

## Variables de entorno

```
VITE_ANTHROPIC_API_KEY=sk-ant-...  # Requerida para el chat con Luna
```

Obtén tu API key en: https://console.anthropic.com/

## Funcionalidades

- 🫧 **Jugar y respirar** — 6 mini-juegos relajantes
- 📓 **Mi diario** — Bloc de notas con autoguardado en localStorage
- 🧠 **Repasar con Luna** — Chat IA con Claude Haiku (streaming)
- 🎵 **Spotify Widget** — Música de fondo persistente
