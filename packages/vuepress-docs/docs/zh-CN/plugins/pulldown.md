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

- **基础使用**

<demo qrcode-url="pulldown/default" :render-code="true">
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

- **仿新浪微博 <Badge text='2.4.0' />**

<demo qrcode-url="pulldown/sina">
  <template slot="code-template">
    <<< @/examples/vue/components/pulldown/sina-weibo.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/pulldown/sina-weibo.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/pulldown/sina-weibo.vue?style
  </template>
  <pulldown-sina-weibo slot="demo"></pulldown-sina-weibo>
</demo>

为了拉齐客户端的交互效果，在 v2.4.0 版本，pulldown 内部进行了功能的改造并且兼容以前的版本，在一次 pulldown 的操作过程中，内部存在三个流转的状态，并且状态是不可逆的。分别如下：

1. **default**

  初始状态。

2. **moving**

  移动状态，这个状态代表用户的手指正在操控 BetterScroll，手指未移开，在这种状态下，BetterScroll 会派发两个事件。

  - **enterThreshold**

    当 BetterScroll 滚动到 pulldown 的 threshold 阈值区域**之内**的时候派发，在这个事件内部，你可以做文案初始化的逻辑，比如提示用户“下拉刷新”
  
  - **leaveThreshold**

    当 BetterScroll 滚动到 pulldown 的 threshold 阈值区域**之外**的时候派发。你可以提示用户“手指释放刷新”

3. **fetching**

  手指移开的瞬间，触发 pullingDown 事件，执行获取数据的逻辑

状态的变换只可能是 `default -> moving -> fetching` 或者是 `default -> moving`，后者代表用户的手指在释放的瞬间，没有满足触发 pullingDown 事件的条件。



## pullDownRefresh 选项对象

### threshold

  - **类型：** `number`
  - **默认值：** `90`

    配置顶部下拉的距离来决定刷新时机。

### stop

  - **类型：** `number`
  - **默认值：** `40`

    回弹悬停的距离。BetterScroll 在派发 `pullingDown` 钩子之后，会立马执行回弹悬停动画。

:::tip 提示
当 pullDownRefresh 配置为 true 的时候，插件内部使用的是默认的插件选项对象。

```js
const bs = new BScroll('.wrapper', {
  pullDownRefresh: true
})

// 相当于

const bs = new BScroll('.wrapper', {
  pullDownRefresh: {
    threshold: 90,
    stop: 40
  }
})
```
:::

## 实例方法

:::tip 提示
以下方法皆已代理至 BetterScroll 实例，例如：

```js
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'

BScroll.use(PullDown)

const bs = new BScroll('.bs-wrapper', {
  pullDownRefresh: true
})

bs.finishPullDown()
bs.openPullDown({})
bs.autoPullDownRefresh()
```
:::

### `finishPullDown()`

  - **介绍**：结束下拉刷新行为。

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

### `autoPullDownRefresh()`

  - **介绍**：自动执行下拉刷新。

## 事件

### `pullingDown`

- **参数**：无
- **触发时机**：当顶部下拉的距离大于 `threshold` 值时，触发一次 `pullingDown` 钩子。

::: danger 危险
监测到下拉刷新的动作之后，`pullingDown` 钩子的消费机会只有一次，因此你需要调用 `finishPullDown()` 来告诉 BetterScroll 来提供下一次 `pullingDown` 钩子的消费机会。
:::

### `enterThreshold` <Badge text='2.4.0' />

- **参数**：无
- **触发时机**：当 pulldown 正处于 moving 状态，并且**进入** threshold 区域的瞬间。

### `leaveThreshold` <Badge text='2.4.0' />

- **参数**：无
- **触发时机**：当 pulldown 正处于 moving 状态，并且**离开** threshold 区域的瞬间。