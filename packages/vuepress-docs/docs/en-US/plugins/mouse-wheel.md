# mouse-wheel

mouseWheel extends the capabilities of the BetterScroll mouse wheel.

## Install

```bash
npm install @better-scroll/mouse-wheel --save

// or

yarn add @better-scroll/mouse-wheel
```

::: tip
Currently supports mouse wheel: core, slide, wheel, pullup, pulldown plugins.
:::

## Basic Usage

In order to enable the mouseWheel plugin, you need to first import it, register the plugin through the static method `BScroll.use()`, and finally pass in the correct [mouseWheel option](./mouse-wheel.html#mousewheel-options)

```js
  import BScroll from '@better-scroll/core'
  import MouseWheel from '@better-scroll/mouse-wheel'
  BScroll.use(MouseWheel)

  new BScroll('.bs-wrapper', {
    //...
    mouseWheel: {
      speed: 20,
      invert: false,
      easeTime: 300
    }
  })
```

 - **VerticalScroll Demo**

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/vertical-scroll.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/vertical-scroll.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/vertical-scroll.vue?style
    </template>
    <mouse-wheel-vertical-scroll slot="demo"></mouse-wheel-vertical-scroll>
  </demo>

- **HorizontalScroll Demo**

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/horizontal-scroll.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/horizontal-scroll.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/horizontal-scroll.vue?style
    </template>
    <mouse-wheel-horizontal-scroll slot="demo"></mouse-wheel-horizontal-scroll>
  </demo>


## Advanced Usage

The mouseWheel plugin can also be used with other plugins to increase the operation of the mouse wheel.

- **mouseWheel & slide**

  Operate [slide](./slide.html) with the mouse wheel.

  - **HorizontalSlide Demo**

    <demo :hide-qrcode="true">
      <template slot="code-template">
        <<< @/examples/vue/components/mouse-wheel/horizontal-slide.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/mouse-wheel/horizontal-slide.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/mouse-wheel/horizontal-slide.vue?style
      </template>
      <mouse-wheel-horizontal-slide slot="demo"></mouse-wheel-horizontal-slide>
    </demo>

  - **VerticalSlide Demo**

    <demo :hide-qrcode="true">
      <template slot="code-template">
        <<< @/examples/vue/components/mouse-wheel/vertical-slide.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/mouse-wheel/vertical-slide.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/mouse-wheel/vertical-slide.vue?style
      </template>
      <mouse-wheel-vertical-slide slot="demo"></mouse-wheel-vertical-slide>
    </demo>

- **mouseWheel & pullup**

  use mousewheel do [pullup](./pullup.html) operation.

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/pullup.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/pullup.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/pullup.vue?style
    </template>
    <mouse-wheel-pullup slot="demo"></mouse-wheel-pullup>
  </demo>

- **mouseWheel & pulldown**

  use mousewheel do [pulldown](./pulldown.html)  operation.

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/pulldown.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/pulldown.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/pulldown.vue?style
    </template>
    <mouse-wheel-pulldown slot="demo"></mouse-wheel-pulldown>
  </demo>

- **mouseWheel & wheel**

  use mousewheel do [wheel](./wheel.html) operation.

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/picker.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/picker.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/picker.vue?style
    </template>
    <mouse-wheel-picker slot="demo"></mouse-wheel-picker>
  </demo>

## mouseWheel options

### speed

  - **Type**: `number`
  - **Default**: `20`

  The speed at which the mouse wheel scrolls.

### invert

  - **Type**: `boolean`
  - **Default**: `false`

  When the value is true, it means that the scrolling direction of the wheel is opposite to that of BetterScroll.

### easeTime

  - **Type**: `number`
  - **Default**: `300`(ms)

  The duration of the scroll animation.

### discreteTime

  - **Type**: `number`
  - **Default**: `400`(ms)

  Because the mouse wheel is a discrete movement, there is no event type of **start**, **move**, **end**, so as long as no scroll is detected within `discreteTime`, then one scroll wheel action ends.

  ::: warning
  When integrated with [pulldown](./pulldown.html) plugin, `easeTime` and `discreteTime` will be **internally** modified to **reasonable fixed value** to trigger the `pullingDown` hook
  :::

### throttleTime

  - **Type**: `number`
  - **Default**: `0`(ms)

  Since the scroll wheel is a high-frequency action, the trigger frequency can be limited by `throttleTime`. MouseWheel will cache the scrolling distance, and calculate the cached distance and scroll every throttleTime.

  > Modifying throttleTime may cause discontinuous scrolling animation, please adjust it according to the actual scene.

### dampingFactor

  - **Type**: `number`
  - **Default**: `0.1`

  Damping factor, the value range is [0, 1]. When BetterScroll rolls out of the boundary, resistance needs to be applied to prevent the rolling range from being too large. The smaller the value, the greater the resistance.

## Hooks

### alterOptions
  - **Arguments**: `wheelConfig`
    ```typescript
      export interface MouseWheelConfig {
        speed: number
        invert: boolean
        easeTime: number
        discreteTime: number
        throttleTime: number,
        dampingFactor: number
      }
    ```
  - **Triggered Timing**: The mousewheel begins to scroll, allowing to modify options to control certain behaviors during scrolling.

## Events

### mousewheelStart
  - **Arguments**: none
  - **Triggered Timing**: The mousewheel starts.

### mousewheelMove
  - **Arguments**: `{ x, y }`
  - `{ number } x`: The current x of BetterScroll
  - `{ number } y`: The current y of BetterScroll
  - **Type**: `{ x: number, y: number }`
  - **Triggered Timing**: Mousewheel is scrolling

### mousewheelEnd
  - **Arguments**:`delta`
  - **Type**: `WheelDelta`
  ```typescript
    interface WheelDelta {
      x: number
      y: number
      directionX: Direction
      directionY: Direction
    }
  ```
  - **Triggered Timing**: If the mousewheel hook has not been triggered after `discreteTime`, a mousewheel action will be settled.

  ::: danger Note
  Due to the particularity of the mousewheel hook, the dispatch of mousewheelEnd does not mean the end of the scroll animation.
  :::

::: tip
In most scenarios, if you want to know the current scroll position of BetterScroll accurately, please listen to the scroll and scrollEnd hooks instead of the `mouseXXX` hooks.
:::