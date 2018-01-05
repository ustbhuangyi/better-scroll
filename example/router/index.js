import Vue from 'vue'
import Router from 'vue-router'
import Features from 'example/pages/features'
import Examples from 'example/pages/examples'
import VerticalScroll from 'example/pages/vertical-scroll/'
import IndexView from 'example/pages/index-list/'
import Picker from 'example/pages/picker'
import Slide from 'example/pages/slide'
import FullPageSlide from 'example/pages/full-page-slide'
import FullPageVerticalSlide from 'example/pages/full-page-vertical-slide'
import FreeScroll from 'example/pages/free-scroll'
import FormList from 'example/pages/form-list'
import GoodsList from 'example/pages/goods-list'
import NavigatorList from 'example/pages/navigator'
import SlideRender from 'example/page-render/slide-render'
import FormListRender from 'example/page-render/form-list-render'
import SimpleScrollDemo from 'example/pages/simple-scroll-demo'
import GoodListRender from 'example/page-render/goods-list-render'
import PickerRender from 'example/page-render/picker-render'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Features
    },
    {
      path: '/:lang',
      component: Features
    },
    {
      path: '/examples/:lang',
      component: Examples
    },
    {
      path: '/examples',
      component: Examples,
      children: [
        {
          path: 'vertical-scroll/:lang',
          component: VerticalScroll
        },
        {
          path: 'index-view/:lang',
          component: IndexView
        },
        {
          path: 'picker/:lang',
          component: Picker
        },
        {
          path: 'slide/:lang',
          component: Slide
        },
        {
          path: 'full-page-slide/:lang',
          component: FullPageSlide
        },
        {
          path: 'full-page-vertical-slide/:lang',
          component: FullPageVerticalSlide
        },
        {
          path: 'free-scroll/:lang',
          component: FreeScroll
        },
        {
          path: 'form-list/:lang',
          component: FormList
        },
        {
          path: 'goods-list/:lang',
          component: GoodsList
        },
        {
          path: 'nav-list',
          component: NavigatorList,
          children: [
            {
              path: '1/:lang',
              component: SlideRender
            },
            {
              path: '2/:lang',
              component: FormListRender
            },
            {
              path: '3/:lang',
              component: SimpleScrollDemo
            },
            {
              path: '4/:lang',
              component: GoodListRender
            },
            {
              path: '5/:lang',
              component: PickerRender
            }
          ]
        }
      ]
    }
  ]
})
