# nested-scroll

## Introduction

Coordinates nested BetterScroll scrolling behavior.

::: warning
**v2.1.0** supports BetterScroll with **Multi Nesting**, with more powerful functions and better performance. Only **Double Nesting** is supported in old version, please upgrade to **v2.1.0** as soon as possible.
:::

::: tip
**v2.1.0** Perfectly solves the problem that the click event of multi-level nested BetterScroll is dispatched multiple times.
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
  // < v2.1.0
  // parent bs
  new BScroll('.outerWrapper', {
    nestedScroll: true
  })
  // child bs
  new BScroll('.innerWrapper', {
    nestedScroll: true
  })

  // >= v2.1.0
  // parent bs
  new BScroll('.outerWrapper', {
    nestedScroll: {
      groupId: 'dummy-divide' // string or number
    }
  })
  // child bs
  new BScroll('.innerWrapper', {
    nestedScroll: {
      groupId: 'dummy-divide'
    }
  })
```

BetterScroll instances (bs) with the same `groupId` **share the same NestedScroll instance**(`ns`), `ns` will coordinate the scrolling behavior of each bs, once a bs is destroyed, `ns` will lose control of it, for example:

```js
// parent bs
const bs1 = new BScroll('.outerWrapper', {
  nestedScroll: {
    groupId: 'shared' // string or number
  }
})
// child bs
const bs2 = new BScroll('.innerWrapper', {
  nestedScroll: {
    groupId: 'shared'
  }
})

console.log(bs1.plugins.nestedScroll === bs2.plugins.nestedScroll) // true

// nestedScroll no longer constrains bs2
// nestedScroll no longer coordinates the scrolling behavior of bs1 and bs2
bs2.destroy()
```

## Demo

- **Nested vertical scroll(v2.1.0)**

  <demo qrcode-url="nested-scroll/vertical" :render-code="true">
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

- **Nested triple vertical scroll(v2.1.0)**

  <demo qrcode-url="nested-scroll/triple-vertical" :render-code="true">
    <template slot="code-template">
      <<< @/examples/vue/components/nested-scroll/triple-vertical.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/nested-scroll/triple-vertical.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/nested-scroll/triple-vertical.vue?style
    </template>
    <nested-scroll-triple-vertical slot="demo"></nested-scroll-triple-vertical>
  </demo>

- **Nested horizontal scroll(v2.1.0)**

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

## Instance Methods(v2.1.0)

:::tip
All methods are proxied to BetterScroll instance, for example:

```js
import BScroll from '@better-scroll/core'
import NestedScroll from '@better-scroll/nested-scroll'

BScroll.use(NestedScroll)

const bs1 = new BScroll('.parent-wrapper', {
  nestedScroll: {
    groupId: 'dummy'
  }
})

const bs2 = new BScroll('.child-wrapper', {
  nestedScroll: {
    groupId: 'dummy'
  }
})

// purge nestedScroll
// bs1 and bs2 share the same nestedScroll instance because they have the same groupId
bs1.purgeNestedScroll() // Same as bs2.purgeNestedScroll()
```
:::

### `purgeNestedScroll()`

  - **Details**: Purge the nestedScroll that controls itself

  ::: warning
  Different `groupId` will generate different nestedScroll, and the same `groupId` will share the same nestedScroll, so you should call `purgeNestedScroll` at the right time (such as when the component is destroyed) to clean up the memory. Or you can call the destroy method of BetterScroll to remove itself from nestedScroll, for example:

  ```js
  const bs1 = new BScroll('.parent-wrapper', {
    nestedScroll: {
      groupId: 'dummy'
    }
  })

  const bs2 = new BScroll('.child-wrapper', {
    nestedScroll: {
      groupId: 'dummy'
    }
  })

  bs1.destroy() // nestedScroll no longer constrains bs1
  bs2.destroy() // nestedScroll no longer constrains bs2
  ```
  :::

## Static Methods(v2.1.0)

### `getAllNestedScrolls()`

  - **Details**: Get all current nestedScroll instances

  - **Returns**: An array of nestedScroll instances

  ```typescript
  import NestedScroll from '@better-scroll/nested-scroll'

  const nestedScrolls: NestedScroll[] = NestedScroll.getAllNestedScrolls()
  ```

### `purgeAllNestedScrolls()`

  - **Details**: Purge all current nestedScroll instances

  ```typescript
  import NestedScroll from '@better-scroll/nested-scroll'

  // No longer constrain any BetterScroll instances
  NestedScroll.purgeAllNestedScrolls()
  ```