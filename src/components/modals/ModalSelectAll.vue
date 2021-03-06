<template>
  <b-modal id="modal-select-all" size="lg" centered hide-footer>
    <template slot="modal-title">
      Select Token
    </template>
    <div class="modal-content">
      <b-row class="mx-0 mb-4">
        <b-col md="6" lg="4" class="d-flex align-items-center py-2">
          <b-input-group>
            <b-input-group-text slot="prepend">
              <font-awesome-icon
                :icon="['fas', searchState]"
                fixed-width
                :class="{ 'fa-blink': searchState === 'keyboard' }"
              />
            </b-input-group-text>
            <b-form-input
              v-model="tokenSearch"
              placeholder="Search Token"
            ></b-form-input>
          </b-input-group>
        </b-col>
        <b-col md="6" lg="4" class="d-flex align-items-center py-2">
          <span class="mr-2">Filter:</span>
          <b-dropdown size="sm" id="dropdown-1" :text="filter" class="m-md-2">
            <b-dropdown-item @click="setFilter('All')">All</b-dropdown-item>
            <b-dropdown-item @click="setFilter('Tokens')"
              >Tokens</b-dropdown-item
            >
            <b-dropdown-item @click="setFilter('Relays')"
              >Relays</b-dropdown-item
            >
          </b-dropdown>
        </b-col>
      </b-row>
      <b-row class="d-flex align-items-center mx-0 gutters-tiny">
        <b-col
          cols="6"
          md="6"
          lg="4"
          v-for="(token, index) in searchedTokens"
          :key="index"
          class="text-center mb-2"
          @click="setToken(token.symbol)"
        >
          <token-balance-block
            :symbol="token.symbol"
            :balance="token.balance"
            :img="token.img" />
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator'
import { vxm } from '@/store/'
import { TokenPrice } from '@/types/bancor'
import TokenBalanceBlock from '@/components/common/TokenBalanceBlock.vue'
const debounce = require('lodash.debounce')
import * as bancorx from '@/assets/_ts/bancorx'
import { TokenInfo } from '@/assets/_ts/bancorx'

@Component({
  components: { TokenBalanceBlock }
})
export default class ModalSelectAll extends Vue {
  // props

  // data
  private tokenSearch: String = ''
  private searchOptions = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 24,
    minMatchCharLength: 1,
    keys: ['symbol']
  }
  searchResults: any = []
  private searchState: string = 'search'
  public debouncedGetSearch: any
  filter: string = 'All'
  relayBalances: any[] = []

  // computed
  get relays() {
    if (this.filter === 'All') return bancorx.getTokenDb()
    else if (this.filter === 'Tokens') return bancorx.getTokenDb(true, false)
    else if (this.filter === 'Relays') return bancorx.getTokenDb(false, true)
    else return bancorx.getTokenDb()
  }
  get heroAction() {
    return vxm.general.heroAction
  }

  get direction() {
    return vxm.liquidity.direction
  }

  get tokenBalances() {
    return vxm.wallet.tokenBalances
    //return 1
  }

  get searchedTokens() {
    if (this.searchResults.length > 0) return this.searchResults
    else return this.relayBalances
  }

  // methods
  setToken(symbol: string) {
    const token = bancorx.getTokenInfo(symbol)
    if (token) {
      if (this.direction === 'from') vxm.liquidity.setFromToken(token)
      else vxm.liquidity.setToToken(token)
      this.$bvModal.hide('modal-select-all')
      this.tokenSearch = ''
    }
  }

  searchTokens() {
    // @ts-ignore
    this.$search(this.tokenSearch, this.relayBalances, this.searchOptions).then(
      (results: any) => {
        this.searchResults = results
        if (this.tokenSearch === '') this.searchState = 'search'
        else this.searchState = 'check'
      }
    )
  }

  setFilter(f: string) {
    this.filter = f
    this.mergeBalances()
  }

  async mergeBalances() {
    await vxm.tokens.getTokenDetails()
    let array: any[] = []
    for (const relay of this.relays) {
      const balance = this.tokenBalances.find((t: any) => {
        return t.symbol === relay.symbol
      })
      if (balance && balance.amount) {
        array.push({
          symbol: relay.symbol,
          name: '',
          img: relay.img,
          balance: balance.amount
        })
      } else {
        array.push({
          symbol: relay.symbol,
          name: '',
          img: relay.img,
          balance: '0'
        })
      }
    }
    this.relayBalances = array
  }

  @Watch('tokenSearch')
  async onSearchChange(val: any, oldVal: any) {
    if (val !== '') {
      this.searchState = 'keyboard'
      this.debouncedGetSearch()
    } else {
      this.searchTokens()
    }
  }

  @Watch('tokenBalances')
  async onBalanceChange(val: any, oldVal: any) {
    this.mergeBalances()
  }

  // Lifecycle hooks
  mounted() {
    this.mergeBalances()
  }
  async created() {
    // await vxm.tokens.getTokenDetails()
    this.mergeBalances()
    this.debouncedGetSearch = debounce(() => {
      this.searchTokens()
    }, 500)
  }
  updated() {}
  destroyed() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.modal-content {
  min-height: 49vh;
  height: 50vh;
  max-height: 51vh;
  overflow: scroll;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

@keyframes fa-blink {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.25;
  }
  50% {
    opacity: 0.5;
  }
  75% {
    opacity: 0.75;
  }
  100% {
    opacity: 0;
  }
}
.fa-blink {
  -webkit-animation: fa-blink 0.55s linear infinite;
  -moz-animation: fa-blink 0.55s linear infinite;
  -ms-animation: fa-blink 0.55s linear infinite;
  -o-animation: fa-blink 0.55s linear infinite;
  animation: fa-blink 0.55s linear infinite;
}
</style>
