import Vue from 'vue'
import Router from 'vue-router'
import Zoom from 'example/vue/pages/zoom'
import Slide from 'example/vue/pages/slide/index'
import BannerSlide from 'example/vue/pages/slide/banner'
import PageSlide from 'example/vue/pages/slide/fullpage'
import VerticalSlide from 'example/vue/pages/slide/vertical'
import PcSlide from 'example/vue/pages/slide/pc'
import Core from 'example/vue/pages/core/index'
import MouseWheelCore from 'example/vue/pages/core/mouse-wheel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/zoom',
      component: Zoom
    },
    {
      path: '/slide',
      component: Slide,
      children: [
        {
          path: 'banner',
          component: BannerSlide
        },
        {
          path: 'fullpage',
          component: PageSlide
        },
        {
          path: 'vertical',
          component: VerticalSlide
        },
        {
          path: 'pc',
          component: PcSlide
        }
      ]
    },
    {
      path: '/core',
      component: Core,
      children: [
        {
          path: 'mouse-wheel',
          component: MouseWheelCore
        }
      ]
    }
  ]
})
