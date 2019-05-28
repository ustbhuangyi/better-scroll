# @better-scroll/wheel

实现类似于 IOS Picker 组件效果的插件。

## 使用

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
