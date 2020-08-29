# zoom

## Introduction

Add zoom functionality for BetterScroll.

## Install

```bash
npm install @better-scroll/zoom --save

// or

yarn add @better-scroll/zoom
```

## Usage

import `zoom`, then call `BScroll.use()`.

```js
import BScroll from '@better-scroll/core'
import Zoom from '@better-scroll/zoom'

BScroll.use(Zoom)
```

pass in the correct configuration in options, for example:

```js
new BScroll('.bs-wrapper', {
  freeScroll: true,
  scrollX: true,
  scrollY: true,
  zoom: {
    start: 1,
    min: 0.5,
    max: 2
  }
})
```

The following is related to `zoom` plugin and [BetterScroll configuration](../guide/base-scroll-options.html):

- **zoom(for plugin)**

  Enable zoom functionality. That is to say, the zoom plugin won't work without the zoom option, see [zoom option](./zoom.html#option).

- **freeScroll**

  If you want to scroll in x and y axies after zooming in, the **freeScroll** value should be set to `true`. In addtional, **scrollX** and **scrollY** are also need to be true.

- **scrollX**

  `true` is be required if you want to scroll in x axies after zooming in.

- **scrollY**

  `true` is be required if you want to scroll in y axies after zooming in.

## Demo

  :::warning
  pc is not allowed, scan the qrcode.
  :::

  <demo qrcode-url="zoom/default">
    <template slot="code-template">
      <<< @/examples/vue/components/zoom/default.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/zoom/default.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/zoom/default.vue?style
    </template>
    <zoom-default slot="demo"></zoom-default>
  </demo>

## Option

### start
  - **Type:** `number`
  - **Default:** `1`

    Initial scale.

### min
  - **Type:** `number`
  - **Default:** `1`

    min scale.

### max
  - **Type:** `number`
  - **Default:** `4`

    max scale.

### initialOrigin
  - **Type:** `[OriginX, OriginY]`
    - **OriginX**: `number | 'left' | 'right' | 'center'`
    - **OriginY**: `number | 'top' | 'bottom' | 'center'`
  - **Default:** `[0, 0]`

    The origin of first initializing zoom instance, It is valid when `start` is not `1`.The origin is all based on the coordinate system of `scaled element`.

  - **Examples:**

  ```js
    new BScroll('.bs-wrapper', {
      // ... other configuration
      zoom: {
        initialOrigin: [50, 50], // Based on 'scaled element', offsetLeft is 50px, offsetRight is 50px
        initialOrigin: [0, 0], // Based on 'scaled element', the left vertex
        initialOrigin: ['left', 'top'], // same as above
        initialOrigin: ['center', 'center'], // Based on 'scaled element', center position
        initialOrigin: ['right', 'top'], // Based on 'scaled element', the right vertex
      }
    })
  ```

  When you initialize zoom, you usually focus on zooming with the endpoint or center. You can refer to the above example.

### minimalZoomDistance
  - **Type:** `number`
  - **Default:** `5`

    When you zoom with two fingers, only when the zoom distance exceeds `minimalZoomDistance`, the zoom will take effect.

### bounceTime
  - **Type:** `number`
  - **Default:** `800`(ms)

    When the two fingers continue to zoom and the scale exceeds the threshold of `max`, when the two fingers leave, the internal "bounce" to the form of `max`, and `bounceTime` is the animation of this "bounce" behavior duration.

## Instance Methods

### zoomTo(scale, x, y, [bounceTime])
  - **Arguments**
    - `{number} scale`: scale ratio
    - `{OriginX} x`: The x of origin that is based on the left vertex of the **scaled element**
      - `OriginX: 'number | 'left' | 'right' | 'center'`
    - `{OriginY} y`:  The y of origin that is based on the left vertex of the **scaled element**
      - `OriginY: 'number | 'top' | 'bottom' | 'center'`
    - `{number} [bounceTime]<Optional>: Animation duration of a zoom action`

    Scale the element with `[x, y]` as the coordinate origin. x and y can be not only `number`, but also corresponding `string`, because general scenes are scaled based on endpoints or centers.

  - **Examples**

  ```js
  const bs = new BScroll('.bs-wrapper', {
    freeScroll: true,
    scrollX: true,
    scrollY: true,
    zoom: {
      start: 1,
      min: 0.5,
      max: 2
    }
  })
  // scaled to 1.8 based on the bottom left point of the scaled element
  bs.zoomTo(1.8, 'left', 'bottom')
  // animation duration is 1000ms
  bs.zoomTo(1.8, 'left', 'bottom', 1000)
  // scaled to 1.8 based on offsetLeft 100px & offsetTop 100px of the scaled element
  bs.zoomTo(1.8, 100, 100)
  // scaled to 2 based on the center of scaled element
  bs.zoomTo(2, 'center', 'center')
  ```

  - **Returns**: void

## Events

### beforeZoomStart
- **Arguments**: none
- **Trigger timing**: When two fingers touch the scaled element, it does not include directly calling the `zoomTo` method

### zoomStart

  - **Arguments**: none
  - **Trigger timing**: The two finger zoom distance exceeds the minimum threshold `minimalZoomDistance`, and the zoom will start soon. it does not include directly calling the `zoomTo` method

### zooming

  - **Arguments**: `{ scale }`
  - **Type**: `{ scale: number }`
  - **Trigger timing**: the process of two-finger zooming action in progress or directly calling `zoomTo` to zoom

  - **Examples**:
  ```js
    const bs = new BScroll('.bs-wrapper', {
      freeScroll: true,
      scrollX: true,
      scrollY: true,
      zoom: {
        start: 1,
        min: 0.5,
        max: 2
      }
    })

    bs.on('zooming', ({ scale }) => {
      // use scale
      console.log(scale) // current scale
    })
  ```

### zoomEnd

  - **Arguments**: `{ scale }`
  - **Type**: `{ scale: number }`
  - **Trigger timing**: After two finger zooming behavior ends (if there is a rebound, the trigger timing is after the rebound animation ends) or after calling `zoomTo` to complete the zoom

  ::: warning
  In the zoom scenario, you should listen to events such as `zoomStart`, `zooming`, `zoomEnd`, and not the lower-level `scroll` and `scrollEnd` events, otherwise it may not match your expectations.
  :::