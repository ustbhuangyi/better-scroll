import Vue from 'vue'
import Router from 'vue-router'
import Zoom from 'example/vue/pages/zoom'
import Slide from 'example/vue/pages/slide/index'
import NormalSlide from 'example/vue/pages/slide/normal'

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
          path: 'normal',
          component: NormalSlide
        }
      ]
    }
  ]
})
