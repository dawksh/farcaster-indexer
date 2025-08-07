import { PinataClient } from './pinataClient'
import { CastProcessor } from './processor'

export class CastPoller {
  private pinataClient: PinataClient
  private processor: CastProcessor
  private pollInterval: number
  private isRunning: boolean = false
  private lastPageToken?: string

  constructor() {
    this.pinataClient = new PinataClient()
    this.processor = new CastProcessor()
    this.pollInterval = parseInt(process.env.POLL_INTERVAL_MS || '5000')
  }

  async start() {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('Starting cast poller...')
    
    while (this.isRunning) {
      try {
        await this.poll()
        await this.sleep(this.pollInterval)
      } catch (error) {
        console.error('Polling error:', error)
        await this.sleep(1000)
      }
    }
  }

  stop() {
    this.isRunning = false
    console.log('Stopping cast poller...')
  }

  private async poll() {
    const response = await this.pinataClient.getRecentCasts(this.lastPageToken)
    
    if (response.casts && response.casts.length > 0) {
      await this.processor.processCasts(response.casts)
      this.lastPageToken = response.nextPageToken
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
} 