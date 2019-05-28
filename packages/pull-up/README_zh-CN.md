# @better-scroll/pull-up

为 BetterScroll 注入上拉加载的能力。

## 使用

```js
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
BScroll.use(Pullup)

const bs = new BScroll('.wrapper', {
  pullUpLoad: true
})
```
