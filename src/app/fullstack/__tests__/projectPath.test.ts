import { getProjectPath, setProjectPath, clearProjectPath } from '@/lib/fullstack/projectPath'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock })
Object.defineProperty(global, 'window', { value: global })

describe('projectPath', () => {
  beforeEach(() => localStorage.clear())

  it('returns null when nothing is stored', () => {
    expect(getProjectPath()).toBeNull()
  })

  it('stores and retrieves a path', () => {
    setProjectPath('/Users/me/chess-learning')
    expect(getProjectPath()).toBe('/Users/me/chess-learning')
  })

  it('clears the stored path', () => {
    setProjectPath('/Users/me/chess-learning')
    clearProjectPath()
    expect(getProjectPath()).toBeNull()
  })
})
