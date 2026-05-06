export const WRAP_TOKEN = '[[WRAP_SUGGESTED]]'

export function stripWrapToken(buffer: string): {
  display: string
  wrapDetected: boolean
} {
  const idx = buffer.indexOf(WRAP_TOKEN)
  if (idx === -1) return { display: buffer, wrapDetected: false }
  const display = buffer.slice(0, idx).trimEnd()
  return { display, wrapDetected: true }
}
