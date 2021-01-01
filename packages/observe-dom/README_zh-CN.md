# @better-scroll/observe-dom

动态计算 BetterScroll 的可滚动高度或者宽度，你并不需要自己在高度或者宽度发生变化的时候，手动调用 `refresh()` 方法。插件通过 `MutationObserver` 帮你完成了。

> **如果当前你的浏览器不支持 `MutationObserver`，会降级使用 `setTimeout`。**

## 使用

```js
import BScroll from '@better-scroll/core'
import ObserveDom from '@better-scroll/observe-dom'
BScroll.use(ObserveDom)

const bs = new BScroll('.wrapper', {
  observeDOM: true
})
```
