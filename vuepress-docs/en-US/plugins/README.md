# plugins

## Why need plugins

Plugins make it easier to add additional features to better scroll 2.0. Some features, such as pulldown and pullup, are implemented through plugins.

Existing plugins:
- [pulldown](./pulldown.html)
- [pullup](./pullup.html)
- [scrollbar](./scroll-bar.html)
- [slide](./slide.html)
- [wheel](./wheel.html)
- [zoom](./zoom.html)
- [mouse-wheel](./mouse-wheel.html)
- [observe-dom](./observe-dom.html)

You can write a plugin by yourself to add new feature to better scroll. If you want do this, please refer to [How to write a plugin](./how-to-write.html).

## Use a plugin

Use plugins by calling the `BScroll.use()` global method. This has to be done before you call `new BScroll()`:

```js
BScroll.use(Plugin)
new BScroll(/*arguments*/)
```

:::warning
`BScroll.use` automatically prevents you from registing the same plugin more than once. If you do this, you will get an error message in console.
:::

## Use a function or property of plugins

Some methods or properties may be exposed in the plugin. These methods or properties are mounted to the better scroll instance, returned by `new BScroll()`, by `Object.defineProperty` method. For example, the `zoomTo` method is provided in the zoom plugin, which you can use in the following ways:

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

bs.zoomTo(1.5, 0, 0) // use zoomTo
```

## Use a hook of plugins

The hooks exposed in the plugin will be delegated to the better scroll instance. For example, you can listen to the `zoomStart` hook, which is exposed in zoom plugin, in the following way:
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