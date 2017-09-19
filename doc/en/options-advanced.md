# Advanced Options

better-scroll also supports several advanced options to implement some special features.

## wheel
   - Type: `Boolean | Object`
   - Default: `false`
   - Usage: this option is used to configure picker component. You can enable picker by configure it as an Object, like `{selectedIndex: 0,
  rotate: 25, adjustTime: 400}`.
   - Note: it's an advanced option which doesn't need to configure in normal scene. You can see the specific application scene in [Picker Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/picker) and more details in the source code of [picker component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/picker/picker.vue).

## snap
   - Type: `Boolean | Object`
   - Default: `false`
   - Usage: this option is used to configure slide component. You can enable slide by configure it as an Object, such as, ` snap: {loop: false,threshold: 0.1,stepX: 100,stepY: 100}`.
   - Note: it's an advanced option which doesn't need to configure in normal scene. You can see the specific application scene in [Slide Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/slide) and more details in the source code of [slide component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/slide/slide.vue).

## scrollbar
   - Type: `Boolean | Object`
   - Default: `false`
   - Usage: this option is used to configure scroll bar. You can enable scroll bar by configure it as true or an Object, like ` scrollbar: {fade: false}`. Fade is about whether the scroll bar fade when scroll stop, and it's true by default. You can see [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll) and more details in the source code of [scroll component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

## pullDownRefresh
   - Type: `Boolean | Object`
   - Default: `false
   - Usage: this option is used to configure pulling down refresh. You can enable pulling down refresh by configure it as true or an Object, like `pullDownRefresh: { threshold: 50, stop: 20}`. Threshold is about the distance exceeded the border which decide the trigger of pullingDown event. Stop is the position where rebound stop at. You can see [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll) and more details in the source code of [scroll component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

## pullUpLoad
   - Type: `Boolean | Object`
   - Default: `false`
   - Usage: this option is used to configure pulling up load. You can enable pulling up load by configure it as true or an Object, like `pullUoLoad: { threshold: -20}`. Threshold is about the distance exceeded the border which decide the trigger of pullingUp event. You can see [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll) and more details in the source code of [scroll component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

