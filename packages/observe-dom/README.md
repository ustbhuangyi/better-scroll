# @better-scroll/observe-dom

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/observe-dom/README_zh-CN.md)

recaculating BetterScroll's scrollHeight or scrollWidth by `MutationObserver`, with this, you don't care when BetterScroll's scrollHeight or scrollWidth have changed. Plugin has done it for you.

> **if current browser does not surpport `MutationObserver`, it will fallback to `setTimeout` in recursion**

## Usage

```js
import BScroll from '@better-scroll/core'
import ObserveDom from '@better-scroll/observe-dom'
BScroll.use(ObserveDom)

const bs = new BScroll('.wrapper', {
  observeDOM: true
})
```
