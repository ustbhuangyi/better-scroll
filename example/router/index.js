import Vue from 'vue'
import Router from 'vue-router'
import Picker from 'example/pages/picker'
import Slide from 'example/pages/slide'
import VerticalScroll from 'example/pages/vertical-scroll/'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/picker',
      component: Picker
    },
    {
      path: '/slide',
      component: Slide
    },
    {
      path: '/vertical-scroll',
      component: VerticalScroll
    }
  ]
})
