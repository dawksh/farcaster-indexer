const PINATA_GATEWAY = process.env.PINATA_GATEWAY || 'hub.pinata.cloud'
const PINATA_JWT = process.env.PINATA_JWT

export class PinataClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor() {
    this.baseUrl = `https://${PINATA_GATEWAY}`
    this.headers = {
      'Authorization': `Bearer ${PINATA_JWT}`,
      'Content-Type': 'application/json'
    }
  }

  async getCastsByParent(parentUrl: string, pageToken?: string) {
    const url = new URL('/v1/castsByParent', this.baseUrl)
    url.searchParams.set('parentUrl', parentUrl)
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken)
    }

    const response = await fetch(url.toString(), {
      headers: this.headers
    })

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.status}`)
    }

    return await response.json()
  }

  async getUserMetadata(fid: string) {
    const url = new URL(`/v1/userDataByFid/${fid}`, this.baseUrl)
    
    const response = await fetch(url.toString(), {
      headers: this.headers
    })

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.status}`)
    }

    return await response.json()
  }

  async getRecentCasts(pageToken?: string) {
    const url = new URL('/v1/casts', this.baseUrl)
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken)
    }

    const response = await fetch(url.toString(), {
      headers: this.headers
    })

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.status}`)
    }

    return await response.json()
  }
} 