<template>
  <div>
    <b-row>
      <b-col md="4">
        <transition name="slide-fade-down" mode="out-in">
          <hero-convert-relay v-if="ltr" key="ltr" direction="from" />
          <hero-convert-relay v-else key="rtl" direction="from" />
        </transition>
      </b-col>
      <b-col
        md="4"
        class="d-flex justify-content-center align-items-end"
        style="min-height: 230px"
      >
        <div>
          <transition name="fade" mode="out-in">
            <font-awesome-icon
              v-if="ltr"
              icon="exchange-alt"
              class="fa-2x text-white cursor"
              key="ltr"
              @click="swapTokens()"
            />
            <font-awesome-icon
              v-else
              icon="exchange-alt"
              class="fa-2x text-white cursor"
              key="rtl"
              @click="swapTokens()"
            />
          </transition>
          <div class="mb-3 mt-3">
            <span class="text-white font-size-sm"
              >1 {{ tokenFrom.symbol }} =
              <span v-if="!rateLoading && !loadingTokens">{{ rate }}</span
              ><span v-else><font-awesome-icon icon="circle-notch" spin/></span>
              {{ tokenTo.symbol }}</span
            >
          </div>
          <div class="d-flex justify-content-center">
            <b-btn
              @click="initConvert()"
              variant="success"
              v-ripple
              class="px-4 py-2 d-block"
              :disabled="loadingTokens || minReturn === ''"
            >
              <font-awesome-icon
                v-if="loadingTokens"
                icon="circle-notch"
                spin
                fixed-width
                class="mr-2"
              />
              <font-awesome-icon
                v-else
                icon="sync-alt"
                fixed-width
                class="mr-2"
              />
              <span class="font-w700">CONVERT</span>
            </b-btn>
          </div>
          <span
            v-if="this.currentRoute !== 'Relays'"
            @click="heroAction = 'transfer'"
            class="cursor font-size-sm text-white-50"
          >
            <font-awesome-icon icon="long-arrow-alt-right" fixed-width />
            TRANSFER
          </span>
          <span
            v-else
            @click="heroAction = 'liq-add'"
            class="cursor font-size-sm text-white-50"
          >
            <font-awesome-icon icon="long-arrow-alt-right" fixed-width />
            DUAL Liquidity
          </span>
        </div>
      </b-col>
      <b-col md="4">
        <transition name="slide-fade-up" mode="out-in">
          <hero-convert-relay v-if="!ltr" key="rtl" direction="to" />
          <hero-convert-relay v-else key="ltr" direction="to" />
        </transition>
      </b-col>
    </b-row>
    <modal-select-all />
    <modal-select-token />
    <modal-select-relays />
    <modal-convert-liquidity />
  </div>
</template>

<script lang="ts">
import { Watch, Component, Vue } from 'vue-property-decorator'
import { vxm } from '@/store'
import HeroConvertRelay from '@/components/convert/HeroConvertRelay.vue'
import * as bancorx from '@/assets/_ts/bancorx'
import numeral from 'numeral'
import ModalSelectAll from '@/components/modals/ModalSelectAll.vue'
import ModalConvertLiquidity from '@/components/modals/ModalConvertLiquidity.vue'
import ModalSelectToken from '@/components/modals/ModalSelectToken.vue'
import ModalSelectRelays from '@/components/modals/ModalSelectRelays.vue'

@Component({
  components: {
    ModalSelectRelays,
    ModalSelectAll,
    ModalSelectToken,
    ModalConvertLiquidity,
    HeroConvertRelay
  }
})
export default class HeroConvert extends Vue {
  // data
  ltr = true
  rate = ''
  rateLoading = false
  numeral = numeral

  // computed
  get isAuthenticated() {
    if (vxm.eosTransit.walletState)
      return vxm.eosTransit.walletState.authenticated
    else return false
  }

  get heroAction() {
    return vxm.general.heroAction
  }

  get currentRoute() {
    return this.$route.name
  }

  set heroAction(val) {
    vxm.general.setHeroAction(val)
  }

  get debouncedState() {
    return vxm.convert.debouncedState
  }

  get tokenFrom() {
    return vxm.liquidity.fromToken
  }

  get tokenTo() {
    return vxm.liquidity.toToken
  }

  get amount() {
    return vxm.liquidity.amount
  }

  get minReturn() {
    return vxm.liquidity.minReturn
  }

  get tokens() {
    return vxm.tokens.eosTokens
  }

  get loadingTokens() {
    return vxm.liquidity.rateLoading
  }

  async conversionRate() {
    this.rateLoading = true
    let amount = this.amount
    console.log('rate converting', amount)
    if (amount === '') {
      amount = '1'
      console.log('fromToken', vxm.liquidity.fromToken.symbol)
      console.log('toToken', vxm.liquidity.toToken.symbol)
      console.log('MinReturn', 'Calculating')
      const minReturn = await bancorx.calcRate(
        vxm.liquidity.fromToken.symbol,
        vxm.liquidity.toToken.symbol,
        amount
      )
      console.log('MinReturn', minReturn)
      this.rate = this.numeral(
        parseFloat(minReturn) / parseFloat(amount)
      ).format('0.0000')
    } else {
      console.log('MinReturn Second', this.minReturn)
      this.rate = this.numeral(
        parseFloat(this.minReturn) / parseFloat(amount)
      ).format('0.0000')
    }
    console.log('RATE', this.rate)
    this.rateLoading = false
  }

  // methods
  swapTokens() {
    this.ltr = !this.ltr
    vxm.liquidity.swapSelection()
    vxm.liquidity.calcMinReturn()
  }

  initConvert() {
    if (!this.isAuthenticated) this.$bvModal.show('modal-login')
    else {
      vxm.convert.initConversion('from')
      this.$bvModal.show('modal-convert-token')
    }
  }

  @Watch('minReturn')
  async onStateChange(val: any, oldVal: any) {
    await this.conversionRate()
  }

  @Watch('tokenFrom')
  async onTokenChange(val: any, oldVal: any) {
    await this.conversionRate()
  }
  async created() {
    // await this.conversionRate()
  }
  async mounted() {
    await vxm.tokens.getTokenDetails()
    vxm.liquidity.setFromToken(bancorx.getTokensDetailByIndex(0))
    vxm.liquidity.setToToken(bancorx.getTokensDetailByIndex(1))
  }
}
</script>

<style scoped lang="scss">
.slide-fade-up-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-up-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-up-enter
    /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(75px);
  opacity: 0;
}
.slide-fade-up-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-75px);
  opacity: 0;
}

.slide-fade-down-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-down-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-down-enter
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-75px);
  opacity: 0;
}
.slide-fade-down-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(75px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
