# indicators <Badge text="2.2.0" />

## Introduciton

The indicators provides the ability to link with another BetterScroll. With this, you can achieve effects such as **Parallax Scrolling**, **Magnifier**.

::: tip
This is a very powerful and creative plugin.
:::

## Install

```bash
npm install @better-scroll/indicators --save

// or

yarn add @better-scroll/indicators
```

## Usage

First, install the plugin via the static method `BScroll.use()`

```js
import BScroll from '@better-scroll/core'
import Indicators from '@better-scroll/indicators'

BScroll.use(Indicators)
```

pass correct [indicators options](./indicators.html#indicators-options).

```js
new BScroll('.wrapper', {
  indicators: {
    // For details, please refer to the demo below
    relationElement: someHTMLElement
  }
})
```
## Demos

  - **Magnifier**

    <demo qrcode-url="indicators/minimap" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/indicators/minimap.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/indicators/minimap.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/indicators/minimap.vue?style
      </template>
      <indicators-minimap slot="demo"></indicators-minimap>
    </demo>

  - **Parallax Scrolling**

    <demo qrcode-url="indicators/parallax-scroll">
      <template slot="code-template">
        <<< @/examples/vue/components/indicators/parallax-scroll.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/indicators/parallax-scroll.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/indicators/parallax-scroll.vue?style
      </template>
      <indicators-parallax-scroll slot="demo"></indicators-parallax-scroll>
    </demo>

## indicators options

### relationElement

  - **Type**: `HTMLElement`

  The container element associated with another BetterScroll, just like the above demo, `div.scroll-indicator` is releationElement. **releationElement must be passed in by the user and has child elements**.

### relationElementHandleElementIndex

  - **Type**: `number`
  - **Default**: `0`

  Specify the child element of releationElement as the manipulated element. For details, please refer to the above demo.

### ratio

  - **Type**: `number | Ratio | undefined`
  - **Default**: `undefined`

  ```ts
  type Ratio = {
    // Specify the ratio of the scroll distance of x
    x: number
    // Specify the ratio of the scroll distance of y
    y: number
  }
  ```
  Specify the ratio of releationElement to the scrolling distance of BetterScroll. Usually,**the plugin will automatically** calculate the scroll ratio of the two, but you can also manually specify the ratio to achieve the effect of `Parallax Scrolling`. For details, please refer to the demo above.

### interactive

  - **Type**: `boolean | undefined`
  - **Default**: `undefined`

  Decide whether the relationElementHandleElementIndex of relationElement can interact. When it is set to `false`, it will not respond to touch / mouse events.