# infinity

The infinity plugin provides BetterScroll with unlimited scrolling capabilities. If you have a large amount of list data to render, you can use the infinity plugin, in which BetterScroll will only render a certain number of DOM elements, so that the page will continue to scroll smoothly when a large amount of data.

> Note: Unless you have a lot of data rendering needs, use coreScroll.

## Install

```shell
npm install @better-scroll/infinity --save

// or

yarn add @better-scroll/infinity
```

## Usage

First, install the plugin via the static method `BScroll.use()`

```js
import BScroll from '@better-scroll/core'
import InfinityScroll from '@better-scroll/infinity'

BScroll.use(InfinityScroll)
```

Then, To instantiate BetterScroll, you need to pass the related configuration item `infinity`:

```typescript
new BScroll('.bs-wrapper', {
  scrollY: true,
  infinity: {
    fetch(count) {
      // Fetch data that is larger than count, the function is asynchronous, and it needs to return a Promise.。
      // After you have successfully fetch the data, you need resolve an array of data (or resolve Promise).
      // Each element of the array is list data, which will be rendered when the render method executes。
      // If there is no data, you can resolve (false) to tell the infinite scroll list that there is no more data。
    }
    render(item, div?: HTMLElement) {
      // Rendering each element node, item is data from fetch function
      // div is an element which is recycled from document or undefined
      // The function needs to return to a html element.
    },
    createTombstone() {
      // Must return a tombstone DOM node.
    }
  }
})
```

::: danger
`fetch`, `render`, `createTombstone` must be implemented in accordance with the comments as above, otherwise an internal error will be reported.
:::

## Demo

<demo qrcode-url="infinity/" render-code="true">
  <template slot="code-template">
    <<< @/examples/vue/components/infinity/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/infinity/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/infinity/default.vue?style
  </template>
  <infinity-default slot="demo"></infinity-default>
</demo>