# @better-scroll/observe-image

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/observe-image/README_zh-CN.md)

when detecting images is loaded or failed to load, auto refresh BetterScroll's size.


## Usage

```js
import BScroll from '@better-scroll/core'
import ObserveImage from '@better-scroll/observe-image'
BScroll.use(ObserveImage)

const bs = new BScroll('.wrapper', {
  observeImage: true
})
```
