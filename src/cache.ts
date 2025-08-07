import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL
})

client.on('error', (err) => console.error('Redis Client Error', err))

await client.connect()

export const getCachedCast = async (fid: string) => {
  try {
    const cached = await client.get(`cast:${fid}`)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export const setCachedCast = async (fid: string, data: any) => {
  try {
    await client.setEx(`cast:${fid}`, 3600, JSON.stringify(data))
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export const invalidateCache = async (fid: string) => {
  try {
    await client.del(`cast:${fid}`)
  } catch (error) {
    console.error('Cache invalidation error:', error)
  }
} 