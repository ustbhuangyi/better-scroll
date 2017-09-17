# Options / Advanced

better-scroll also supports several advanced options to implement some special feature.

## wheel
   - Type: Boolean | Object.
   - Default: false.
   - Usage: the options is used to configure picker component. You can enable picker by configure an Object, such as, `{selectedIndex: 0,
  rotate: 25, adjustTime: 400}`.
   - Remark: this is an advanced option, doesn't need to configure in normal scene, specific application scene could refer to [Picker Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/picker). More detail in the source code of [picker component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/picker/picker.vue).

## snap
   - Type: Boolean | Object.
   - Default: false.
   - Usage: the option is used to configure slide component. You can enable slide by configure as an Object, such as, ` snap: {loop: false,threshold: 0.1,stepX: 100,stepY: 100}`.
   - Remark: this is an advanced option, doesn't need to configure in normal scene, specific application scene could refer to [Slide Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/slide). More detail in the source code of [slide component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/slide/slide.vue).

## scrollbar
   - Type: Boolean | Object.
   - Default: false.
   - Usage: the option is used to configure scrollbar, You can enable scrollbar by configure as true or an Object. Such as, ` scrollbar: {fade: false}`. And the fade is default to be true. See [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll). More detail in the source code of [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

## pullDownRefresh
   - Type: Boolean | Object.
   - Default: false.
   - Usage: the option is used to configure pulling down refresh. You can enable pulling down refresh by configure as true or an Object. Such as `pullDownRefresh: { threshold: 50, stop: 20}`, threshold is about the distance cross the border which decide the trigger of pullingDown event. stop is the position when rebound. See [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll). More detail in the source code of [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

## pullUpLoad
   - Type: Boolean | Object.
   - Default: false.
   - Usage: the option is used to configure pulling up load. You can enable pulling up load by configure as true or an Object. Such as `pullUoLoad: { threshold: -20}`, threshold is about the distance cross the border which decide the trigger of pullingUp event.See [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll). More detail in the source code of [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

