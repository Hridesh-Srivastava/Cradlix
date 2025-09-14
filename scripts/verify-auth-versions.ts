import { readFileSync } from 'fs'
import { join } from 'path'

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'))

// Allow compatible ranges; project currently uses next-auth v4 and any @auth/core.
const REQUIREMENTS: Record<string, (v: string | undefined) => boolean> = {
  'next-auth': (v) => !!v && /^\^?4\./.test(v),
  '@auth/drizzle-adapter': (v) => !!v, // any recent 1.x is ok
  '@auth/core': () => true, // optional/any
}

let ok = true
for (const dep of Object.keys(REQUIREMENTS)) {
  const actual = pkg.dependencies?.[dep]
  const pass = REQUIREMENTS[dep](actual)
  if (!pass) {
    console.error(`Auth dependency check failed: ${dep} has ${actual}`)
    ok = false
  }
}
if (!ok) process.exit(1)
console.log('Auth dependency versions look compatible (v4).')
