# 插件

## 为什么要有插件

为了方便对 BetterScroll 功能的扩展，在 2.0 的设计中引入了插件。我们将之前 1.0 中核心滚动以外的功能，如 pulldown, pullup 等，都通过插件来扩展。

已有的插件：
- [pulldown](./pulldown.html)
- [pullup](./pullup.html)
- [scrollbar](./scroll-bar.html)
- [slide](./slide.html)
- [wheel](./wheel.html)
- [zoom](./zoom.html)
- [mouse-wheel](./mouse-wheel.html)
- [observe-dom](./observe-dom.html)

你也可以自己编写插件来实现自己的扩展功能，请参考[如何编写插件](./how-to-write.html)。

## 使用插件

通过全局方法 `BScroll.use()` 使用插件。它需要在你调用 `new BScroll()` 之前完成：

  ```js
    import BScroll from '@better-scroll/core'
    import Plugin from 'somewhere'
  ```

## 使用插件的方法和属性

插件中可能会暴露一些方法和属性，这些方法和属性在你执行完 `new BScroll()` 之后，会通过 `Object.defineProperty` 的代理至 bs 是那个。例如，zoom 插件中提供了 `zoomTo` 方法，你可以通过下面的方式来使用：

  ```js
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

## 使用插件的事件

和方法、属性类似，插件中暴露的事件最终也会被代理到 bs 上。例如，zoom 插件中提供了 `zoomStart` 事件，你可以通过下面的方式来监听：

  ```js
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
  ```
