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

## pullDownRefresh Options

### threshold

  - **Type**: `number`
  - **Default**: `90`

  Configure the top pull-down distance to determine dispatching `pullingDown` hooks.

### stop

  - **Type**: `number`
  - **Default**: `40`

  Rebound distance. After BetterScroll dispatches the `pullingDown` hook, it will immediately execute the rebound animation.

## Instance Methods

:::tip
All methdos are proxied to BetterScroll instance, for example:

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
  - **Trigger**:A `pullingDown` event is fired when the top pull-down distance is greater than the `threshold` value after touchend.

::: danger Note
After the pull-down refresh action is detected, the consumption opportunity of the `pullingDown` hook is only once, so you need to call `finishPullDown()` to tell BetterScroll to provide the next consumption opportunity of the `pullingDown` event.
:::