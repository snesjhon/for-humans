export const WRAP_TOKEN = '[[WRAP_SUGGESTED]]'

/**
 * Given an accumulated streaming buffer, checks if it contains the wrap token.
 * Returns the display text (token stripped) and whether the token was found.
 *
 * Safe to call on every chunk — only strips when the full token is present.
 */
export function stripWrapToken(buffer: string): {
  display: string
  wrapDetected: boolean
} {
  const idx = buffer.indexOf(WRAP_TOKEN)
  if (idx === -1) return { display: buffer, wrapDetected: false }
  const display = buffer.slice(0, idx).trimEnd()
  return { display, wrapDetected: true }
}
