# @better-scroll/mouse-wheel

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/mouse-wheel/README_zh-CN.md)

Allow the mouse wheel to manipulate scrolling behavior.

## Usage

```js
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
BScroll.use(MouseWheel)

const bs = new BScroll('.wrapper', {
  // ...
  mouseWheel: {
    speed: 2,
    invert: false,
    easeTime: 300,
  }
})
```
