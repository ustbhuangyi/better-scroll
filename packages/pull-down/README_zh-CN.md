# @better-scroll/pull-down

为 BetterScroll 注入下拉刷新的能力。

## 使用

```js
import BScroll from '@better-scroll/core'
import Pulldown from '@better-scroll/pull-down'
BScroll.use(Pulldown)

const bs = new BScroll('.wrapper', {
  pullDownRefresh: true
})
```
