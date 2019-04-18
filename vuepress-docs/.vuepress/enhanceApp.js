import 'common/stylus/base.styl'
import VueQRCodeComponent from 'vue-qrcode-component'

export default ({Vue, options, router}) => {
  // redirect to /zh-CN/ by default
  router.addRoutes([{
    path: '/',
    redirect: '/zh-CN/'
  }])

  Vue.component('qr-code', VueQRCodeComponent)
}
