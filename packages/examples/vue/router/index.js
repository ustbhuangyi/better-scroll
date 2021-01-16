import Vue from 'vue'
import Router from 'vue-router'

import CoreEntry from 'vue-example/pages/core-entry'
import ObserveDOMEntry from 'vue-example/pages/observe-dom-entry'
import ZoomEntry from 'vue-example/pages/zoom-entry'
import SlideEntry from 'vue-example/pages/slide-entry'
import PickerEntry from 'vue-example/pages/picker-entry'
import PullupEntry from 'vue-example/pages/pullup-entry'
import PullDownEntry from 'vue-example/pages/pulldown-entry'
import ScrollBarEntry from 'vue-example/pages/scrollbar-entry'
import InfinityScrollEntry from 'vue-example/pages/infinity-entry'
import FormEntry from 'vue-example/pages/form-entry'
import NestedScrollEntry from 'vue-example/pages/nested-scroll-entry'
import MovableEntry from 'vue-example/pages/movable-entry'
import MouseWheelEntry from 'vue-example/pages/mouse-wheel-entry'
import ComposeEntry from 'vue-example/pages/compose-entry'
import ObserveImageEntry from 'vue-example/pages/observe-image-entry'

import ScrollbarVertical from 'vue-example/components/scrollbar/vertical'
import ScrollbarHorizontal from 'vue-example/components/scrollbar/horizontal'
import ScrollbarCustom from 'vue-example/components/scrollbar/custom'

import MouseWheelVerticalScroll from 'vue-example/components/mouse-wheel/vertical-scroll'
import MouseWheelHorizontalScroll from 'vue-example/components/mouse-wheel/horizontal-scroll'
import MouseWheelVerticalSlide from 'vue-example/components/mouse-wheel/vertical-slide'
import MouseWheelHorizontalSlide from 'vue-example/components/mouse-wheel/horizontal-slide'
import MouseWheelPullUp from 'vue-example/components/mouse-wheel/pullup'
import MouseWheelPullDown from 'vue-example/components/mouse-wheel/pulldown'
import MouseWheelPicker from 'vue-example/components/mouse-wheel/picker'

import BannerSlide from 'vue-example/components/slide/banner'
import PageSlide from 'vue-example/components/slide/fullpage'
import VerticalSlide from 'vue-example/components/slide/vertical'
import DynamicSlide from 'vue-example/components/slide/dynamic'

import VerticalScroll from 'vue-example/components/core/default'
import HorizontalScroll from 'vue-example/components/core/horizontal'
import DynamicContentScroll from 'vue-example/components/core/dynamic-content'
import SpecifiedContentScroll from 'vue-example/components/core/specified-content'
import Freescroll from 'vue-example/components/core/freescroll'

import OneColumnPicker from 'vue-example/components/picker/one-column'
import DoubleColumnPicker from 'vue-example/components/picker/double-column'
import LinkageColumnPicker from 'vue-example/components/picker/linkage-column'

import FormTextarea from 'vue-example/components/form/textarea'

import NestedVerticalScroll from 'vue-example/components/nested-scroll/vertical'
import NestedTripleVerticalScroll from 'vue-example/components/nested-scroll/triple-vertical'
import NestedHorizontalScroll from 'vue-example/components/nested-scroll/horizontal'
import NestedHorizontalInVertical from 'vue-example/components/nested-scroll/horizontal-in-vertical'

import Movable from 'vue-example/components/movable/default'
import MovableMultiContent from 'vue-example/components/movable/multi-content'
import MovableScale from 'vue-example/components/movable/scale'
import MovableMultiContentScale from 'vue-example/components/movable/multi-content-scale'

import ComposePullUpPullDown from 'vue-example/components/compose/pullup-pulldown'
import ComposePullUpPullDownSlide from 'vue-example/components/compose/pullup-pulldown-slide'
import ComposePullUpPullDownNested from 'vue-example/components/compose/pullup-pulldown-outnested'
import ComposeSlideNested from 'vue-example/components/compose/slide-nested'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/zoom',
      component: ZoomEntry,
    },
    {
      path: '/observe-dom',
      component: ObserveDOMEntry
    },
    {
      path: '/slide',
      component: SlideEntry,
      children: [
        {
          path: 'banner',
          component: BannerSlide,
        },
        {
          path: 'fullpage',
          component: PageSlide,
        },
        {
          path: 'vertical',
          component: VerticalSlide,
        },
        {
          path: 'dynamic',
          component: DynamicSlide,
        },
      ],
    },
    {
      path: '/core',
      component: CoreEntry,
      children: [
        {
          path: 'default',
          component: VerticalScroll,
        },
        {
          path: 'horizontal',
          component: HorizontalScroll,
        },
        {
          path: 'dynamic-content',
          component: DynamicContentScroll
        },
        {
          path: 'specified-content',
          component: SpecifiedContentScroll
        },
        {
          path: 'freescroll',
          component: Freescroll,
        },
      ],
    },
    {
      path: '/mouse-wheel',
      component: MouseWheelEntry,
      children: [
        {
          path: 'vertical-scroll',
          component: MouseWheelVerticalScroll,
        },
        {
          path: 'horizontal-scroll',
          component: MouseWheelHorizontalScroll,
        },
        {
          path: 'vertical-slide',
          component: MouseWheelVerticalSlide,
        },
        {
          path: 'horizontal-slide',
          component: MouseWheelHorizontalSlide,
        },
        {
          path: 'pullup',
          component: MouseWheelPullUp,
        },
        {
          path: 'pulldown',
          component: MouseWheelPullDown,
        },
        {
          path: 'picker',
          component: MouseWheelPicker,
        },
      ],
    },
    {
      path: '/picker',
      component: PickerEntry,
      children: [
        {
          path: 'one-column',
          component: OneColumnPicker,
        },
        {
          path: 'double-column',
          component: DoubleColumnPicker,
        },
        {
          path: 'linkage-column',
          component: LinkageColumnPicker,
        },
      ],
    },
    {
      path: '/pullup',
      component: PullupEntry,
    },
    {
      path: '/pulldown',
      component: PullDownEntry,
    },
    {
      path: '/scrollbar',
      component: ScrollBarEntry,
      children: [
        {
          path: 'vertical',
          component: ScrollbarVertical
        },
        {
          path: 'horizontal',
          component: ScrollbarHorizontal
        },
        {
          path: 'custom',
          component: ScrollbarCustom
        }
      ]
    },
    {
      path: '/infinity',
      component: InfinityScrollEntry,
    },
    {
      path: '/form',
      component: FormEntry,
      children: [
        {
          path: 'textarea',
          component: FormTextarea,
        },
      ],
    },
    {
      path: '/nested-scroll',
      component: NestedScrollEntry,
      children: [
        {
          path: 'vertical',
          component: NestedVerticalScroll,
        },
        {
          path: 'horizontal',
          component: NestedHorizontalScroll,
        },
        {
          path: 'horizontal-in-vertical',
          component: NestedHorizontalInVertical,
        },
        {
          path: 'triple-vertical',
          component: NestedTripleVerticalScroll,
        }
      ],
    },
    {
      path: '/movable',
      component: MovableEntry,
      children: [
        {
          path: 'default',
          component: Movable,
        },
        {
          path: 'scale',
          component: MovableScale,
        },
        {
          path: 'multi-content',
          component: MovableMultiContent
        },
        {
          path: 'multi-content-scale',
          component: MovableMultiContentScale
        }
      ],
    },
    {
      path: '/compose',
      component: ComposeEntry,
      children: [
        {
          path: 'pullup-pulldown',
          component: ComposePullUpPullDown,
        },
        {
          path: 'pullup-pulldown-slide',
          component: ComposePullUpPullDownSlide,
        },
        {
          path: 'pullup-pulldown-outnested',
          component: ComposePullUpPullDownNested
        },
        {
          path: 'slide-nested',
          component: ComposeSlideNested
        }
      ],
    },
    {
      path: '/observe-image',
      component: ObserveImageEntry
    }
  ],
})
