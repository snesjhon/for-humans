import { parseFilesFromPrompt, readChessAppFiles } from '@/lib/fullstack/checkWork'
import fs from 'fs'
import path from 'path'
import os from 'os'

describe('parseFilesFromPrompt', () => {
  it('returns empty array when no frontmatter', () => {
    const prompt = 'You are evaluating a learner...'
    expect(parseFilesFromPrompt(prompt)).toEqual([])
  })

  it('parses files from YAML frontmatter', () => {
    const prompt = `---
files:
  - app/models/player.rb
  - db/schema.rb
---
You are evaluating a learner...`
    expect(parseFilesFromPrompt(prompt)).toEqual([
      'app/models/player.rb',
      'db/schema.rb',
    ])
  })

  it('returns empty array when frontmatter has no files key', () => {
    const prompt = `---
title: something
---
You are evaluating...`
    expect(parseFilesFromPrompt(prompt)).toEqual([])
  })
})

describe('readChessAppFiles', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chess-test-'))
    fs.mkdirSync(path.join(tmpDir, 'app', 'models'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'app', 'models', 'player.rb'), 'class Player < ApplicationRecord\nend\n')
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true })
  })

  it('returns file contents indexed by relative path', () => {
    const result = readChessAppFiles(tmpDir, ['app/models/player.rb'])
    expect(result['app/models/player.rb']).toBe('class Player < ApplicationRecord\nend\n')
  })

  it('marks missing files with a placeholder', () => {
    const result = readChessAppFiles(tmpDir, ['db/schema.rb'])
    expect(result['db/schema.rb']).toBe('(file not found)')
  })
})
