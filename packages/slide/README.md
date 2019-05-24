# @better-scroll/slide

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/slide/README_zh-CN.md)

The ability to inject a Carousel effect for BetterScroll.

## Usage

```js
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
BScroll.use(Slide)

const bs = new BScroll('.div', {
  scrollX: false,
  scrollY: true,
  slide: {
    loop: true,
    threshold: 100
  },
  useTransition: true,
  momentum: false,
  bounce: false,
  stopPropagation: true
})
```
