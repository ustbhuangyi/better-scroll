# 插件

## 为什么要有插件

为了方便对 BetterScroll 功能的扩展，在 2.0 的设计中引入了插件。我们提取了 `1.x` 版本的核心滚动能力，其余的 feature，诸如 pulldown、pullup 等等，都将通过插件来增强。

已有的插件：
- [pulldown](./pulldown.html)
- [pullup](./pullup.html)
- [scrollbar](./scroll-bar.html)
- [slide](./slide.html)
- [wheel](./wheel.html)
- [zoom](./zoom.html)
- [mouse-wheel](./mouse-wheel.html)
- [observe-dom](./observe-dom.html)

非常欢迎大家参与编写插件的这件有意义的事情，在此之前，你需要花点时间了解这个[如何编写插件](./how-to-write.html)。

## 使用插件

通过全局方法 `BScroll.use()` 使用插件。它需要在你调用 `new BScroll()` 之前完成：

```js
  import BScroll from '@better-scroll/core'
  import Plugin from 'somewhere'

  BScroll.use(Plugin)
  new BScroll(/*arguments*/)
```

## 使用插件的方法和属性

插件中可能会暴露一些方法和属性，这些方法和属性在你执行完 `new BScroll()` 之后，会通过 `Object.defineProperty` 的方式代理至 `bs`。例如，zoom 插件中提供了 `zoomTo` 方法，你可以通过下面的方式来使用：

```js
  import BScroll from '@better-scroll/core'
  import Zoom from '@better-scroll/zoom'

  BScroll.use(Zoom)

  const bs = new BScroll('#scroll-wrapper', {
    freeScroll: true,
    scrollX: true,
    scrollY: true,
    disableMouse: true,
    useTransition: true,
    zoom: {
      start: 1,
      min: 0.5,
      max: 2
    }
  })

  bs.zoomTo(1.5, 0, 0) // 使用 zoomTo
```

## 使用插件的钩子

和方法、属性类似，插件中暴露的钩子最终也会被代理至 `bs`。例如，zoom 插件中提供了 `zoomStart` 钩子，你可以通过下面的方式来监听：

```js
  import BScroll from '@better-scroll/core'
  import Zoom from '@better-scroll/zoom'

  BScroll.use(Zoom)

  const bs = new BScroll('#scroll-wrapper', {
    freeScroll: true,
    scrollX: true,
    scrollY: true,
    disableMouse: true,
    useTransition: true,
    zoom: {
      start: 1,
      min: 0.5,
      max: 2
    }
  })

  bs.on('zoomStart', zoomStartHandler)
  // so, you can do anything in zoomStartHandler
```

## 具备所有插件能力的 BetterScroll

考虑到一个个注册插件比较麻烦，如果你的项目用到 BetterScroll 的全部插件能力，我们提供了一劳永逸的方案。


```js
  import BScroll from 'better-scroll'

  const bs = new BScroll('#scroll-wrapper', {
    pullUpLoad: true,
    pullDownRefresh: true,
    scrollbar: true,
    // 等等
  })
```
