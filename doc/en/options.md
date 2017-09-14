# 选项 / 基础

better-scroll 支持很多参数配置，可以在初始化的时候传入第二个参数，比如：
``` js
let scroll = new BScroll('.wrapper',{
    scrollY: true,
    click: true
})
```
这样就实现了一个纵向可点击的滚动效果。better-scroll 支持的参数非常多，可以修改它们去实现更多的 feature。通常你可以不改这些参数（列出不建议修改的参数），better-scroll 已经为你实现了最佳效果，接下来我们来列举 better-scroll 支持的参数。

## startX
  - 类型：Number,
  - 默认值：0
  - 作用：横轴方向初始化位置。
 
## startY
  - 类型：Number,
  - 默认值：0
  - 作用：纵轴方向初始化位置，见 [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll) 。

## scrollX
  - 类型：Boolean
  - 默认值: false
  - 作用：当设置为 true 的时候，可以开启横向滚动。
  - 备注：当设置 [eventPassthrough](/options.html#eventpassthrough) 为 'horizontal' 的时候，该配置无效。
 
## scrollY
  - 类型：Boolean
  - 默认值：true
  - 作用：当设置为 true 的时候，可以开启纵向滚动。
  - 备注：当设置 [eventPassthrough](/options.html#eventpassthrough) 为 'vertical' 的时候，该配置无效。
  
## freeScroll
  - 类型：Boolean
  - 默认值：false
  - 作用：有些场景我们需要支持横向和纵向同时滚动，而不仅限制在某个方向，这个时候我们只要设置 `freeScroll` 为 true 即可。
  - 备注：当设置 [eventPassthrough](/options.html#eventpassthrough) 不为空的时候，该配置无效。
  
## directionLockThreshold
  - 类型：Number
  - 默认值：5（不建议修改）
  - 作用：当我们需要锁定只滚动一个方向的时候，我们在**初始滚动**的时候根据横轴和纵轴滚动的绝对值做差，当差值大于 `directionLockThreshold` 的时候来决定滚动锁定的方向。
  - 备注：当设置 [eventPassthrough](/options.html#eventpassthrough) 的时候，`directionLockThreshold` 设置无效，始终为 0。

## eventPassthrough
  - 类型： String
  - 默认值：''
  - 可选值：'vertical'、'horizontal'
  - 作用：有时候我们使用 better-scroll 在某个方向模拟滚动的时候，希望在另一个方向保留原生的滚动（比如轮播图，我们希望横向模拟横向滚动，而纵向的滚动还是保留原生滚动，我们可以设置 `eventPassthrough` 为 vertical；相应的，如果我们希望保留横向的原生滚动，可以设置`eventPassthrough`为 horizontal）。
  - 备注：`eventPassthrough` 的设置会导致其它一些选项配置无效，需要小心使用它。
  
## click
  - 类型：Boolean
  - 默认值：false
  - 作用：better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。但是自定义的 click 事件会阻止一些原生组件的行为，如 checkbox 的选中等，所以一旦滚动列表中有一些原生表单组件，推荐的做法是监听 tap 事件，如下。
  
## tap
  - 类型：Boolean | String
  - 默认值：false
  - 作用：因为 better-scroll 会阻止原生的 click 事件，我们可以设置 tap 为 true，它会在区域被点击的时候派发一个 tap 事件，你可以像监听原生事件那样去监听它，如 `element.addEventListener('tap', doSomething, false);`。如果 tap 设置为字符串, 那么这个字符串就作为自定义事件名称。如 `tap: 'myCustomTapEvent'`。
  
## bounce
   - 类型：Boolean
   - 默认值：true
   - 作用：当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画。
   
## bounceTime
   - 类型：Number
   - 默认值：700（单位ms，不建议修改）
   - 作用：设置回弹动画的动画时长。

## momentum
   - 类型：Boolean
   - 默认值：true
   - 作用：当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画。设置为 true 则开启动画。
   
## momentumLimitTime
   - 类型：Number
   - 默认值：300（单位ms，不建议修改）
   - 作用：只有在屏幕上快速滑动的时间小于 `momentumLimitTime`，才能开启 momentum 动画。
   
## momentumLimitDistance
   - 类型：Number
   - 默认值：15（单位px，不建议修改）
   - 作用：只有在屏幕上快速滑动的距离大于 `momentumLimitDistance`，才能开启 momentum 动画。
   
## swipeTime
   - 类型：Number
   - 默认值：2500（单位ms，不建议修改）
   - 作用：设置 momentum 动画的动画时长。

## swipeBounceTime
   - 类型：Number
   - 默认值：500（单位ms，不建议修改）
   - 作用：设置当运行 momentum 动画时，超过边缘后的回弹整个动画时间。
   
## deceleration
   - 类型：Number
   - 默认值：0.001（不建议修改）
   - 作用：表示 momentum 动画的减速度。
   
## flickLimitTime
   - 类型：Number
   - 默认值：200（单位ms，不建议修改）
   - 作用：有的时候我们要捕获用户的轻拂动作（短时间滑动一个较短的距离）。只有用户在屏幕上滑动的时间小于 `flickLimitTime` ，才算一次轻拂。
   
## flickLimitDistance
   - 类型：Number
   - 默认值：100（单位px，不建议修改）
   - 作用：只有用户在屏幕上滑动的距离小于 `flickLimitDistance` ，才算一次轻拂。
   
## resizePolling
   - 类型：Number
   - 默认值：60（单位ms，不建议修改)
   - 作用：当窗口的尺寸改变的时候，需要对 better-scroll 做重新计算，为了优化性能，我们对重新计算做了延时。60ms 是一个比较合理的值。
   
## probeType
   - 类型：Number
   - 默认值：0
   - 可选值：1、2、3
   - 作用：有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发[scroll 事件](./events.md#scroll)；当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
   
## preventDefault
   - 类型：Boolean
   - 默认值：true
   - 作用：当事件派发后是否阻止浏览器默认行为。这个值应该设为 true，除非你真的知道你在做什么，通常你可能用到的是 [preventDefaultException](/options.html#preventdefaultexception)。
   
## preventDefaultException  
   - 类型：Object
   - 默认值：`{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/}`
   - 作用：better-scroll 的实现会阻止原生的滚动，这样也同时阻止了一些原生组件的默认行为。这个时候我们不能对这些元素做 preventDefault，所以我们可以配置 preventDefaultException。默认值 `{tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/}`表示标签名为 input、textarea、button、select 这些元素的默认行为都不会被阻止。
   - 备注：这是一个非常有用的配置，它的 key 是 DOM 元素的属性值，value 可以是一个正则表达式。比如我们想配一个 class 名称为 test 的元素，那么配置规则为 `{className:/(^|\s)test(\s|$)/}`。
   
## HWCompositing
   - 类型：Boolean
   - 默认值：true（不建议修改）
   - 作用：是否开启硬件加速，开启它会在 scroller 上添加 `translateZ(0)` 来开启硬件加速从而提升动画性能，有很好的滚动效果。
   - 备注：只有支持硬件加速的浏览器开启才有效果。
   
## useTransition
   - 类型：Boolean
   - 默认值：true（不建议修改）
   - 作用：是否使用 CSS3 transition 动画。如果设置为 false，则使用 requestAnimationFrame 做动画。
   - 备注：只有支持 CSS3 的浏览器开启才有效果。
   
## useTransform
   - 类型：Boolean
   - 默认值：true（不建议修改）
   - 作用：是否使用 CSS3 transform 做位移。如果设置为 false, 则设置元素的 `top/left` (这种情况需要 scroller 是绝对定位的)。
   - 备注：只有支持 CSS3 的浏览器开启才有效果。
   
## bindToWrapper
   - 类型：Boolean
   - 默认值：false
   - 作用：move 事件通常会绑定到 document 上而不是滚动的容器上，当移动的过程中光标或手指离开滚动的容器滚动仍然会继续，这通常是期望的。当然你也可以把 move 事件绑定到滚动的容器上，`bindToWrapper` 设置为 true 即可，这样一旦移动的过程中光标或手指离开滚动的容器，滚动会立刻停止。
   
## disableMouse
   - 类型：Boolean
   - 默认值：根据当前浏览器环境计算而来（不建议修改）
   - 作用：当在移动端环境（支持 touch 事件），disableMouse 会计算为 true，这样就不会监听鼠标相关的事件，而在 PC 环境，disableMouse 会计算为 false，就会监听鼠标相关事件，不建议修改该属性，除非你知道你在做什么。
   
## disableTouch
   - 类型：Boolean
   - 默认值：根据当前浏览器环境计算而来（不建议修改）
   - 作用：当在移动端环境（支持 touch 事件），disableTouch 会计算为 false，这样会监听 touch 相关的事件，而在 PC 环境，disableTouch 会计算为 true，就不会监听 touch 相关事件。不建议修改该属性，除非你知道你在做什么。
