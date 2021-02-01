# 插件

## 为什么要有插件

为了解耦 BetterScroll 1.x 的各个 feature 的功能，防止 bundle 体积无限制的增加。在 2.x 的架构设计当中，采用了『插件化』 的架构设计。对于 1.x 的各个 feature，在 2.x 都将以 Plugin 的形式实现。

已有的插件：
- [pulldown](./pulldown.html)
- [pullup](./pullup.html)
- [scrollbar](./scroll-bar.html)
- [slide](./slide.html)
- [wheel](./wheel.html)
- [zoom](./zoom.html)
- [mouse-wheel](./mouse-wheel.html)
- [observe-dom](./observe-dom.html)
- [observe-image](./observe-image.html)
- [nested-scroll](./nested-scroll.html)
- [infinity](./infinity.html)
- [movable](./movable.html)
- [indicators](./indicators.html)

非常欢迎大家参与插件的贡献，在此之前，你需要花点时间了解这个[如何编写插件](./how-to-write.html)。

## 使用插件

通过全局方法 `BScroll.use()` 使用插件。它需要在你调用 `new BScroll()` 之前完成：

```js
  import BScroll from '@better-scroll/core'
  import Plugin from 'somewhere'

  BScroll.use(Plugin)
  new BScroll('.wrapper', {
    pluginKey: {} // pluginKey 对应 Plugin 类上静态属性 pluginName 的值，否则插件无法实例化
  })
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

  bs.zoomTo(1.5, 0, 0) // 不用关心 zoom 插件实例，直接通过 bs 获取暴露的属性或者方法。
```

## 使用插件的事件

和方法、属性类似，插件中暴露的事件最终也会被代理至 `bs`。例如，zoom 插件中提供了 `zoomStart` 事件，你可以通过下面的方式来注册事件侦听器：

```js
  import BScroll from '@better-scroll/core'
  import Zoom from '@better-scroll/zoom'

  BScroll.use(Zoom)

  const bs = new BScroll('#scroll-wrapper', {
    freeScroll: true,
    scrollX: true,
    scrollY: true,
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

::: warning 注意
引用全部的 BetterScroll 可能对你的 bundle 体积有很大的冲击，而且随着 BetterScroll 的功能扩展，体积会无限制的增加，**请按需引入**。
:::

::: warning 注意
通常情况下，你应该关注 BetterScroll 实例暴露出来的属性和方法，因为对于插件实例上的属性和方法，都已经代理到 bs 上面，如果你真的需要关心插件实例，你也可以通过 `bs.plugins` 来获取所有插件的信息。

```js
  import BScroll from '@better-scroll/scroll'
  import zoom from '@better-scroll/zoom'

  BScroll.use(zoom)

  const bs = new BScroll('.wrapper', {
    zoom: true
  })

  console.log(bs.plugins.zoom) // 获取对应插件实例
```
:::