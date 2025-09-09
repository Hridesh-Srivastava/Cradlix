import { readFileSync } from 'fs'
import { join } from 'path'

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'))

const EXPECTED = {
  '@auth/core': '0.34.2',
  'next-auth': '4.24.11',
  '@auth/drizzle-adapter': '1.5.0'
}

let ok = true
for (const [dep, ver] of Object.entries(EXPECTED)) {
  const actual = pkg.dependencies?.[dep]
  if (actual !== ver) {
    console.error(`Version mismatch: ${dep} expected ${ver} but found ${actual}`)
    ok = false
  }
}
if (!ok) {
  process.exit(1)
}
console.log('Auth dependency versions verified.')
