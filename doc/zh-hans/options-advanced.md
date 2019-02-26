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
       wheelItemClass: 'wheel-item',
       wheelDisabledItemClass: 'wheel-disabled-item' // version 1.15.0 支持
     }
   ```
   - 备注：这是一个高级的配置，一般场景不需要配置，具体应用场景可见 [Picker Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/picker/zh) 。想了解更多的细节可以去看 example 中的 [picker](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/picker/picker.vue) 组件的代码。

   **注意**：

   1.如果配置为 Object 的时候，`wheelWrapperClass` 和 `wheelItemClass` 必须对应于你的实例 `better-scroll` 的 `wrapper` 类名和 `wrapper` 内的子类名。二者的默认值是 "`wheel-scroll`"/"`wheel-item`"，如果你不配置或者配置的名称和你对应DOM节点的类名不一致的话会导致一个问题：滚动起来的时候点击一下终止滚动并不会触发 `scrollEnd` 事件，进而影响诸如城市选择器联动数据的这种组件的结果。

   2.`wheelDisabledItemClass` 是用于配置禁止选中某选项的样式类名。better-scroll 实例上的属性 `selectedIndex` 是表示当前选中项的索引，如果你配置的选项都是禁止选中的状态，那么 `selectedIndex` 一直保持为 -1。我们是参照 [Web select 标签](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select) 的交互实现的。

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
   注意：`loop` 为 true 是为了支持循环轮播，但只有一个元素的时候，`loop` 为 true 是无效的，也并不会 clone 节点。`threshold` 表示可滚动到下一个的阈值，`easing` 表示滚动的缓动函数。
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
   可以配置离（`threshold`）来决定开始加载的时机。当上拉加载数据加载完毕后，需要执行 [`finishPullUp`](/api-specific.html#finishpullup) 方法。见 [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll/zh) 。
   了解更多的细节可以去看 example 中的 [scroll](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue) 组件代码。

## mouseWheel(v1.8.0+)
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置用于 PC 端的鼠标滚轮，默认为 false，。当设置为 true 或者是一个 Object 的时候，可以开启鼠标滚轮，例如：
  ```js
    mouseWheel: {
      speed: 20,
      invert: false,
      easeTime: 300
    }
  ```
  `speed` 表示鼠标滚轮滚动的速度，`invert` 为 true 表示滚轮滚动和时机滚动方向相反，`easeTime` 表示滚动动画的缓动时长，见[Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/free-scroll/zh)。

## zoom(v1.11.0+)
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置用于对滚动内容的缩放，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启缩放，例如：
  ```js
    zoom: {
      start: 1,
      min: 1,
      max: 4
    }
  ```
  `start` 表示开始的缩放比例，`min` 表示最小缩放比例，`max` 表示最大缩放比例。


## infinity(v1.12.0+)
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：该配置的使用场景是长列表滚动或者是无限滚动，默认为 false。如果开启需要配置成一个对象，实现 3 个函数，例如：
   ```js
     infinity: {
       fetch(count) {
          // 获取大于 count 数量的数据，该函数是异步的，它需要返回一个 Promise。
          // 成功获取数据后，你需要 resolve 数据数组（也可以 resolve 一个 Promise）。
          // 数组的每一个元素是列表数据，在 render 方法执行的时候会传递这个数据渲染。
          // 如果没有数据的时候，你可以 resolve(false)，来告诉无限滚动列表已经没有更多数据了。
       }
       render(item, div) {
          // 渲染每一个元素节点，item 是数据，div 是包裹元素节点的容器。
          // 该函数需要返回渲染后的 DOM 节点。
       },
       createTombstone() {
         // 返回一个墓碑 DOM 节点。
       }
     }
   ```
   具体的示例代码可以[参考这里](https://github.com/ustbhuangyi/better-scroll/blob/master/example/pages/infinity.vue)，对应的演示 [demo](https://ustbhuangyi.github.io/better-scroll/#/examples/infinity/zh)。
   infinity 的实现参考了[这篇文章](https://www.jianshu.com/p/4e16b4211d84)，并在此基础上加入了滚动结束的能力。
   注意：除非你有大量的数据渲染需求，否则使用普通的滚动即可。

