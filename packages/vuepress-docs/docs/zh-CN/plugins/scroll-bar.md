# scrollbar

## 介绍

  scrollbar 插件为 BetterScroll 提供了样式美观的滚动条。

## 安装

```shell
npm install @better-scroll/scroll-bar@next --save

// or

yarn add @better-scroll/scroll-bar@next
```

## 使用

首先引入 scrollbar 插件，并通过静态方法 `BScroll.use()` 初始化插件

```js
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'

BScroll.use(ScrollBar)
```

然后，实例化 BetterScroll 时需要传入 scrollbar 相关配置项 scrollbar：

```js
new BScroll('.bs-wrap', {
  scrollY: true,
  scrollbar: true
})
```
## 示例

<demo qrcode-url="scrollbar/default">
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

## 配置项 scrollbar

默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启滚动条。当配置项为一个 Object 时，有如下属性

|名称|类型|描述|默认值|
|----------|:-----:|:-----------|:--------:|
| fade | boolean | 当滚动停止的时候，滚动条渐隐 | true |
| interactive | boolean | 滚动条是否可以交互 | false |
