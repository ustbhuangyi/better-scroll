# @better-scroll/observe-image

当探测到 BetterScroll content DOM 的子元素是 image 标签，并且加载成功或者失败的时候，自动调用 `refresh()` 方法重新计算可滚动的高度或者宽度，适用于当滚动区域含有高度或者宽度不固定的场景。

## 使用

```js
import BScroll from '@better-scroll/core'
import ObserveImage from '@better-scroll/observe-image'
BScroll.use(ObserveImage)

const bs = new BScroll('.wrapper', {
  observeImage: true
})
```
