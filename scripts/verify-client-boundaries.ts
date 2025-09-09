/**
 * Scans .tsx files for event handler usage (onClick, onChange, etc.) inside files
 * that are NOT marked as client components (missing 'use client' directive).
 * This helps prevent the Next.js error: "Event handlers cannot be passed to Client Component props.".
 */
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const TARGET_DIRS = ['app', 'components']
const EVENT_HANDLER_REGEX = /\son(?:Click|Change|Submit|KeyDown|KeyUp|MouseEnter|MouseLeave|Focus|Blur)=\{/g

type Violation = { file: string; handlers: number }

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (full.endsWith('.tsx')) files.push(full)
  }
  return files
}

const violations: Violation[] = []

for (const base of TARGET_DIRS) {
  const dir = join(ROOT, base)
  try {
    const files = walk(dir)
    for (const file of files) {
      const src = readFileSync(file, 'utf8')
      // Skip client components
      if (/^"use client"|^'use client'/m.test(src)) continue
      // Skip special Next.js files that must remain server and shouldn't hold handlers
      if (/app\\layout\.tsx$/.test(file) || /app\\.*route\.tsx$/.test(file)) {}
      const matches = src.match(EVENT_HANDLER_REGEX)
      if (matches && matches.length) {
        violations.push({ file: file.replace(ROOT + '\\', ''), handlers: matches.length })
      }
    }
  } catch { /* ignore missing directories */ }
}

if (violations.length) {
  console.error('\nClient Boundary Violations Found:')
  for (const v of violations) {
    console.error(` - ${v.file} (${v.handlers} handler reference(s)) is missing 'use client' directive.`)
  }
  console.error('\nFix: Add \"use client\" at the top OR move interactive logic into a dedicated client component.')
  process.exit(1)
}

console.log('✅ Client boundary check passed (no server components with event handlers).')
