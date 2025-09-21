type LimiterResult = {
  allowed: boolean
  remaining: number
  resetMs: number
  limit: number
}

type LimiterKeyParts = {
  prefix: string
  key: string
}

type LimiterOptions = {
  // max requests allowed per window
  limit: number
  // window size in seconds
  windowSec: number
}

// Minimal Redis interface we use
type RedisClient = {
  incr: (key: string) => Promise<number>
  expire: (key: string, seconds: number) => Promise<void>
  pttl?: (key: string) => Promise<number>
  get?: (key: string) => Promise<string | null>
}

let redisClient: RedisClient | null = null

function getEnv(name: string): string | undefined {
  try {
    // @ts-ignore - Next.js runtime provides process.env
    return process.env?.[name]
  } catch {
    return undefined
  }
}

async function initRedis(): Promise<RedisClient | null> {
  if (redisClient) return redisClient

  const url = getEnv('UPSTASH_REDIS_REST_URL')
  const token = getEnv('UPSTASH_REDIS_REST_TOKEN')
  if (!url || !token) return null

  // Lazy import to avoid bundling if not configured
  const { Redis } = await import('@upstash/redis')
  const client = new Redis({ url, token }) as any
  // Upstash has incr, expire, pttl, get
  redisClient = client
  return redisClient
}

// In-memory fallback (fixed window) – fine for dev or single instance
const memoryStore = new Map<string, { count: number; resetAt: number }>()

function memoryLimit(key: string, opts: LimiterOptions): LimiterResult {
  const now = Date.now()
  const windowMs = opts.windowSec * 1000
  const entry = memoryStore.get(key)
  if (!entry || now >= entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: opts.limit - 1, resetMs: windowMs, limit: opts.limit }
  }
  if (entry.count < opts.limit) {
    entry.count += 1
    const remaining = Math.max(0, opts.limit - entry.count)
    return { allowed: true, remaining, resetMs: entry.resetAt - now, limit: opts.limit }
  }
  return { allowed: false, remaining: 0, resetMs: entry.resetAt - now, limit: opts.limit }
}

export async function rateLimit(keyParts: LimiterKeyParts, opts: LimiterOptions): Promise<LimiterResult> {
  const key = `rl:${keyParts.prefix}:${keyParts.key}`
  const windowSec = opts.windowSec

  const redis = await initRedis()
  if (!redis) {
    return memoryLimit(key, opts)
  }

  // Fixed window using INCR + EXPIRE
  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, windowSec)
  }

  // Determine TTL remaining; Upstash supports pttl/get
  let pttl = 0
  try {
    pttl = (await redis.pttl?.(key)) ?? 0
  } catch {
    // ignore
  }

  const remaining = Math.max(0, opts.limit - count)
  const allowed = count <= opts.limit
  const resetMs = pttl > 0 ? pttl : windowSec * 1000
  return { allowed, remaining, resetMs, limit: opts.limit }
}

export function rateLimitHeaders(result: LimiterResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetMs / 1000)),
  }
}
