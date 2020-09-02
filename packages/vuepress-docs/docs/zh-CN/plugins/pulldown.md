# pulldown

## 介绍

pulldown 插件为 BetterScroll 扩展下拉刷新的能力。

## 安装

```bash
npm install @better-scroll/pull-down --save

// or

yarn add @better-scroll/pull-down
```

## 使用

首先引入 pulldown 插件，并通过静态方法 `BScroll.use()` 初始化插件

```js
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'

BScroll.use(PullDown)
```

然后，实例化 BetterScroll 时需要传入[ pulldown 配置项](./pulldown.html#pulldownrefresh-选项对象)。

```js
new BScroll('.bs-wrapper', {
  pullDownRefresh: true
})
```

## 示例

<demo qrcode-url="pulldown/" :render-code="true">
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

## pullDownRefresh 选项对象

### threshold

  - **类型：** `number`
  - **默认值：** `90`

    配置顶部下拉的距离来决定刷新时机。

### stop

  - **类型：** `number`
  - **默认值：** `40`

    回弹悬停的距离。BetterScroll 在派发 `pullingDown` 钩子之后，会立马执行回弹悬停动画。

## 实例方法

### `finishPullDown()`

  - **介绍**：结束下拉刷新行为。
  - **参数**：无
  - **返回值**：无

::: warning 注意
每次触发 `pullingDown` 钩子后，你应该**主动调用** `finishPullDown()` 告诉 BetterScroll 准备好下一次的 pullingDown 钩子。
:::

### `openPullDown(config: PullDownRefreshOptions = {})`

  - **介绍**：动态开启下拉刷新功能。
  - **参数**：
    - `{ PullDownRefreshOptions } config`：修改 pulldown 插件的选项对象
    - `PullDownRefreshOptions`：类型如下
    ```typescript
    export type PullDownRefreshOptions = Partial<PullDownRefreshConfig> | true

    export interface PullDownRefreshConfig {
      threshold: number
      stop: number
    }
    ```
  - **返回值**：无

::: warning 注意
openPullDown 方法应该配合 closePullDown 一起使用，因为在 pulldown 插件的生成过程当中，已经**自动监测了下拉刷新的动作**。
:::

### `closePullDown()`

  - **介绍**：动态关闭下拉刷新功能。
  - **参数**：无
  - **返回值**：无

### `autoPullDownRefresh()`

  - **介绍**：自动执行下拉刷新。
  - **参数**：无
  - **返回值**：无

## 事件

### `pullingDown`

- **参数**：无
- **触发时机**：当顶部下拉的距离大于 `threshold` 值时，触发一次 `pullingDown` 钩子。

::: danger 危险
监测到下拉刷新的动作之后，`pullingDown` 钩子的消费机会只有一次，因此你需要调用 `finishPullDown()` 来告诉 BetterScroll 来提供下一次 `pullingDown` 钩子的消费机会。
:::
