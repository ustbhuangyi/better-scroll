import BetterScrollCore from '@better-scroll/core'
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

BetterScrollCore.use(MouseWheel)
  .use(ObserveDom)
  .use(PullDownRefresh)
  .use(PullUpLoad)
  .use(ScrollBar)
  .use(Slide)
  .use(Wheel)
  .use(Zoom)
  .use(NestedScroll)
  .use(InfinityScroll)

export default BetterScrollCore
