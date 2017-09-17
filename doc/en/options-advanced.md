# Options / Advanced

BetterScroll also supports several advanced options to implement some special feature.

## wheel
   - type: Boolean | Object
   - default: false
   - usage: the options is used to config picker component. You can enable picker by config an Object, such as, `{selectedIndex: 0,
  rotate: 25, adjustTime: 400}`.
   - remark: this is an advanced option, doesn't need to config in normal scene, specific application scene could refer to [Picker Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/picker). More detail in the source code of [picker component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/picker/picker.vue).

## snap
   - type: Boolean | Object
   - default: false
   - usage: the options is used to config slide component. You can enable slide by config as an Object, such as, ` snap: {loop: false,threshold: 0.1,stepX: 100,stepY: 100}`.
   - remark: this is an advanced option, doesn't need to config in normal scene, specific application scene could refer to [Slide Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/slide). More detail in the source code of [slide component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/slide/slide.vue).

## scrollbar
   - type: Boolean | Object
   - default: false
   - usage: the options is used to config scrollbar, You can enable scrollbar by config as true or an Object. Such as, ` scrollbar: {fade: false}`. And the fade is defaut to be true. See [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll). More detail in the source code of [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

## pullDownRefresh
   - type: Boolean | Object
   - default: false
   - usage: the options is used to config pulling down refresh. You can enable pulling down refresh by config as true or an Object. Such as `pullDownRefresh: { threshold: 50, stop: 20}`, threshold is about the distance cross the border which decide the trigger of pullingDown event. stop is the position when rebound. See [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll). More detail in the source code of [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

## pullUpLoad
   - type: Boolean | Object
   - default: false
   - usage: the options is used to config pulling up load. You can enable pulling up load by config as true or an Object. Such as `pullUoLoad: { threshold: -20}`, threshold is about the distance cross the border which decide the trigger of pullingUp event.See [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll). More detail in the source code of [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

