export const motivationalPhrases = [
  "El esfuerzo de hoy es el éxito de mañana. Confía en ti. 🌸",
  "No tienes que ser perfecta para ser increíble. Ya lo eres. ✨",
  "Cada palabra que escribes es un paso hacia donde quieres estar.",
  "Respira. Lo que sientes es válido. Lo que piensas importa. 💜",
  "Eres más fuerte de lo que crees y más valiente de lo que sientes.",
  "El descanso también es parte del camino. Date ese espacio. 🌙",
  "No compares tu capítulo 1 con el capítulo 20 de alguien más.",
  "Tus notas no definen tu valor. Tú eres infinitamente más. 🌺",
  "Un pequeño paso hoy es un gran avance mañana. Sigue. 🚀",
  "Eres exactamente donde necesitas estar en este momento.",
  "La calma no llega sola — la construyes, poco a poco. 🌊",
  "Incluso los días difíciles terminan. Mañana puede ser diferente.",
  "Mereces descanso tanto como mereces éxito. Los dos van juntos.",
  "Escribir lo que sientes ya es sanar. Sigue escribiendo. 📖",
  "Tú puedes con esto. Y si no puedes sola, pide ayuda — eso también es valiente. 💪",
]

export function getRandomPhrase() {
  return motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]
}
