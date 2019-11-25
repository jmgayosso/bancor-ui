export interface TokenPrice {
  id: string
  code: string
  name: string
  primaryCommunityId: string
  primaryCommunityImageName: string
  liquidityDepth: number
  price: number
  change24h: number
  volume24h: Volume24h
  priceHistory: PriceHistory[]
}
export interface Volume24h {
  ETH: number
  USD: number
  EUR: number
}

export interface PriceHistory {
  [index: number]: number
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
