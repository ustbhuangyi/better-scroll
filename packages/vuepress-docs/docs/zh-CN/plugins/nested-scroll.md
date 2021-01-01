# nested-scroll

## 介绍

协调嵌套的 BetterScroll 滚动行为。

::: warning 警告
v2.1.0 支持**多层嵌套**的 BetterScroll，并且功能更强大，性能更好。在这之前，只支持**双层嵌套**，请尽快升级至 2.1.0 版本。
:::

::: tip 提示
**v2.1.0** 完美解决多层嵌套 BetterScroll 的 click 事件多次派发的问题。
:::

## 安装

```bash
npm install @better-scroll/nested-scroll --save

// or

yarn add @better-scroll/nested-scroll
```

## 使用

你需要首先引入 `nested-scroll` 插件，并通过全局方法 `BScroll.use()` 使用

```js
  import BScroll from '@better-scroll/core'
  import NestedScroll from '@better-scroll/nested-scroll'

  BScroll.use(NestedScroll)
```

上面步骤完成后，BScroll 的 `options` 中配置 `nestedScroll`。

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

  // v2.1.0
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

具有相同 `groupId` 的 BetterScroll 实例（bs）**共享同一个** NestedScroll 实例（ns），ns 会协调每个 bs 滚动行为，一旦某个 bs 销毁的时候，ns 都会失去对它的掌控，例如：

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

bs2.destroy() // nestedScroll 不再约束 bs2，不再协调 bs1 与 bs2 的滚动行为
```

## 示例

- **竖向双层嵌套(v2.1.0)**

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

- **竖向三层嵌套(v2.1.0)**

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

- **横向双层嵌套(v2.1.0)**

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

  - **横向竖向双层嵌套(v2.1.0)**

    <demo qrcode-url="nested-scroll/horizontal-in-vertical">
      <template slot="code-template">
        <<< @/examples/vue/components/nested-scroll/horizontal-in-vertical.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/nested-scroll/horizontal-in-vertical.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/nested-scroll/horizontal-in-vertical.vue?style
      </template>
      <nested-scroll-horizontal-in-vertical slot="demo"></nested-scroll-horizontal-in-vertical>
    </demo>

## 实例方法（v2.1.0）

:::tip 提示
以下方法皆已代理至 BetterScroll 实例，例如：

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

// 销毁 nestedScroll，bs1 与 bs2 共享同一个 nestedScroll 实例，因为他们的 groupId 相同
bs1.purgeNestedScroll() // 与 bs2.purgeNestedScroll() 的效果一样
```
:::

### `purgeNestedScroll()`

  - **介绍**：销毁管控自己的 nestedScroll

::: warning 注意
不同的 `groupId` 会生成不同的 nestedScroll，相同的 `groupId` 会共享同一份 nestedScroll，因此你应该在合适的时机（比如组件销毁的时候）调用 `purgeNestedScroll` 来清理内存。或者你也可以调用 BetterScroll 的 destroy 方法把自身从 nestedScroll 移除，例如：

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

bs1.destroy() // nestedScroll 不再管控 bs1
bs2.destroy() // nestedScroll 不再管控 bs2
```
:::

## 静态方法（v2.1.0）

### `getAllNestedScrolls()`

  - **介绍**：获取当前所有的 nestedScroll 实例

  - **返回**：nestedScroll 实例组成的数组

  ```typescript
  import NestedScroll from '@better-scroll/nested-scroll'

  const nestedScrolls: NestedScroll[] = NestedScroll.getAllNestedScrolls()
  ```

### `purgeAllNestedScrolls()`

  - **介绍**：销毁当前所有的 nestedScroll 实例

  ```typescript
  import NestedScroll from '@better-scroll/nested-scroll'

  // 不再约束任何 BetterScroll 实例
  NestedScroll.purgeAllNestedScrolls()
  ```