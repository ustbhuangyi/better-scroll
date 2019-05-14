# pullup

## 介绍

  pullup 插件为 BetterScroll 提供了监测上拉动作的能力。当成功监测到一次上拉动作时，会触发 `pullingUp` 事件。通常用于实现列表/页面滚动到底部时，上拉加载更多数据。

## 使用

通过静态方法 `BScroll.use()` 初始化插件

```js
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pullup'

BScroll.use(Pullup)
```

然后，实例化 BetterScroll 时需要传入 pullup 相关配置项 `pullUpLoad`：

```js
new BScroll('.bs-wrap', {
  scrollY: true,
  pullupLoad: true
})
```
## 示例

<demo qrcode-url="pullup/">
  <template slot="code-template">
    <<< @/examples/vue/components/pullup/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/pullup/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/pullup/default.vue?style
  </template>
  <pullup-default slot="demo"></pullup-default>
</demo>

## 配置项 pullUpLoad

默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载。当配置项为一个 Object 时，有如下属性：

|名称|类型|描述|默认值|
|----------|:-----:|:-----------|:--------:|
| threshold | number | 触发上拉事件的阈值 | 0 |

## 方法

### `finishPullUp()`

  - **介绍**：标识一次上拉加载动作结束。
  - **参数**：无
  - **返回值**：无

::: warning

注意：**每次触发上拉事件后，在回调函数的最后，都应该调用 `finishPullUp()` 方法。在 `finishPullUp()` 方法调用前不会触发下一次的 `pullingUp` 事件。**

:::

### `openPullUp(config: pullUpLoadOptions = true)`

  - **介绍**：开启上拉加载功能。如果实例化 BetterScroll 时 `pullUpLoad` 配置项不为 `false`，则不需要调用该方法。
  - **参数**：`config: boolean | { threshold: number }` ，参数为 pullUpLoad 配置项。默认值为 false。
  - **返回值**：无

### `closePullUp()`

  - **介绍**：关闭上拉加载功能。
  - **参数**：无
  - **返回值**：无

## 事件

### `pullingUp`

- **参数**：无
- **触发时机**：当距离滚动到底部小于 `threshold` 值时，触发一次 `pullingUp` 事件。
