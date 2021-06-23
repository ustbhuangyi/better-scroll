# pulldown

## Introduction

The pulldown plugin provides BetterScroll with the ability to monitor pulldown operation.

## Install

```bash
npm install @better-scroll/pull-down --save

// or

yarn add @better-scroll/pull-down
```

## Usage

First, install the plugin via the static method `BScroll.use()`

```js
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'

BScroll.use(PullDown)
```

pass in the correct configuration in [options](./pulldown.html#pulldownrefresh-options), for example:

```js
new BScroll('.bs-wrapper', {
  pullDownRefresh: true
})
```

## Demo

- **Basic Usage**

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

- **Sina-Weibo <Badge text='2.4.0' />**

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

In order to match the effects of App, in version v2.4.0, pulldown has made some changes and is compatible with previous versions. During a pulldown procedure, there are three internal circulation states, and the states are irreversible. They are as follows:

1. **default**

  The initial state.

2. **moving**

  Moving state, this state represents that the user's finger is manipulating BetterScroll, and the finger is keeping in touch. In this state, BetterScroll will dispatch two events.

  - **enterThreshold**

    Dispatched when BetterScroll scrolls **into** the pulldown threshold area. Inside this event, you can do the logic of texts initialization, such as prompting the user to "pull down to refresh"
  
  - **leaveThreshold**

    Dispatched when BetterScroll scrolls **out of** the pulldown threshold area. You can prompt the user to "Release finger"

3. **fetching**

  Once the finger went away, the pullingDown event is triggered to execute the logic of fetching data

The state change can only be `default -> moving -> fetching` or `default -> moving`. The latter means that at the moment the user's finger is released, the conditions for triggering the pullingDown event are not met.

## pullDownRefresh Options

### threshold

  - **Type**: `number`
  - **Default**: `90`

  Configure the top pull-down distance to determine dispatching `pullingDown` hooks.

### stop

  - **Type**: `number`
  - **Default**: `40`

  Rebound distance. After BetterScroll dispatches the `pullingDown` hook, it will immediately execute the rebound animation.

:::tip
When `pullDownRefresh` is configured as `true`, the plugin uses the default plugin option.

```js
const bs = new BScroll('.wrapper', {
  pullDownRefresh: true
})

// equals

const bs = new BScroll('.wrapper', {
  pullDownRefresh: {
    threshold: 90,
    stop: 40
  }
})
```
:::

## Instance Methods

:::tip
All methods are proxied to BetterScroll instance, for example:

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

  - **Details**: End the pull-down refresh behavior.

  ::: warning
  Every time the `pullingDown` hook is triggered, you should **actively call** `finishPullDown()` to tell BetterScroll to be ready for the next pullingDown hook.
  :::

### `openPullDown(config: PullDownRefreshOptions = {})`

  - **Details**: Turn on the pull-down refresh dynamically.
  - **Arguments**:
    - `{ PullDownRefreshOptions } config`: Modify the option of the pulldown plugin
    - `PullDownRefreshOptions`:

    ```typescript
    export type PullDownRefreshOptions = Partial<PullDownRefreshConfig> | true

    export interface PullDownRefreshConfig {
      threshold: number
      stop: number
    }
    ```

  ::: warning
  The **openPullDown** method should be used with **closePullDown**, because in the process of generating the pulldown plugin, the pull-down refresh action has been automatically monitored.
  :::

### `closePullDown()`

  - **Details**: Turn off the pull-down refresh dynamically.

## Events

### `pullingDown`

  - **Arguments**: None
  - **Trigger**: A `pullingDown` event is fired when the top pull-down distance is greater than the `threshold` value after touchend.

::: danger Note
After the pull-down refresh action is detected, the consumption opportunity of the `pullingDown` hook is only once, so you need to call `finishPullDown()` to tell BetterScroll to provide the next consumption opportunity of the `pullingDown` event.
:::

### `enterThreshold` <Badge text='2.4.0' />

  - **Arguments**: None
  - **Trigger**: when pulldown is in the **moving** state and **enters** threshold area.

### `leaveThreshold` <Badge text='2.4.0' />

  - **Arguments**: None
  - **Trigger**: when pulldown is in the **moving** state and **leaves** threshold area.