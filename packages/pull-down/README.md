# @better-scroll/pull-down

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/pull-down/README_zh-CN.md)

The ability to inject a pull-down refresh for BetterScroll.

## Usage

```js
import BScroll from '@better-scroll/core'
import Pulldown from '@better-scroll/pull-down'
BScroll.use(Pulldown)

const bs = new BScroll('.wrapper', {
  pullDownRefresh: true
})
```
