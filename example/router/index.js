import Vue from 'vue'
import Router from 'vue-router'
import VerticalScroll from 'example/pages/vertical-scroll/'
import IndexView from 'example/pages/index-list/'
import Picker from 'example/pages/picker'
import Slide from 'example/pages/slide'
import FullPageSlide from 'example/pages/full-page-slide'
import FreeScroll from 'example/pages/free-scroll'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/vertical-scroll',
      component: VerticalScroll
    },
    {
      path: '/index-view',
      component: IndexView
    },
    {
      path: '/picker',
      component: Picker
    },
    {
      path: '/slide',
      component: Slide
    },
    {
      path: '/full-page-slide',
      component: FullPageSlide
    },
    {
      path: '/free-scroll',
      component: FreeScroll
    }
  ]
})
