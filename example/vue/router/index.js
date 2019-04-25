import Vue from 'vue'
import Router from 'vue-router'

import Core from 'example/vue/pages/core-entry'
import Zoom from 'example/vue/pages/zoom-entry'
import Slide from 'example/vue/pages/slide-entry'

import BannerSlide from 'example/vue/components/slide/banner'
import PageSlide from 'example/vue/components/slide/fullpage'
import VerticalSlide from 'example/vue/components/slide/vertical'
import PcSlide from 'example/vue/components/slide/pc'
import MouseWheelCore from 'example/vue/components/core/mouse-wheel'

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
