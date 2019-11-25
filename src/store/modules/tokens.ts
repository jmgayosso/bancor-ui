import {
  VuexModule,
  mutation,
  action,
  getter,
  Module
} from 'vuex-class-component'
import { TokenPrice, TokenInfo } from '@/types/bancor'
import apiBancor from '@/api/bancor'
import { vxm } from '@/store'
import * as bancorx from '@/assets/_ts/bancorx'
import TokenApi from '@/api/TokenApi'

@Module({ namespacedPath: 'tokens/' })
export class TokensModule extends VuexModule {
  @getter eosTokens: TokenPrice[] = []
  @getter ethTokens: TokenPrice[] = []
  @getter loadingTokens: boolean = false
  @getter ethPrice: any
  @getter tokensDetail: TokenInfo[] = []

  get tokenDb() {
    let db = []
    for (const t of this.eosTokens) {
      db.push({
        symbol: t.code,
        tokenPrice: t,
        relay: bancorx.relays[t.code],
        reserve: bancorx.reserveTokens[t.code]
      })
    }
    return db
  }

  get TokensDetails() {
    let tDetails: TokenInfo[] = this.tokensDetail
    return tDetails
  }

  @action async getEthPrice() {
    let params = {
      toCurrencyCode: 'ETH',
      fromCurrencyCode: 'USD'
    }
    let eth: any
    try {
      eth = await apiBancor('currencies/rate', params)
    } catch (e) {
      console.log(e)
    }
    this.setEth(eth)
  }

  // actions
  @action async getTokens() {
    let params = {
      limit: 150,
      skip: 0,
      fromCurrencyCode: 'USD',
      includeTotal: true,
      orderBy: 'volume24h',
      sortOrder: 'desc',
      blockchainType: ''
    }
    const endpoint = 'currencies/tokens'
    let eos: any
    let eth: any
    params.blockchainType = 'eos'
    try {
      eos = await apiBancor(endpoint, params)
    } catch (e) {
      console.log(e)
    }
    // params.blockchainType = 'ethereum'
    // try {
    //   eth = await apiBancor(endpoint, params)
    // } catch (e) {
    //   console.log(e)
    // }
    const Api = new TokenApi()
    const r = await Api.getTableDummy()

    return r.tokens
    return eos.data.data.page

  }

  @action async getTokenDetails() {
    const Api = new TokenApi()
    // let response: TokenInfo[]= []
    // Api.getTokensDummy().then(function(r:TokenInfo[]) {
    //   response = r
    //   console.log('Responsed',response)
    //   mt = r
    //   return response
    // })
    let tokenDetails: TokenInfo[] = []
    try {
      tokenDetails = await Api.getTokensDummy()
    } finally {
      this.setTokensDetail(tokenDetails)
    }
  }

  // mutations
  @mutation setTokens(t: { eos: TokenPrice[]; eth: TokenPrice[] }) {
    this.eosTokens = t.eos
    this.ethTokens = t.eth
  }
  @mutation setLoadingTokens(b: boolean) {
    this.loadingTokens = b
  }
  @mutation setEth(eth: any) {
    this.ethPrice = eth.data.data
  }
  @mutation setTokensDetail(tokensDetail: TokenInfo[]) {
    this.tokensDetail = tokensDetail
  }
}
export const tokens = TokensModule.ExtractVuexModule(TokensModule)
