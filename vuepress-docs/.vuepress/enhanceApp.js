import 'common/stylus/base.styl'
import './public/assets/stylus/index.styl'
import VTooltip from 'v-tooltip'

export default ({Vue, options, router}) => {
  // redirect to /zh-CN/ by default
  router.addRoutes([{
    path: '/',
    redirect: '/zh-CN/'
  }])

  // TODO Unified management of global components
  Vue.use(VTooltip)
}
