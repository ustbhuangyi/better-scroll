# 选项 / 高级

better-scroll 还支持一些高级配置，来实现一些特殊的 feature。

## wheel
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置是为了做 Picker 组件用的，默认为 false，如果开启则需要配置一个 Object。
   ```js
     wheel:{
       selectedIndex: 0,
       rotate: 25, 
       adjustTime: 400, 
       wheelWrapperClass: 'wheel-scroll', 
       wheelItemClass: 'wheel-item'
     }
   ```
   - 备注：这是一个高级的配置，一般场景不需要配置，具体应用场景可见 [Picker Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/picker/zh) 。想了解更多的细节可以去看 example 中的 [picker](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/picker/picker.vue) 组件的代码。**注意**：如果配置为 Object 的时候`wheelWrapperClass` 和 `wheelItemClass` 必须对应于你的实例 `better-scroll` 的 `wrapper` 类名和 `wrapper` 内的子类名。二者的默认值是 "`wheel-scroll`"/"`wheel-item`"，如果你不配置或者配置的名称和你对应DOM节点的类名不一致的话会导致一个问题：滚动起来的时候点击一下终止滚动并不会触发 `scrollEnd` 事件，进而影响诸如城市选择器联动数据的这种组件的结果。

## snap
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置是为了做 Slide 组件用的，默认为 false，如果开启则需要配置一个 Object，例如：
   ```js
    snap: {
      loop: false,
      threshold: 0.1,
      stepX: 100,
      stepY: 100,
      easing: {
        style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fn: function(t) {
          return t * (2 - t)
        }
      }
    }
   ``` 
   注意：`loop` 为 true 是为了支持循环轮播，`threshold` 表示可滚动到下一个的阈值，`easing` 表示滚动的缓动函数。
   - 备注：这是一个高级的配置，一般场景不需要配置，具体应用场景可见 [Slide Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/slide/en) 。想了解更多的细节可以去看 example 中的 [slide](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/slide/slide.vue) 组件的代码。

## scrollbar
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置可以开启滚动条，默认为 false。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，例如：
   ```js
    scrollbar: {
      fade: true,
      interactive: false // 1.8.0 新增
    }
  ```
   `fade` 为 true 表示当滚动停止的时候滚动条是否需要渐隐，`interactive` 表示滚动条是否可以交互。
   见 [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll/zh) 。了解更多的细节可以去看 example 中的 [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue) 组件代码。

## pullDownRefresh
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，例如：
   ```js
     pullDownRefresh: {
       threshold: 50,
       stop: 20
     }
   ```
   可以配置顶部下拉的距离（`threshold`） 来决定刷新时机以及回弹停留的距离（`stop`）。当下拉刷新数据加载完毕后，需要执行 [`finishPullDown`](/api-specific.html#finishpulldown) 方法。见 [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll/zh) 。
   了解更多的细节可以去看 example 中的 [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue) 组件代码。

## pullUpLoad
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，例如：
   ```js
     pullUpLoad: {
       threshold: 50
     }
   ```
   可以配置离（`threshold`）来决定开始加载的时机。当上拉加载数据加载完毕后，需要执行 [`finshiPullUp`](/api-specific.html#finishpullup) 方法。见 [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll/zh) 。
   了解更多的细节可以去看 example 中的 [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue) 组件代码。
   
## mouseWheel(v1.8.0+)   
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置用于 PC 端的鼠标滚轮，默认为 false，。当设置为 true 或者是一个 Object 的时候，可以开启鼠标滚轮，例如：
  ```js
    mouseWheel: {
      speed: 20,
      invert: false
    }
  ``` 
  `speed` 表示鼠标滚轮滚动的速度，`invert` 为 true 表示滚轮滚动和时机滚动方向相反，见[Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/free-scroll/zh)。
   

  

