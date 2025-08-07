import { getCachedCast, setCachedCast } from './cache'
import { upsertCast } from './db'

export class CastProcessor {
  async processCast(cast: any) {
    const fid = cast.data.fid.toString()
    
    const cached = await getCachedCast(fid)
    if (cached && cached.timestamp === cast.data.timestamp) {
      return { processed: false, reason: 'already cached' }
    }

    try {
      await upsertCast(
        BigInt(cast.data.fid),
        new Date(cast.data.timestamp),
        cast.data
      )

      await setCachedCast(fid, {
        timestamp: cast.data.timestamp,
        body: cast.data
      })

      return { processed: true, cast }
    } catch (error) {
      console.error('Error processing cast:', error)
      return { processed: false, reason: 'processing error', error }
    }
  }

  async processCasts(casts: any[]) {
    const results = []
    
    for (const cast of casts) {
      const result = await this.processCast(cast)
      results.push(result)
    }

    const processed = results.filter(r => r.processed).length
    const skipped = results.length - processed

    console.log(`Processed ${processed} casts, skipped ${skipped}`)
    return results
  }
} 