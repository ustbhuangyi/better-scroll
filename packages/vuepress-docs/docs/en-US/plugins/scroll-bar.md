# scrollbar

## Introduciton

  The scrollbar plugin provides a nice scrollbar for BetterScroll.

## Install

```bash
npm install @better-scroll/scroll-bar --save

// or

yarn add @better-scroll/scroll-bar
```

## Usage

First, install the plugin via the static method `BScroll.use()`

```js
  import BScroll from '@better-scroll/core'
  import ScrollBar from '@better-scroll/scroll-bar'

  BScroll.use(ScrollBar)
```

pass correct [scrollbar options](./scroll-bar.html#scrollbar-options)

```js
  new BScroll('.bs-wrapper', {
    scrollY: true,
    scrollbar: true
  })
```

## Demo

<demo qrcode-url="scrollbar/default" render-code="true">
  <template slot="code-template">
    <<< @/examples/vue/components/scrollbar/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/scrollbar/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/scrollbar/default.vue?style
  </template>
  <scrollbar-default slot="demo"></scrollbar-default>
</demo>

## scrollbar options

### fade

  - **类型**：`boolean`
  - **默认值**：`true`

  When the scroll stops, the scrollbar fades out.

### interactive

  - **类型**：`boolean`
  - **默认值**：`false`

  Whether scrollbar can interacted with.
