# indicators <Badge text="2.1.5" />

## 介绍

indicators 提供联动另外一个 BetterScroll 的能力，借助于此，可以实现**视觉滚动差**、**放大镜**等效果。

## 安装

```bash
npm install @better-scroll/indicators --save

// or

yarn add @better-scroll/indicators
```

## 使用

首先引入 indicators 插件，并通过静态方法 `BScroll.use()` 注册插件

```js
  import BScroll from '@better-scroll/core'
  import Indicators from '@better-scroll/indicators'

  BScroll.use(Indicators)
```

接着在 `options` 传入正确的配置。

```js
  new BScroll('.wrapper', {
    indicators: {
      relationElement: "联动的元素 DOM" //
    }
  })
```
## 示例

  - **放大镜效果**

    <demo qrcode-url="indicators/minimap" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/indicators/minimap.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/minimap.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/minimap.vue?style
      </template>
      <indicators-minimap slot="demo"></indicators-minimap>
    </demo>

  - **视觉滚动差**

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

## indicators 选项对象

