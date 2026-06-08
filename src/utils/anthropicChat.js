const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `Eres una tutora amable, paciente y motivadora llamada "Luna".
Ayudas a una estudiante a repasar temas de examen de forma clara y sencilla.
Explicas con ejemplos simples, usas emojis ocasionalmente, y siempre terminas con una frase de aliento.
Respondes en español. Si la estudiante parece estresada, primero validas sus sentimientos antes de continuar con el contenido.`

export async function sendMessageToLuna(messages, onChunk) {
  if (!API_KEY) {
    throw new Error('No se encontró la API key de Anthropic. Crea un archivo .env con VITE_ANTHROPIC_API_KEY.')
  }

  const formattedMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role, content: m.content }))

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      stream: true,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Error de API: ${response.status} — ${err}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter((l) => l.trim())

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6)
      if (data === '[DONE]') continue

      try {
        const parsed = JSON.parse(data)
        if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
          const text = parsed.delta.text
          fullText += text
          onChunk?.(text, fullText)
        }
      } catch (_) {}
    }
  }

  return fullText
}
