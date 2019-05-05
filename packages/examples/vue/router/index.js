import Vue from 'vue'
import Router from 'vue-router'

import Core from 'vue-example/pages/core-entry'
import Zoom from 'vue-example/pages/zoom-entry'
import Slide from 'vue-example/pages/slide-entry'
import Picker from 'vue-example/pages/picker-entry'

import BannerSlide from 'vue-example/components/slide/banner'
import PageSlide from 'vue-example/components/slide/fullpage'
import VerticalSlide from 'vue-example/components/slide/vertical'
import PcSlide from 'vue-example/components/slide/pc'
import MouseWheelCore from 'vue-example/components/core/mouse-wheel'
import oneColumnPicker from 'vue-example/components/picker/one-column'
import doubleColumnPicker from 'vue-example/components/picker/double-column'
import linkageColumnPicker from 'vue-example/components/picker/linkage-column'

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
    },
    {
      path: '/picker',
      component: Picker,
      children: [
        {
          path: 'one-column',
          component: oneColumnPicker
        },
        {
          path: 'double-column',
          component: doubleColumnPicker
        },
        {
          path: 'linkage-column',
          component: linkageColumnPicker
        }
      ]
    }
  ]
})
