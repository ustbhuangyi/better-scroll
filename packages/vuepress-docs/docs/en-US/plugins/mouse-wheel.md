# mouse-wheel

mouseWheel extends the capabilities of the BetterScroll mouse wheel.

# Install

```bash
npm install @better-scroll/mouse-wheel@next --save

// or

yarn add @better-scroll/mouse-wheel@next
```

:::tip
Currently supports mouse wheel: core, slide, wheel plugins.
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

- **Demo**

    <demo :hide-qrcode="true">
      <template slot="code-template">
        <<< @/examples/vue/components/core/mouse-wheel.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/core/mouse-wheel.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/core/mouse-wheel.vue?style
      </template>
      <core-mouse-wheel slot="demo"></core-mouse-wheel>
    </demo>

## Advanced Usage

The mouseWheel plugin can also be used with other plugins to increase the operation of the mouse wheel.

- **mouseWheel & slide**

  Operate [slide](./slide.html) with the mouse wheel.

  ```js
    import BScroll from '@better-scroll/core'
    import MouseWheel from '@better-scroll/mouse-wheel'
    import Slide from '@better-scroll/slide'

    BScroll.use(MouseWheel)
    BScroll.use(Slide)

    new BScroll('.bs-wrapper', {
      scrollX: true,
      scrollY: false,
      slide: {
        loop: true,
        threshold: 100
      },
      momentum: false,
      bounce: false,
      stopPropagation: true,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    })
  ```

  - **Demo**
  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/slide/pc.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/slide/pc.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/slide/pc.vue?style
    </template>
    <slide-pc slot="demo"></slide-pc>
  </demo>

## mouseWheel options

### speed

- **Type**：`number`
- **Default**：`20`

  The speed at which the mouse wheel scrolls.

### invert

- **Type**：`boolean`
- **Default**：`false`

  When the value is true, it means that the scrolling direction of the wheel is opposite to that of BetterScroll.

### easeTime

- **Type**：`number`
- **Default**: `300`(ms)

  The duration of the scroll animation.

### discreteTime

- **Type**：`number`
- **Default**: `400`(ms)

  Because the mousw wheel is a discrete movement, there is no event type of **start**, **move**, **end**, so as long as no scroll is detected within `discreteTime`, then one scroll wheel action ends.

### throttleTime

- **Type**：`number`
- **Default**: `0`(ms)

  Since the scroll wheel is a high-frequency action, the trigger frequency can be limited by `throttleTime`. MouseWheel will cache the scrolling distance, and calculate the cached distance and scroll every throttleTime.

  > Modifying throttleTime may cause discontinuous scrolling animation, please adjust it according to the actual scene.
