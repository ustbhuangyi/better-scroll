# plugins

## Why need plugins

In order to decouple the functions of the various features of BetterScroll 1.x, to prevent unlimited increase in the size of the bundle. In the `2.x` architecture design, a "plugin" architecture design is adopted. Each feature of 1.x will be implemented in the form of Plugin in `2.x`.

Existing plugins:
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

You can write a plugin by yourself to add new feature to `bs`. If you want do this, please refer to [How to write a plugin](./how-to-write.html).

## Use a plugin

Use plugins by calling the `BScroll.use()` static method. This has to be done before you call `new BScroll()`:

```js
  import BScroll from '@better-scroll/core'
  import Plugin from 'somewhere'

  new BScroll('.wrapper', {
    // pluginKey corresponds to the value of the static attribute pluginName on the Plugin class,
    // otherwise the plugin cannot be instantiated
    pluginKey: {}
  })
```

## Use a method or property of plugins

The plugin may expose some methods or properties. These methods or properties are proxied to `bs` via `Object.defineProperty` method. For example, the `zoomTo` method is provided in the zoom plugin, which you can use by `bs.zoomTo`.

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

  bs.zoomTo(1.5, 0, 0) // zoomTo from Zoom Plugin is proxied to bs instance
```

## Use a event of plugins

The hooks exposed in the plugin will be delegated to `bs`. For example, you can listen to the `zoomStart` event, which is exposed in zoom plugin, in the following way:

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

  bs.on('zoomStart', () => {

  })
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
import all of BetterScroll may have a big impact on the size of your bundle, and as the function of BetterScroll expands, the size will increase unlimitedly, **try to import what you need**.
:::

::: warning
Normally, you should pay attention to the properties and methods exposed by the BetterScroll instance, because the properties and methods on the plugin instance have been proxied to the bs. If you really need to care about the plugin instance, you can also use `bs.plugins ` to get all plugin information.

```js
  import BScroll from '@better-scroll/scroll'
  import zoom from '@better-scroll/zoom'

  BScroll.use(zoom)

  const bs = new BScroll('.wrapper', {
    zoom: true
  })

  console.log(bs.plugins.zoom)
```
:::