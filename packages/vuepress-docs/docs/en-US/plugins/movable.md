# movable

## Introduction

Add move functionality for BetterScroll.

## Install

```bash
npm install @better-scroll/movable --save

// or

yarn add @better-scroll/movable
```

## Basic Usage

import `movable`, then call `BScroll.use()`.

```js
  import BScroll from '@better-scroll/core'
  import Movable from '@better-scroll/movable'

  BScroll.use(Movable)
```

pass in the correct configuration in options, for example:

```js
  new BScroll('.bs-wrapper', {
    bindToTarget: true,
    scrollX: true,
    scrollY: true,
    freeScroll: true,
    bounce: true
    movable: true // for movable plugin
  })
```

The following is related to `movable` plugin and [BetterScroll configuration](../guide/base-scroll-options.html):

- **movable(for plugin)**

  Enable zoom functionality, set it `true`.

- **bindToTarget**

  Must be set to `true` to actively bind the touch event to **the element to be moved**, because BetterScroll binds the touch event to **the wrapper element** by default.

- **freeScroll**

  Record the offset of x and y direction when finger moved, set it `true`. In addtional, **scrollX** and **scrollY** are also need to be true.

- **scrollX**

  Enable the scrolling ability in the x direction and set it to `true`.

- **scrollY**

  Enable the scrolling ability in the y direction and set it to `true`.

- **bounce**

  Specifies to turn on boundary rebound.

  - **Examples**

  ```js
    {
      bounce: true // Enable all directions,
      bounce: {
        left: true, // Enable the left
        right: true, // Enable the right
        top: false,
        bottom: false
      }
    }
  ```
## Demo

  - **Only one content**

    Usually, there is only one content.

    <demo qrcode-url="movable/default" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/movable/default.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/movable/default.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/movable/default.vue?style
      </template>
      <movable-default slot="demo"></movable-default>
    </demo>

  - **Multi content**

    However, in some scenarios, there may be multiple content.

    <demo qrcode-url="movable/multi-content">
      <template slot="code-template">
        <<< @/examples/vue/components/movable/multi-content.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/movable/multi-content.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/movable/multi-content.vue?style
      </template>
      <movable-multi-content slot="demo"></movable-multi-content>
    </demo>

## Advanced Usage

With [ zoom ](./zoom.html#introduction) plugin, increase the zoom capability.

```js
  import BScroll from '@better-scroll/core'
  import Movable from '@better-scroll/movable'
  import Zoom from '@better-scroll/zoom'
  new BScroll('.bs-wrapper', {
    bindToTarget: true,
    scrollX: true,
    scrollY: true,
    freeScroll: true,
    bounce: true
    movable: true // for movable plugin
    zoom: { // for zoom plugin
      start: 1,
      min: 1,
      max: 3
    }
  })
```

## Demo

  :::warning
  pc is not allowed, scan the qrcode.
  :::

  - **One Content**

    <demo qrcode-url="movable/scale">
      <template slot="code-template">
        <<< @/examples/vue/components/movable/scale.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/movable/scale.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/movable/scale.vue?style
      </template>
      <movable-scale slot="demo"></movable-scale>
    </demo>

  - **Multi Content**

    <demo qrcode-url="movable/multi-content-scale">
      <template slot="code-template">
        <<< @/examples/vue/components/movable/multi-content-scale.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/movable/multi-content-scale.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/movable/multi-content-scale.vue?style
      </template>
      <movable-multi-content-scale slot="demo"></movable-multi-content-scale>
    </demo>

## Instance Methods

### putAt(x, y, [time], [easing]) <Badge text='2.0.4' />
  - **Arguments**
    - `{PositionX} x`: x coordinate
      - `PositionX: 'number | 'left' | 'right' | 'center'`
    - `{PositionY} y`: y coordinate
      - `PositionY: 'number | 'top' | 'bottom' | 'center'`
    - `{number} [time]<Optional>`: Scroll animation duration
    - `{EaseItem} [easing]<Optional>`: Ease effect configuration, refer to [ease.ts](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/shared-utils/src/ease.ts), the default is `bounce` effect

    Put the content element in a certain position. x and y can be not only numbers, but also corresponding strings.

  - **Examples**

  ```js
  const bs = new BScroll('.bs-wrapper', {
    bindToTarget: true,
    scrollX: true,
    scrollY: true,
    freeScroll: true,
    movable: true
  })

  // Placed in the center of the wrapper
  bs.putAt('center', 'center', 0)

  // Placed in the right-bottom corner of the wrapper, the animation duration is 1s
  bs.putAt('right', 'bottom', 1000)
  ```