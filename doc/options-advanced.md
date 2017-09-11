# 选项 / 高级

better-scroll 还支持一些高级配置，来实现一些特殊的 feature。
   
## wheel
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置是为了做 picker 组件用的，默认为 false，如果开启则需要配置一个 Object，例如：`{selectedIndex: 0,
  rotate: 25, adjustTime: 400}`。 
   - 备注：这是一个高级的配置，一般场景不需要配置，具体应用场景可见 [Picker Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/picker) 。想了解更多的细节可以去看 example 中的 [picker](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/picker/picker.vue) 组件的代码。

## snap
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置是为了做 slide 组件用的，默认为 false，如果开启则需要配置一个 Object，例如：` * snap: {loop: false,threshold: 0.1,stepX: 100,stepY: 100}`。
   - 备注：这是一个高级的配置，一般场景不需要配置，具体应用场景可见 [Slide Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/slide) 。想了解更多的细节可以去看 example 中的 [slide](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/slide/slide.vue) 组件的代码。

## scrollbar
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置可以开启滚动条，默认为 false。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，默认是会 fade 的，见 [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll) 。了解更多的细节可以去看 example 中的 [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue) 组件代码。

## pullDownRefresh
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop），见 [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll) 。了解更多的细节可以去看 example 中的 [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue) 组件代码。

## pullUpLoad
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机，见 [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll) 。了解更多的细节可以去看 example 中的 [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue) 组件代码。

