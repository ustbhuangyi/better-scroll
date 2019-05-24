# @better-scroll/zoom

为 BetterScroll 提供放大或者缩小的效果的插件。

## 使用

```js
import BScroll from '@better-scroll/core'
import Zoom from '@better-scroll/zoom'
BScroll.use(Zoom)

const bs = new BScroll('.zoom-wrapper', {
  freeScroll: true,
  scrollX: true,
  scrollY: true,
  disableMouse: true,
  useTransition: true,
  zoom: {
    start: 1,
    min: 0.5,
    max: 2
  }
})
```
