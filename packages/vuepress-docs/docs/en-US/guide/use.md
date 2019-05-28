# How to use

## Basic Usage

If you only need a list with basic scrolling capabilities, just use `core`.

```js
import BScroll from '@better-scroll/core'
let bs = new BScroll('.wrapper', {
  // ...... see options
})
```

## Plugins

If you need some extra features like `pull-up load`, you need to introduce additional plugins, see for details[plugins](/zh-CN/plugins)。

```js
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'

// register plugin
BScroll.use(Pullup)

let bs = new BScroll('.wrapper', {
  probeType: 3,
  pullUpLoad: true
})
```

## Full plugins

If you find it painsome to register plugins one by one, we offer a BetterScroll package with full plugin capabilities. It is used in exactly the same way as the `1.0` version, but the volume will be relatively large, it is recommended to load by plugin.

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
