# plugins

## Why need plugins

Plugins make it easier to add additional features to BetterScroll 2.0. Some features, such as pulldown and pullup, are implemented through plugins.

Existing plugins:
- [pulldown](./pulldown.html)
- [pullup](./pullup.html)
- [scrollbar](./scroll-bar.html)
- [slide](./slide.html)
- [wheel](./wheel.html)
- [zoom](./zoom.html)
- [mouse-wheel](./mouse-wheel.html)
- [observe-dom](./observe-dom.html)
- [nested-scroll](./nested-scroll.html)
- [infinity](./infinity.html)
- [movable](./movable.html)

You can write a plugin by yourself to add new feature to `bs`. If you want do this, please refer to [How to write a plugin](./how-to-write.html).

## Use a plugin

Use plugins by calling the `BScroll.use()` static method. This has to be done before you call `new BScroll()`:

```js
  import BScroll from '@better-scroll/core'
  import Plugin from 'somewhere'

  BScroll.use(Plugin)
  new BScroll(/*arguments*/)
```

## Use a function or property of plugins

Some methods or properties may be exposed in the plugin. These methods or properties are proxied to `bs` via `Object.defineProperty` method. For example, the `zoomTo` method is provided in the zoom plugin, which you can use in the following ways:

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

  bs.zoomTo(1.5, 0, 0) // use zoomTo
```

## Use a hook of plugins

The hooks exposed in the plugin will be delegated to `bs`. For example, you can listen to the `zoomStart` hook, which is exposed in zoom plugin, in the following way:

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
```

## BetterScroll with all plugins

Considering the trouble of registering plugins one by one, if your project uses the full plugins of BetterScroll, we offer a once-in-a-lifetime solution.


```js
  import BScroll from 'better-scroll'

  const bs = new BScroll('#scroll-wrapper', {
    pullUpLoad: true,
    pullDownRefresh: true,
    scrollbar: true,
    // and so on
  })
```

::: warning
import all of BetterScroll may have a big impact on the size of your bundle, try to import what you need.
:::
