import RequestApi from '@/api/RequestApi'
import json from './dummyResponse.json'

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
  async getTokensDummy() {
    const delayInMilliseconds = 1500 //1 second

    return new Promise(resolve => {
      setTimeout(function() {
        resolve(json)
      }, delayInMilliseconds)
    })
  }
}

export default TokenApi
