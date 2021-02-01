import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDom from '@better-scroll/observe-dom'
import PullDownRefresh from '@better-scroll/pull-down'
import PullUpLoad from '@better-scroll/pull-up'
import ScrollBar from '@better-scroll/scroll-bar'
import Slide from '@better-scroll/slide'
import Wheel from '@better-scroll/wheel'
import Zoom from '@better-scroll/zoom'
import NestedScroll from '@better-scroll/nested-scroll'
import InfinityScroll from '@better-scroll/infinity'
import Movable from '@better-scroll/movable'
import ObserveImage from '@better-scroll/observe-image'
import Indicators from '@better-scroll/indicators'

export {
  createBScroll,
  BScrollInstance,
  Options,
  CustomOptions,
  TranslaterPoint,
  MountedBScrollHTMLElement,
  Behavior,
  Boundary,
  CustomAPI
} from '@better-scroll/core'

export {
  MouseWheel,
  ObserveDom,
  PullDownRefresh,
  PullUpLoad,
  ScrollBar,
  Slide,
  Wheel,
  Zoom,
  NestedScroll,
  InfinityScroll,
  Movable,
  ObserveImage,
  Indicators
}

BScroll.use(MouseWheel)
  .use(ObserveDom)
  .use(PullDownRefresh)
  .use(PullUpLoad)
  .use(ScrollBar)
  .use(Slide)
  .use(Wheel)
  .use(Zoom)
  .use(NestedScroll)
  .use(InfinityScroll)
  .use(Movable)
  .use(ObserveImage)
  .use(Indicators)

export default BScroll
