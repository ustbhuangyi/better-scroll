import Vue from 'vue'
import Router from 'vue-router'
import Zoom from 'example/vue/pages/zoom'
import Slide from 'example/vue/pages/slide/index'
import bannerSlide from 'example/vue/pages/slide/banner'
import PageSlide from 'example/vue/pages/slide/fullpage'
import VerticalSlide from 'example/vue/pages/slide/vertical'

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
          component: bannerSlide
        },
        {
          path: 'fullpage',
          component: PageSlide
        },
        {
          path: 'vertical',
          component: VerticalSlide
        }
      ]
    }
  ]
})
