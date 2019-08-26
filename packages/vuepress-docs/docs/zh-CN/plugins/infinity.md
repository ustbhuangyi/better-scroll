# infinity

## 介绍

infinity 插件为 BetterScroll 提供了无限滚动的能力。如果有大量的列表数据需要渲染，可以使用 infinity 插件，此时 BetterScroll 只会渲染一定数量的 DOM 元素，从而使页面在大量数据时依然保持流畅滚动。注意：除非你有大量的数据渲染需求，否则使用普通的滚动即可。

## 安装

```shell
npm install @better-scroll/infinity@next --save

// or

yarn add @better-scroll/infinity@next
```

## 使用

首先引入 infinity 插件，并通过静态方法 `BScroll.use()` 初始化插件

```js
import BScroll from '@better-scroll/core'
import InfinityScroll from '@better-scroll/infinity'

BScroll.use(InfinityScroll)
```

然后，实例化 BetterScroll 时需要传入相关配置项 infinity:

```js
new BScroll('.bs-wrap', {
  scrollY: true,
  infinity: {
    fetch(count) {
      // 获取大于 count 数量的数据，该函数是异步的，它需要返回一个 Promise。
      // 成功获取数据后，你需要 resolve 数据数组（也可以 resolve 一个 Promise）。
      // 数组的每一个元素是列表数据，在 render 方法执行的时候会传递这个数据渲染。
      // 如果没有数据的时候，你可以 resolve(false)，来告诉无限滚动列表已经没有更多数据了。
    }
    render(item, div) {
      // 渲染每一个元素节点，item 是数据，div 是包裹元素节点的容器。
      // 该函数需要返回渲染后的 DOM 节点。
    },
    createTombstone() {
      // 返回一个墓碑 DOM 节点。
    }
  }
})
```

## 示例

<demo qrcode-url="infinity/">
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