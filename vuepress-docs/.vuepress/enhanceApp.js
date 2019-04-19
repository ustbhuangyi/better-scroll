import 'common/stylus/base.styl'
import './public/assets/stylus/index.styl'
import VueQRCodeComponent from 'vue-qrcode-component'
import VTooltip from 'v-tooltip'

export default ({Vue, options, router}) => {
  // redirect to /zh-CN/ by default
  router.addRoutes([{
    path: '/',
    redirect: '/zh-CN/'
  }])

  // TODO Unified management of global components
  Vue.use(VTooltip)
  Vue.component('qr-code', VueQRCodeComponent)
}
