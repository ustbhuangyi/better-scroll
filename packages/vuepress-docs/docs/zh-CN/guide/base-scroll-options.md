# 配置项

BetterScroll 支持很多参数配置，可以在初始化的时候传入第二个参数，比如：

``` js
import BScroll from '@better-scroll/core'
let scroll = new BScroll('.wrapper',{
    scrollY: true,
    click: true
})
```

这样就实现了一个具有纵向可点击的滚动效果的列表。BetterScroll 支持的参数非常多，接下来我们来列举 BetterScroll 支持的参数。

## startX
  - **类型**：`number`
  - **默认值**：`0`
  - **作用**：横轴方向初始化位置。

## startY
  - **类型**：`number`
  - **默认值**：`0`
  - **作用**：纵轴方向初始化位置。

## scrollX
  - **类型**：`boolean`
  - **默认值**： `false`
  - **作用**：当设置为 true 的时候，可以开启横向滚动。
  - **备注**：当设置 [eventPassthrough](./base-scroll-options.html#eventpassthrough) 为 'horizontal' 的时候，该配置无效。

## scrollY
  - **类型**：`boolean`
  - **默认值**：`true`
  - **作用**：当设置为 true 的时候，可以开启纵向滚动。
  - **备注**：当设置 [eventPassthrough](./base-scroll-options.html#eventpassthrough) 为 'vertical' 的时候，该配置无效。

## freeScroll
  - **类型**：`boolean`
  - **默认值**：`false`
  - **作用**：在默认情况下，由于人的手指无法做到绝对垂直或者水平的运动，因此在一次手指操作的过程中，都会存在横向以及纵向的偏移量，内部默认会摒弃偏移量较小的一个方向，保留另一个方向的滚动。但是在某些场景我们需要同时计算横向以及纵向的手指偏移距离，而不是只计算偏移量较大的一个方向，这个时候我们只要设置 `freeScroll` 为 true 即可。
  - **备注**：当设置 [eventPassthrough](./base-scroll-options.html#eventpassthrough) 不为空的时候，该配置无效。
  - **示例**：
  ```js
  // 手指起点的坐标 e1: { pageX: 120, pageY: 120 }
  // 手指终点的坐标 e2: { pageX: 121, pageY: 140 }
  // offsetX:  e2.pageX - e1.pageX = 1
  // offsetY:  e2.pageY - e1.pageY = 20
  // 如果 freeScroll 为 false， 由于 offsetY > offsetX + directionLockThreshold
  // offsetX 被重置为 0， 只保留 offsetY 的偏移量，因此只做一次纵向滚动
  ```

## directionLockThreshold
  - **类型**：`number`
  - **默认值**：`5`
  - **作用**：当 `freeScroll` 为 false 的情况，我们需要锁定只滚动一个方向的时候，我们在**初始滚动**的时候根据横轴和纵轴滚动的绝对值做差，当差值大于 `directionLockThreshold` 的时候来决定滚动锁定的方向。
  - **备注**：当设置 [eventPassthrough](./base-scroll-options.html#eventpassthrough) 的时候，`directionLockThreshold` 设置无效，始终为 0。

## eventPassthrough
  - **类型**： `string`
  - **默认值**：`''`
  - **可选值**：`'vertical' | 'horizontal'`
  - **作用**：有时候我们使用 BetterScroll 在某个方向模拟滚动的时候，希望在另一个方向保留原生的滚动（比如轮播图，我们希望横向模拟横向滚动，而纵向的滚动还是保留原生滚动，我们可以设置 `eventPassthrough` 为 vertical；相应的，如果我们希望保留横向的原生滚动，可以设置`eventPassthrough`为 horizontal）。
  - **备注**：`eventPassthrough` 的设置会导致其它一些选项配置无效，需要小心使用它。

## click
  - **类型**：`boolean`
  - **默认值**：`false`
  - **作用**：BetterScroll 默认会阻止浏览器的原生 click 事件。当设置为 true，BetterScroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 `_constructed`，值为 true。


## dblclick
  - **类型**：`boolean | Object`
  - **默认值**：`false`
  - **作用**：派发双击点击事件。当配置成 true 的时候，默认 2 次点击的延时为 300 ms，如果配置成对象可以修改 `delay`。
  ```js
    dblclick: {
      delay: 300
    }
  ```

## tap
  - **类型**：`string`
  - **默认值**：`''`
  - **作用**：因为 BetterScroll 会阻止原生的 click 事件，我们可以设置 tap 为 'tap'，它会在区域被点击的时候派发一个 tap 事件，你可以像监听原生事件那样去监听它。

## bounce
   - **类型**：`boolean | Object`
   - **默认值**：`true`
   - **作用**：当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画。
   ```js
     bounce: {
       top: true,
       bottom: true,
       left: true,
       right: true
     }
   ```
   `bounce` 可以支持关闭某些边的回弹效果，可以设置对应边的 `key` 为 `false` 即可。

  :::tip
  如果想要便捷的设置所有边为 true 或者 false，只需要设置 `bounce` 为 true 或 false 即可。
  :::

## bounceTime
   - **类型**：`number`
   - **默认值**：`800`（单位ms）
   - **作用**：设置回弹动画的动画时长。

## momentum
   - **类型**：`boolean`
   - **默认值**：`true`
   - **作用**：当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画。设置为 true 则开启动画。

## momentumLimitTime
   - **类型**：`number`
   - **默认值**：`300`（单位ms）
   - **作用**：只有在屏幕上快速滑动的时间小于 `momentumLimitTime`，才能开启 momentum 动画。

## momentumLimitDistance
   - **类型**：`number`
   - **默认值**：`15`（单位px）
   - **作用**：只有在屏幕上快速滑动的距离大于 `momentumLimitDistance`，才能开启 momentum 动画。

## swipeTime
   - **类型**：`number`
   - **默认值**：`2500`（单位ms）
   - **作用**：设置 momentum 动画的动画时长。

## swipeBounceTime
   - **类型**：`number`
   - **默认值**：`500`（单位ms）
   - **作用**：设置当运行 momentum 动画时，超过边缘后的回弹整个动画时间。

## deceleration
   - **类型**：`number`
   - **默认值**：`0.0015`
   - **作用**：表示 momentum 动画的减速度。

## flickLimitTime
   - **类型**：`number`
   - **默认值**：`200`（单位ms）
   - **作用**：有的时候我们要捕获用户的轻拂动作（短时间滑动一个较短的距离）。只有用户在屏幕上滑动的时间小于 `flickLimitTime` ，才算一次轻拂。

## flickLimitDistance
   - **类型**：`number`
   - **默认值**：`100`（单位px）
   - **作用**：只有用户在屏幕上滑动的距离小于 `flickLimitDistance` ，才算一次轻拂。

## resizePolling
   - **类型**：`number`
   - **默认值**：`60`（单位ms)
   - **作用**：当窗口的尺寸改变的时候，需要对 BetterScroll 做重新计算，为了优化性能，我们对重新计算做了延时。60ms 是一个比较合理的值。

## probeType
   - **类型**：`number`
   - **默认值**：`0`
   - **可选值**：`1|2|3`
   - **作用**：决定是否派发 scroll 事件，对页面的性能有影响，尤其是在 `useTransition` 为 true 的模式下。

   ```js
   // 派发 scroll 的场景分为两种：
   // 1. 手指作用在滚动区域（content DOM）上;
   // 2. 调用 scrollTo 方法或者触发 momentum 滚动动画（其实底层还是调用 scrollTo 方法）
   
   // 对于 v2.1.0 版本，对 probeType 做了一次统一
   
   // 1. probeType 为 0，在任何时候都不派发 scroll 事件，
   // 2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
   // 3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
   // 4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
   ```

## preventDefault
   - **类型**：`boolean`
   - **默认值**：`true`
   - **作用**：当事件派发后是否阻止浏览器默认行为。这个值应该设为 true，除非你真的知道你在做什么，通常你可能用到的是 `preventDefaultException`。

## preventDefaultException
   - **类型**：`Object`
   - **默认值**：`{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/}`
   - **作用**：BetterScroll 会阻止原生的滚动，这样也同时阻止了一些原生组件的默认行为。这个时候我们不能对这些元素做 preventDefault，所以我们可以配置 preventDefaultException。默认值 `{tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/}`表示标签名为 input、textarea、button、select、audio 这些元素的默认行为都不会被阻止。
   - **备注**：这是一个非常有用的配置，它的 key 是 DOM 元素的属性值，value 可以是一个正则表达式。比如我们想配一个 class 名称为 test 的元素，那么配置规则为 `{className:/(^|\s)test(\s|$)/}`。

## tagException
   - **类型**：`Object`
   - **默认值**：`{ tagName: /^TEXTAREA$/ }`
   - **作用**：如果 BetterScroll 嵌套了 textarea 等表单元素，往往用户的预期应该是滑动 textarea 不应该引起 bs 滚动，也就是如果操纵的 DOM（eg：textarea 标签） 命中了配置的规则，bs 不会滚动。
   - **备注**：这是一个非常有用的配置，它的 key 是 DOM 元素的属性值，value 可以是一个正则表达式。比如我们想配一个 classname 含有 test 类名的元素，那么配置规则为 `{className:/(^|\s)test(\s|$)/}`。

## HWCompositing
   - **类型**：`boolean`
   - **默认值**：`true`
   - **作用**：是否开启硬件加速，开启它会在 content 元素上添加 `translateZ(1px)` 来开启硬件加速从而提升动画性能，有很好的滚动效果。
   - **备注**：只有支持硬件加速的浏览器开启才有效果。

## useTransition
   - **类型**：`boolean`
   - **默认值**：`true`
   - **作用**：是否使用 CSS3 transition 动画。如果设置为 false，则使用 requestAnimationFrame 做动画。

## bindToWrapper
   - **类型**：`boolean`
   - **默认值**：`false`
   - **作用**：touchmove 事件通常会绑定到 document 上而不是滚动的容器（wrapper）上，当移动的过程中光标（通常对于 PC 场景）离开滚动的容器滚动仍然会继续，这通常是期望的。当然你也可以把 move 事件绑定到滚动的容器上，`bindToWrapper` 设置为 true 即可，这样一旦移动的过程中光标离开滚动的容器，滚动会立刻停止。
   - **注意**：对于移动端来说，就算 touchmove 事件绑定在 wrapper 上，手指离开 wrapper，依然能移动 wrapper。

## disableMouse
   - **类型**：`boolean`
   - **默认值**：根据当前浏览器环境计算而来
   - **作用**：当在移动端环境（支持 touch 事件），disableMouse 会计算为 true，这样就不会监听鼠标相关的事件，而在 PC 环境，disableMouse 会计算为 false，就会监听鼠标相关事件。

## disableTouch
   - **类型**：`boolean`
   - **默认值**：根据当前浏览器环境计算而来
   - **作用**：当在移动端环境（支持 touch 事件），disableTouch 会计算为 false，监听 touch 相关的事件，而在 PC 环境，disableTouch 会计算为 true，不会监听 touch 相关事件。

  ::: warning
  考虑到用户的一些特定场景，比如在**平板电脑需要支持 touch 事件，平板电脑接入鼠标又得支持 mouse 事件**，那么实例化 BetterScroll 需要如下配置：

  ```js
  let bs = new BScroll('.wrapper', {
    disableMouse: false,
    disableTouch: false
  })
  ```

  由于不同设备、不同浏览器环境的底层实现逻辑不同，BetterScroll 内部计算是否监听 touch 还是 mouse 事件可能会有判断失误，因此你可以根据以上的选项配置来解决这类问题。
  :::

## autoBlur
   - **类型**：`boolean`
   - **默认值**：`true`
   - **作用**：在滚动之前会让当前激活的元素（input、textarea）自动失去焦点。

## stopPropagation
   - **类型**：`boolean`
   - **默认值**：`false`
   - **作用**：是否阻止事件冒泡。多用在嵌套 scroll 的场景。

## bindToTarget
   - **类型**：`boolean`
   - **默认值**：`false`
   - **作用**：将 touch 或者 mouse 事件绑定在 `content` 元素而不是容器 `wrapper`上，多用于 [movable 场景](../plugins/movable.html)。

## autoEndDistance
   - **类型**：`number`
   - **默认值**：`5`
   - **作用**：当手指操作幅度过大，滑出视口导致可能没有触发 touchend 事件，因此 autoEndDistance 的作用就是当手指即将脱离当前视口的时候，自动调用 touchend 事件。默认距离边界 5px 的时候，结束滚动。

## outOfBoundaryDampingFactor
   - **类型**：`number`
   - **默认值**：`1 / 3`
   - **作用**：当超过边界的时候，进行阻尼行为，阻尼因子越小，阻力越大，取值范围：[0, 1]。

## specifiedIndexAsContent<sup>(2.0.4)</sup>
   - **类型**：`number`
   - **默认值**：`0`
   - **作用**：指定 `wrapper` 对应索引的子元素作为 `content`，默认情况下 BetterScroll 采用的是 `wrapper` 的第一个子元素作为 content。

   ```html
   <div class="wrapper">
      <div class="content1">
         <div class="conten1-item">1.1</div>
         <div class="conten1-item">1.2</div>
      </div>
      <div class="content2">
         <div class="conten2-item">2.1</div>
         <div class="conten2-item">2.2</div>
      </div>
   </div>   
   ```

   ```js
   // 针对以上 DOM 结构，在 BetterScroll 版本 <= 2.0.3，内部只会使用 wrapper.children[0]，也就是 div.content1 作为 content
   // 当 版本 >= 2.0.4 的时候，可以通过 specifiedIndexAsContent 配置项来指定 content

   let bs = new BScroll('.wrapper', {
      specifiedIndexAsContent: 1 // 使用 div.content2 作为 BetterScroll 的 content
   })
   ```