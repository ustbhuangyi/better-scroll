# 使用

## 基础滚动

如果你只需要一个拥有基础滚动能力的列表，只需要引入 core。

```js
import BScroll from '@better-scroll/core'
let bs = new BScroll('.wrapper', {
  // ...... 详见配置项
})
```

## 增强型滚动

如果你需要一些额外的 feature。比如 `pull-up load`，你需要引入额外的插件，详情查看[插件](/zh-CN/plugins)。

```js
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'

// 注册插件
BScroll.use(Pullup)

let bs = new BScroll('.wrapper', {
  probeType: 3,
  pullUpLoad: true
})
```

## 全能力的滚动

如果你觉得一个个引入插件很费事，我们提供了一个拥有全部插件能力的 BetterScroll 包。它的使用方式与 `1.0` 版本一模一样，但是体积会相对大很多，推荐**按需引入**。

```js
import BScroll from 'better-scroll'

let bs = new BScroll('.wrapper', {
  // ...
  pullUpLoad: true,
  wheel: true,
  scrollbar: true,
  // and so on
})
```
