# @better-scroll/pull-up

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/pull-up/README_zh-CN.md)

The ability to inject a pull-up load for BetterScroll.

## Usage

```js
import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
BScroll.use(PullUp)

const bs = new BScroll('.wrapper', {
  pullUpLoad: true
})
```
