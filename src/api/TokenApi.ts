import RequestApi from '@/api/RequestApi'
import json from './dummyResponse.json'
import { tokenDb_ } from '@/api/TokensDummy'
class TokenApi {
  constructor() {
    console.log('Token Api created')
  }

  testRequest(params: any) {
    return RequestApi('users', params)
  }

  /**
   * Get tokens detail
   */
  getDetails() {
    return RequestApi('tokens/details', {})
  }

  /**
   * Get all tokens summary
   * @param {offset, limit, orderBy, sortOrder}
   */
  getTradeSummary(params: any) {
    return RequestApi('tokens/trade-summary', params)
  }

  /**
   * Calculate Rete between tokens
   * @param {fromTokenId, toTokenId, amount }
   */
  calculateRate(params: any) {
    return RequestApi('tokens/calculate-rate', params)
  }

  /**
   * Get dymmy Tokens
   */
   getTokensDummy(): Promise<TokenInfo[]> {
    const delayInMilliseconds = 1 //1 second

    return new Promise(resolve => {
      setTimeout(function() {
        console.log(tokenDb_)
        resolve(tokenDb_)
      }, delayInMilliseconds)
    })    
  }
}

export interface TokenInfo {
    relayToken: boolean
    id: string
    name: string
    img: string
    tokenContract: string
    relayContract: string
    symbol: string
    counterSymbol: string
    precision: number
}

export default TokenApi
