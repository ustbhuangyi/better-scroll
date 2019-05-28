# @better-scroll/pull-up

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/zoom/README_zh-CN.md)

Plugin for zooming in or out.

## Usage

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
