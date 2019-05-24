# @better-scroll/wheel

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/wheel/README_zh-CN.md)

Implement a plugin similar to the effects of the IOS Picker component.

## Usage

```js
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'
BScroll.use(Wheel)

const bs = new BScroll('.wheel-wrapper', {
  wheel: {
    selectedIndex: 0,
    wheelWrapperClass: 'wheel-scroll',
    wheelItemClass: 'wheel-item',
    wheelDisabledItemClass: 'wheel-disabled-item'
  },
  probeType: 3
})
```
