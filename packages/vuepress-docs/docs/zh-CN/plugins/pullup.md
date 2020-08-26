# pullup

## 介绍

pullup 插件为 BetterScroll 扩展上拉加载的能力。

## 安装

```bash
npm install @better-scroll/pull-up --save

// or

yarn add @better-scroll/pull-up
```

## 使用

通过静态方法 `BScroll.use()` 初始化插件

```js
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'

BScroll.use(Pullup)
```

然后，实例化 BetterScroll 时需要传入[ pullup 配置项](./pullup.html#pullupload-选项对象)。

```js
new BScroll('.bs-wrapper', {
  pullUpLoad: true
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

## pullUpLoad 选项对象

### threshold

  - **类型：** `number`
  - **默认值：** `90`

    触发上拉事件的阈值。

## 实例方法

### `finishPullUp()`

  - **介绍**：结束上拉加载行为。
  - **参数**：无
  - **返回值**：无

::: warning 注意

每次触发 `pullingUp` 钩子后，你应该**主动调用** `finishPullUp()` 告诉 BetterScroll 准备好下一次的 pullingUp 钩子。

:::

### `openPullUp(config: PullUpLoadOptions = {})`

  - **介绍**：动态开启上拉功能。
  - **参数**：
    - `{ PullUpLoadOptions } config`：修改 pullup 插件的选项对象
    - `PullUpLoadOptions`：类型如下
    ```typescript
    export type PullUpLoadOptions = Partial<PullUpLoadConfig> | true

    export interface PullUpLoadConfig {
      threshold: number
    }
    ```
  - **返回值**：无

::: warning 注意
openPullUp 方法应该配合 closePullUp 一起使用，因为在 pullup 插件的生成过程当中，已经**自动监测了上拉加载的动作**。
:::

### `closePullUp()`

  - **介绍**：关闭上拉加载功能。
  - **参数**：无
  - **返回值**：无

### `autoPullUpLoad()`

  - **介绍**：自动执行上拉加载。
  - **参数**：无
  - **返回值**：无

## 钩子

### `pullingUp`

- **参数**：无
- **触发时机**：当距离滚动到底部小于 `threshold` 值时，触发一次 `pullingUp` 事件。

::: danger 警告
监测到上拉刷新的动作之后，`pullingUp` 钩子的消费机会只有一次，因此你需要调用 `finishPullUp()` 来告诉 BetterScroll 为提供下一次 `pullingUp` 钩子的消费机会。
:::