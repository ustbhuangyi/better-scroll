# nested-scroll

## Introduction

Coordinates BetterScroll's two-level nested scrolling behavior.

::: warning
Currently, the plugin only solves the problem of double nesting, such as **vertical in vertical**, **horizontal in horizontal**.
:::

## Install

```bash
npm install @better-scroll/nested-scroll --save

// or

yarn add @better-scroll/nested-scroll
```

## Usage

import the `nested-scroll` plugin and use it with the static method `BScroll.use()`

```js
  import BScroll from '@better-scroll/core'
  import NestedScroll from '@better-scroll/nested-scroll'

  BScroll.use(NestedScroll)
```

After the above steps are completed, `nestedScroll` is configured in BScroll's `options`.

```js
  // parent bs
  new BScroll('.outerWrapper', {
    nestedScroll: true
  })
  // child bs
  new BScroll('.innerWrapper', {
    nestedScroll: true
  })
```

## Demo

- **Nested vertical scroll**

  <demo qrcode-url="nested-scroll/vertical">
    <template slot="code-template">
      <<< @/examples/vue/components/nested-scroll/vertical.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/nested-scroll/vertical.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/nested-scroll/vertical.vue?style
    </template>
    <nested-scroll-vertical slot="demo"></nested-scroll-vertical>
  </demo>

- **Nested horizontal scroll**

  <demo qrcode-url="nested-scroll/horizontal">
    <template slot="code-template">
      <<< @/examples/vue/components/nested-scroll/horizontal.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/nested-scroll/horizontal.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/nested-scroll/horizontal.vue?style
    </template>
    <nested-scroll-horizontal slot="demo"></nested-scroll-horizontal>
  </demo>