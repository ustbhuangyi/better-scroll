# pulldown

## 介绍

  pulldown 插件为 BetterScroll 提供了监测下拉动作的能力。当成功监测到一次下拉动作时，会触发 `pullingDown` 钩子。通常用于实现列表/页面顶部下拉后加载更多数据的交互。

## 使用

首先引入 pulldown 插件，并通过静态方法 `BScroll.use()` 初始化插件

```js
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pulldown'

BScroll.use(PullDown)
```

然后，实例化 BetterScroll 时需要传入 pulldown 相关配置项 pullDownRefresh：

```js
new BScroll('.bs-wrap', {
  scrollY: true,
  pullDownRefresh: true
})
```

## 示例

<demo qrcode-url="pulldown/">
  <template slot="code-template">
    <<< @/examples/vue/components/pulldown/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/pulldown/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/pulldown/default.vue?style
  </template>
  <pulldown-default slot="demo"></pulldown-default>
</demo>

## 配置项 pullDownRefresh

默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新。当配置项为一个 Object 时，有如下属性：

|名称|类型|描述|默认值|
|----------|:-----:|:-----------|:--------:|
| threshold | number | 配置顶部下拉的距离来决定刷新时机 | 90 |
| stop | number | 回弹停留的距离 | 40 |

## 方法

### `finishPullDown()`

  - **介绍**：标识一次下拉动作结束。
  - **参数**：无
  - **返回值**：无

::: warning

注意：**每次触发下拉事件后，在回调函数的最后，都应该调用 `finishPullDown()` 方法。在 `finishPullDown()` 方法调用前不会触发下一次的 `pullingDown` 事件。**

:::

### `openPullDown(config: pullDownRefreshOptions = true)`

  - **介绍**：开启下拉刷新功能。如果实例化 BetterScroll 时 `pullDownRefresh` 配置项不为 `false`，则不需要调用该方法。
  - **参数**：`config: boolean | { threshold: number, stop: number }` ，参数为 pullDownRefresh 配置项。默认值为 false。
  - **返回值**：无

### `closePullDown()`

  - **介绍**：关闭下拉刷新功能。
  - **参数**：无
  - **返回值**：无

## 钩子

### `pullingDown`

- **参数**：无
- **触发时机**：当顶部下拉的距离大于 `threshold` 值时，触发一次 `pullingDown` 钩子。
