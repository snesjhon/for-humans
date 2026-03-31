const PROJECT_PATH_KEY = 'fdh_chess_app_path'

export function getProjectPath(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(PROJECT_PATH_KEY)
}

export function setProjectPath(path: string): void {
  localStorage.setItem(PROJECT_PATH_KEY, path)
}

export function clearProjectPath(): void {
  localStorage.removeItem(PROJECT_PATH_KEY)
}
