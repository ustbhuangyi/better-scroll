# API

如果想要彻底了解 BetterScroll，就需要了解其实例的常用属性、灵活的方法以及提供的事件与钩子。

## 属性

有时候我们想基于 BetterScroll 做一些扩展，需要对 BetterScroll 的一些属性有所了解，下面介绍几个常用属性。

### x
  - **类型**：number
  - **作用**：bs 横轴坐标。

### y
  - **类型**：number
  - **作用**：bs 纵轴坐标。

### maxScrollX
  - **类型**：number
  - **作用**：bs 最大横向滚动位置。
  - **备注**：bs 横向滚动的位置区间是 [minScrollX, maxScrollX]，并且 maxScrollX 是负值。

### minScrollX
  - **类型**：number
  - **作用**：bs 最小横向滚动位置。
  - **备注**：bs 横向滚动的位置区间是 [minScrollX, maxScrollX]，并且 minScrollX 是正值。

### maxScrollY
  - **类型**：number
  - **作用**：bs 最大纵向滚动位置。
  - **备注**：bs 纵向滚动的位置区间是 [minScrollY, maxScrollY]，并且 maxScrollY 是负值。

### minScrollY
  - **类型**：number
  - **作用**：bs 最小纵向滚动位置。
  - **备注**：bs 纵向滚动的位置区间是 [minScrollY, maxScrollY]，并且 minScrollY 是正值。

### movingDirectionX
  - **类型**：number
  - **作用**：判断 bs 滑动过程中的方向（左右）。
  - **备注**：-1 表示手指从左向右滑，1 表示从右向左滑，0 表示没有滑动。

### movingDirectionY
  - **类型**：number
  - **作用**：判断 bs 滑动过程中的方向（上下）。
  - **备注**：-1 表示手指从上往下滑，1 表示从下往上滑，0 表示没有滑动。

### directionX
  - **类型**：number
  - **作用**：判断 bs 滑动结束后相对于开始滑动位置的方向（左右）。
  - **备注**：-1 表示手指从左向右滑，1 表示从右向左滑，0 表示没有滑动。

### directionY
  - **类型**：number
  - **作用**：判断 bs 滑动结束后相对于开始滑动位置的方向（上下）。
  - **备注**：-1 表示手指从上往下滑，1 表示从下往上滑，0 表示没有滑动。

### enabled
  - **类型**：boolean,
  - **作用**：判断当前 bs 是否处于启用状态，不再响应手指的操作。

### pending
  - **类型**：boolean,
  - **作用**：判断当前 bs 是否处于滚动动画过程中。

## 方法

BetterScroll 提供了很多灵活的 API，当我们基于 BetterScroll 去实现一些 feature 的时候，会用到这些 API，了解它们会有助于开发更加复杂的需求。

### refresh()
  - **参数**：无
  - **返回值**：无
  - **作用**：重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。

### scrollTo(x, y, time, easing, extraTransform)
   - **参数**：
     - {number} x 横轴坐标（单位 px）
     - {number} y 纵轴坐标（单位 px）
     - {number} time 滚动动画执行的时长（单位 ms）
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 `packages/shared-utils/src/ease.ts` 里的写法
     - {Object} extraTransform，只有在你想要修改 CSS transform 的一些其他属性的时候，你才需要传入此参数，结构如下：
     ```js
     let extraTransform = {
       // 起点的属性
       start: {
         scale: 0
       },
       // 终点的属性
       end: {
         scale: 1.1
       }
     }
     bs.scrollTo(0, -60, 300, undefined, extraTransform)
     ```
   - **返回值**：无
   - **作用**：相对于当前位置偏移滚动 x,y 的距离。

### scrollBy(x, y, time, easing)
   - **参数**：
     - {number} x 横轴变化量（单位 px）
     - {number} y 纵轴变化量（单位 px）
     - {number} time 滚动动画执行的时长（单位 ms）
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 `packages/shared-utils/src/ease.ts` 里的写法
   - **返回值**：无
   - **作用**：相对于当前位置偏移滚动 x,y 的距离。

### scrollToElement(el, time, offsetX, offsetY, easing)
   - **参数**：
     - {DOM | string} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
     - {number} time 滚动动画执行的时长（单位 ms）
     - {number | boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
     - {number | boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 `packages/shared-utils/src/ease.ts` 里的写法
   - **返回值**：无
   - **作用**：滚动到指定的目标元素。

### stop()
   - **参数**：无
   - **返回值**：无
   - **作用**：立即停止当前运行的滚动动画。

### enable()
   - **参数**：无
   - **返回值**：无
   - **作用**：启用 BetterScroll, 默认 开启。

### disable()
   - **参数**：无
   - **返回值**：无
   - **作用**：禁用 BetterScroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。

### destroy()
   - **参数**：无
   - **返回值**：无
   - **作用**：销毁 BetterScroll，解绑事件。

### on(type, fn, context)
   - **参数**：
     - {string} type 事件名
     - {Function} fn 回调函数
     - {Object} context 函数执行的上下文环境，默认是 this
   - **返回值**：无
   - **作用**：监听当前实例上的钩子函数。如：scroll、scrollEnd 等。
   - **示例**：
   ```javascript
   import BScroll from '@better-scroll/core'
   let scroll = new BScroll('.wrapper', {
     probeType: 3
   })
   function onScroll(pos) {
       console.log(`Now position is x: ${pos.x}, y: ${pos.y}`)
   }
   scroll.on('scroll', onScroll)
   ```

### once(type, fn, context)
   - **参数**：
     - {string} type 事件名
     - {Function} fn 回调函数
     - {Object} context 函数执行的上下文环境，默认是 this
   - **返回值**：无
   - **作用**：监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。

### off(type, fn)
   - **参数**：
     - {string} type 事件名
     - {Function} fn 回调函数
   - **返回值**：无
   - **作用**：移除自定义事件监听器。只会移除这个回调的监听器。
   - **示例**：
   ```javascript
   import BScroll from '@better-scroll/core'
   let scroll = new BScroll('.wrapper', {
     probeType: 3
   })
   function handler() {
       console.log('bs is scrolling now')
   }
   scroll.on('scroll', handler)

   scroll.off('scroll', handler)
   ```

## 事件 VS 钩子

基于 2.x 的架构设计，以及对 1.x 事件的兼容，我们延伸出两个概念 ——『**事件**』以及『**钩子**』。从本源上来说它们都是属于 `EventEmitter` 实例，只是叫法不一样。下面我们从节选的源码来讲解一下：

```typescript
  export default BScrollCore extends EventEmitter {
    hooks: EventEmitter
  }
```

  - **BScrollCore**

    本身继承了 EventEmitter。它派发出来的，我们都称之为『**事件**』。

    ```js
      import BScroll from '@better-scroll/core'
      let bs = new BScroll('.wrapper', {})

      // 监听 bs 的 scroll 事件
      bs.on('scroll', () => {})
      // 监听 bs 的 refresh 事件
      bs.on('refresh', () => {})
    ```

  - **BScrollCore.hooks**

    hooks 也是 EventEmitter 的实例。它派发出来的，我们都称之为『**钩子**』。

    ```js
      import BScroll from '@better-scroll/core'
      let bs = new BScroll('.wrapper', {})

      // 监听 bs 的 refresh 钩子
      bs.hooks.on('refresh', () => {})
      // 监听 bs 的 enable 钩子
      bs.hooks.on('enable', () => {})
    ```

相信现在大家对两者有了更好的区分吧，『**事件**』是为了 1.x 的兼容考虑，用户一般关注的是事件的派发，但是如果要编写一款插件，你应该更加关注『**钩子**』。

## 事件

在 2.0 当中，BetterScroll 事件与 1.x 的事件是拉齐的，只有 BetterScroll 会派发『**事件**』，如果你在编写插件的时候需要暴露事件，你也应该通过 BetterScroll 来派发，[详细的教程看这](../plugins/how-to-write.html)，目前的事件分为下面几种：

  - **refresh**
    - **触发时机**：BetterScroll 重新计算

    ```js
      import BetterScroll from '@better-scroll/core'

      const bs = new BetterScroll('.wrapper', {})

      bs.on('refresh', () => {})
    ```

  - **enable**
    - **触发时机**：BetterScroll 启用，开始响应用户交互

    ```js
      bs.on('enable', () => {})
    ```

  - **disable**
    - **触发时机**：BetterScroll 禁用，不再响应用户交互

    ```js
      bs.on('disable', () => {})
    ```

  - **beforeScrollStart**
    - **触发时机**：用户手指放在滚动区域的时候

    ```js
      bs.on('beforeScrollStart', () => {})
    ```

  - **scrollStart**
    - **触发时机**：content 元素满足滚动条件，即将开始滚动

    ```js
      bs.on('scrollStart', () => {})
    ```

  - **scroll**
    - **触发时机**：正在滚动

    ```js
      bs.on('scroll', (position) => {
        console.log(position.x, position.y)
      })
    ```

  - **scrollEnd**
    - **触发时机**：滚动结束，或者让一个正在滚动的 content 强制停止

    ```js
      bs.on('scrollEnd', () => {})
    ```

  - **scrollCancel**
    - **触发时机**：滚动取消

    ```js
      bs.on('scrollCancel', () => {})
    ```

  - **touchEnd**
    - **触发时机**：用户手指离开滚动区域

    ```js
      bs.on('touchEnd', () => {})
    ```

  - **flick**
    - **触发时机**：用户触发轻拂操作

    ```js
      bs.on('flick', () => {})
    ```

  - **destroy**
    - **触发时机**：BetterScroll 销毁

    ```js
      bs.on('destroy', () => {})
    ```
  - **contentChanged** <Badge text='2.0.4' />
    - **触发时机**：在调用 `bs.refresh()`，探测到 content DOM 变成了其他元素的时候

    ```typescript
      // bs 版本 >= 2.0.4
      bs.on('contentChanged', (newContent: HTMLElement) => {})
    ```

以下的事件必须注册括号中的**插件**才会派发：

  - **alterOptions(__mouse-wheel__)**
    - **触发时机**：滚轮滚动开始

    ```js
      import BetterScroll from '@better-scroll/core'
      import MouseWheel from '@better-scroll/mouse-wheel'

      BetterScroll.use(MouseWheel)
      const bs = new BetterScroll('.wrapper', {
        mouseWheel: true
      })

      bs.on('alterOptions', (mouseWheelOptions) => {
        /**
         * mouseWheelOptions.speed：鼠标滚轮滚动的速度
         * mouseWheelOptions.invert：滚轮滚动和 BetterScroll 滚动的方向是否一致
         * mouseWheelOptions.easeTime：滚动动画的缓动时长。
         * mouseWheelOptions.discreteTime：触发 wheelEnd 的间隔时长
         * mouseWheelOptions.throttleTime：滚轮滚动是高频率的动作，因此可以通过 throttleTime 来限制触发频率
         * mouseWheelOptions.dampingFactor：阻尼因子，当超出边界会施加阻力
         **/
      })
    ```

  - **mousewheelStart(__mouse-wheel__)**
    - **触发时机**：滚轮滚动开始

    ```js
      import BetterScroll from '@better-scroll/core'
      import MouseWheel from '@better-scroll/mouse-wheel'

      BetterScroll.use(MouseWheel)
      const bs = new BetterScroll('.wrapper', {
        mouseWheel: true
      })

      bs.on('mousewheelStart', () => {})
    ```

  - **mousewheelMove(__mouse-wheel__)**
    - **触发时机**：滚轮滚动中

    ```js
      bs.on('mousewheelMove', () => {})
    ```

  - **mousewheelEnd(__mouse-wheel__)**
    - **触发时机**：滚轮滚动结束

    ```js
      bs.on('mousewheelEnd', () => {})
    ```

  - **pullingDown(__pull-down__)**
    - **触发时机**：当顶部下拉距离超过阈值

    ```js
      import BetterScroll from '@better-scroll/core'
      import Pulldown from '@better-scroll/pull-down'

      BetterScroll.use(Pulldown)
      const bs = new BetterScroll('.wrapper', {
        pullDownRefresh: true
      })

      bs.on('pullingDown', () => {
        await fetchData()
        bs.finishPullDown()
      })
    ```

  - **pullingUp(__pull-up__)**
    - **触发时机**：当底部下拉距离超过阈值

    ```js
      import BetterScroll from '@better-scroll/core'
      import Pullup from '@better-scroll/pull-up'

      BetterScroll.use(Pullup)
      const bs = new BetterScroll('.wrapper', {
        pullUpLoad: true
      })

      bs.on('pullingUp', () => {
        await fetchData()
        bs.finishPullUp()
      })
    ```

  - **slideWillChange(__slide__)**
    - **触发时机**：轮播图即将要切换 Page

    ```js
      import BetterScroll from '@better-scroll/core'
      import Slide from '@better-scroll/slide'

      BetterScroll.use(Slide)

      const bs = new BetterScroll('.wrapper', {
        slide: true,
        momentum: false,
        bounce: false,
        probeType: 2
      })

      bs.on('slideWillChange', (page) => {
        // 即将要切换的页面
        console.log(page.pageX, page.pageY)
      })
    ```

  - **beforeZoomStart(__zoom__)**
    - **触发时机**：双指接触缩放元素时

    ```js
      import BetterScroll from '@better-scroll/core'
      import Zoom from '@better-scroll/zoom'

      BetterScroll.use(Zoom)

      const bs = new BetterScroll('.wrapper', {
        zoom: true
      })

      bs.on('beforeZoomStart', () => {})
    ```

  - **zoomStart(__zoom__)**
    - **触发时机**：双指缩放距离超过最小阈值

    ```js
      bs.on('zoomStart', () => {})
    ```

  - **zooming(__zoom__)**
    - **触发时机**：双指缩放行为正在进行时

    ```js
      bs.on('zooming', ({ scale }) => {
        // scale 当前 scale
      })
    ```

  - **zoomEnd(__zoom__)**
    - **触发时机**：双指缩放行为结束后

    ```js
      bs.on('zoomEnd', ({ scale }) => {})
    ```

## 钩子

钩子是 2.0 版本延伸出来的概念，它的本质与事件相同，都是 EventEmitter 实例，也就是典型的订阅发布模式。BScrollCore 作为一个最小的滚动单元，内部也是存在非常多的功能类，每个功能类都有一个叫 hooks 的属性，它架起了不同类之间沟通的桥梁。如果你要编写一个复杂的插件，钩子是必须需要掌握的内容。

  - **BScrollCore.hooks**

    - **beforeInitialScrollTo**
      - **触发时机**：初始化加载完插件，需要滚动到指定位置
      - **参数**：position 对象
        - `{ x: number, y: number }`
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('beforeInitialScrollTo', (postion) => {
          postion.x = 0
          position.y = -200 // 初始化滚动至 -200 的位置
        })
      ```

    - **refresh**
      - **触发时机**：重新计算 BetterScroll
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('refresh', () => { console.log('refreshed') })
      ```

    - **enable**
      - **触发时机**：启用 BetterScroll，响应用户行为
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('enable', () => { console.log('enabled') })
      ```

    - **disable**
      - **触发时机**：禁用 BetterScroll，不再响应用户行为
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('disable', () => { console.log('disabled') })
      ```

    - **destroy**
      - **触发时机**：销毁 BetterScroll
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('destroy', () => { console.log('destroyed') })
      ```

    - **contentChanged** <Badge text='2.0.4' />
      - **触发时机**：在调用 `bs.refresh()`，探测到 content DOM 变成了其他元素的时候
      - **示例**
      ```typescript
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        // bs 版本 >= 2.0.4
        bs.hooks.on('contentChanged', (newContent: HTMLElement) => { console.log(newContent) })
      ```

  - **ActionsHandler.hooks**

    - **beforeStart**
      - **触发时机**：刚响应 touchstart 事件，还未记录手指在屏幕点击的位置
      - **参数**：event 事件对象
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actionsHandler.hooks
        hooks.on('beforeStart', (event) => { console.log(event.target) })
      ```

    - **start**
      - **触发时机**：记录完手指在屏幕点击的位置，即将触发 touchmove
      - **参数**：event 事件对象
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actionsHandler.hooks
        hooks.on('start', (event) => { console.log(event.target) })
      ```

    - **move**
      - **触发时机**：响应 touchmove 事件，记录完手指在屏幕点击的位置
      - **参数**：拥有如下属性的对象
        - `{ number } deltaX`：x 方向的手指偏移量
        - `{ number } deltaY`：y 方向的手指偏移量
        - `{ event } e`：event 事件对象
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actionsHandler.hooks
        hooks.on('move', ({ deltaX, deltaY, e }) => {})
      ```

    - **end**
      - **触发时机**：响应 touchend 事件
      - **参数**：event 事件对象
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actionsHandler.hooks
        hooks.on('end', (event) => {})
      ```

    - **click**
      - **触发时机**：触发 click 事件
      - **参数**：event 事件对象

  - **ScrollerActions.hooks**

    - **start**
      - **触发时机**：记录完所有的滚动初始信息
      - **参数**：event 事件对象
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('start', (event) => { console.log(event.target) })
      ```

    - **beforeMove**
      - **触发时机**：在检验是否是合法的滚动之前
      - **参数**：event 事件对象
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('beforeMove', (event) => { console.log(event.target) })
      ```

    - **scrollStart**
      - **触发时机**：校验是合法的滚动，并且即将开始滚动
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('scrollStart', () => {})
      ```

    - **scroll**
      - **触发时机**：正在滚动
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('scroll', () => {})
      ```

    - **beforeEnd**
      - **触发时机**：刚执行 touchend 事件回调，但是还未更新最终位置
      - **参数**：event 事件对象
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('beforeEnd', (event) => { console.log(event) })
      ```

    - **end**
      - **触发时机**：刚执行 touchend 事件回调并且更新滚动方向
      - **参数**：两个参数，第一个是 event 事件对象，第二个是当前位置
        - `{ event } e`：事件对象
        - `{ x: number, y: number } postion`：当前位置
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('end', (e, postion) => { console.log(e) })
      ```

    - **scrollEnd**
      - **触发时机**：滚动即将结束，但还需要校验一次滚动行为是否触发了 flick、momentum 行为。
      - **参数**：两个参数，第一个是当前位置，第二个是动画时长
        - `{ x: number, y: number } postion`：当前位置
        - `{ number } duration`：动画时长
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('beforeEnd', (pos, duration) => { console.log(pos) })
      ```
    
    - **coordinateTransformation** <Badge text='2.3.0' />
      - **触发时机**：计算完用户手指的偏移量之后，发生滚动之前。
      - **参数**：
        - `{ deltaX: number, deltaY: number } transformateDeltaData`：偏移量对象
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('coordinateTransformation', (：transformateDeltaData) => { 
          // 获取用户手指移动的距离
         const originDeltaX = transformateDeltaData.deltaX
         const originDeltaY = transformateDeltaData.deltaY

         // 变换位移
         transformateDeltaData.deltaX = originDeltaY
         transformateDeltaData.deltaY = originDeltaX

         // transformateDeltaData.deltaX 最终作用在 BetterScroll content DOM 的 translateX
         // transformateDeltaData.deltaY 最终作用在 BetterScroll content DOM 的 translateY
        })
      ```
      该钩子通常是为了修正当 BetterScroll 的 wrapper DOM 的祖先元素发生旋转的时候，用户自定义位移变换的逻辑，大部分情况下只需要配置 [quadrant](./base-scroll-options.html#quadrant) 即可。

  - **Behavior.hooks**

    - **beforeComputeBoundary**
      - **触发时机**：即将计算滚动边界
      - **参数**：boundary 对象
        - `{ minScrollPos: number, maxScrollPos: number } boundary`
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.scrollBehaviorX.hooks
        hooks.on('beforeComputeBoundary', () => {})
      ```

    - **computeBoundary**
      - **触发时机**：计算滚动边界
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.scrollBehaviorX.hooks
        hooks.on('computeBoundary', (boundary) => {
          console.log(boundary.minScrollPos) // 上边界最大值，正的越多，下拉的幅度越大
          console.log(boundary.maxScrollPos) // 下边界最小值，负的越多，滚的越远
        })
      ```

    - **momentum**
      - **触发时机**：满足触发 momentum 动量动画条件，并且在计算之前
      - **参数**：两个参数，第一个是 momentumData 对象，第二个是滚动偏移量
        - `{ destination: number, duration: number, rate: number} momentumData`：destination 是目标位置，duration 是缓动时长，rate 是斜率
        - `{ number } distance`：触发 momentum 的滚动偏移量
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.scrollBehaviorX.hooks
        hooks.on('momentum', (momentumData, distance) => {})
      ```

    - **end**
      - **触发时机**：不满足触发 momentum 动量动画条件
      - **参数**：momentumInfo 对象
        - `{ destination: number, duration: number} momentumInfo`：destination 是目标位置，duration 是缓动时长
      - **示例**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.scrollBehaviorX.hooks
        hooks.on('end', (momentumInfo) => {
          console.log(momentumInfo.destination)
          console.log(momentumInfo.duration)
        })
      ```

  - **Animation.hooks(useTransition: false)**

    - **forceStop**
      - **触发时机**：强制让一个滚动的 bs 停止
      - **参数**：position 对象
        - `{ x: number, y: number } position`：当前坐标值

    - **move**
      - **触发时机**：滚动进行中
      - **参数**：position 对象
        - `{ x: number, y: number } position`：当前坐标值

    - **end**
      - **触发时机**：滚动结束
      - **参数**：position 对象
        - `{ x: number, y: number } position`：当前坐标值

  - **Translater.hooks**

    - **beforeTranslate**
      - **触发时机**：在修改 content 元素的 transform style 之前，zoom 插件监听了钩子
      - **参数**：第一个是 transformStyle 数组，第二个是 point 对象
        - `{ ['translateX(0px)'|'translateY(0px)'] } transformStyle`：当前 transform 对应的属性值
        - `{ x: number, y: number } point`：x 对应 translateX 的值，y 对应 translateY 的值
        ```js
          import BScroll from '@better-scroll/core'
          const bs = new BScroll('.wrapper', {})
          const hooks = bs.scroller.translater.hooks
          hooks.on('beforeTranslate', (transformStyle, point) => {
            transformStyle.push('scale(1.2)')
            console.log(transformStyle) // ['translateX(0px)', 'translateY(0px)', 'scale(1.2)']
            console.log(point) // { x: 0, y: 0 }
          })
        ```

    - **translate**
      - **触发时机**：修改 content 元素的 transform style 之后，wheel 插件监听了钩子
      - **参数**：point 对象
        - `{ x: number, y: number } point`：x 对应 translateX 的值，y 对应 translateY 的值
        ```js
          import BScroll from '@better-scroll/core'
          const bs = new BScroll('.wrapper', {})
          const hooks = bs.scroller.translater.hooks
          hooks.on('translate', (point) => {
            console.log(point) // { x: 0, y: 0 }
          })
        ```

  - **Transition.hooks(useTransition: true)**

    - **forceStop**
      - **触发时机**：强制让一个正在做动画的 bs 停止
      - **参数**：position 对象
        - `{ x: number, y: number } position`：当前坐标值

    - **move**
      - **触发时机**：滚动进行中
      - **参数**：position 对象
        - `{ x: number, y: number } position`：当前坐标值

    - **end**
      - **触发时机**：滚动结束
      - **参数**：position 对象
        - `{ x: number, y: number } position`：当前坐标值

    - **time**
      - **触发时机**：CSS3 transition 开始之前，wheel 插件监听了该钩子
      - **参数**：CSS3 transition duration
        ```js
          import BScroll from '@better-scroll/core'
          const bs = new BScroll('.wrapper', {})
          const hooks = bs.scroller.animater.hooks
          hooks.on('time', (duration) => {
            console.log(duration) // 800
          })
        ```

    - **timeFunction**
      - **触发时机**：CSS3 transition 开始之前，wheel 插件监听了该钩子
      - **参数**：CSS3 transition-timing-function
        ```js
          import BScroll from '@better-scroll/core'
          const bs = new BScroll('.wrapper', {})
          const hooks = bs.scroller.animater.hooks
          hooks.on('timeFunction', (easing) => {
            console.log(easing) // cubic-bezier(0.1, 0.7, 1.0, 0.1)
          })
        ```

  - **Scroller.hooks**

    - **beforeStart**
      同 `ScrollerActions.hooks.start`

    - **beforeMove**
      同 `ScrollerActions.hooks.beforeMove`

    - **beforeScrollStart**
      同 `ScrollerActions.hooks.start`

    - **scrollStart**
      同 `ScrollerActions.hooks.scrollStart`

    - **scroll**
      - **触发时机**：滚动进行中
      - **参数**：position 对象
        - `{ x: number, y: number } position`：当前坐标值

    - **beforeEnd**
      同 `ScrollerActions.hooks.beforeEnd`

    - **touchEnd**
      - **触发时机**：用户手指离开滚动区域
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('touchEnd', () => {
          console.log('your finger has leave')
        })
      ```

    - **end**
      - **触发时机**：touchEnd 之后，校验 click 之前触发，pull-down 插件基于这个钩子实现
      - **参数**：position 对象
       - `{ x: number, y: number } position`：当前位置
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('end', (position) => {
          console.log(position.x)
          console.log(position.y)
        })
      ```

    - **scrollEnd**
      - **触发时机**：滚动结束
      - **参数**：position 对象
        - `{ x: number, y: number } position`：当前坐标值

    - **resize**
      - **触发时机**：window 尺寸发生改变
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('resize', () => {
          console.log("window's size has changed")
        })
      ```

    - **flick**
      - **触发时机**：探测到手指轻拂动作
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('flick', () => {})
      ```

    - **scrollCancel**
      - **触发时机**：滚动取消或者未发生

    - **momentum**
      - **触发时机**：即将进行 momentum 动量位移，slide 插件监听了该钩子
      - **参数**：scrollMetaData 对象
        - `{ time: number, easing: EaseItem, newX: number, newY: number }`：time 是动画时长，easing是缓动函数，newX 和 newY 是终点
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('momentum', (scrollMetaData) => {
          scrollMetaData.newX = 0
          scrollMetaData.newY = -200
        })
      ```

    - **scrollTo**
      - **触发时机**：调用 bs.scrollTo 方法的时候触发
      - **参数**：endPoint 对象
        - `{ x: number, y: number } endPoint`：终点坐标值
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('scrollTo', (endPoint) => {
          console.log(endPoint.x)
          console.log(endPoint.y)
        })
        bs.scrollTo(0, -200)
      ```

    - **scrollToElement**
      - **触发时机**：调用 bs.scrollToElement 方法的时候触发，wheel 插件监听了该钩子
      - **参数**：第一个是目标 DOM 对象，第二个是终点的坐标
        - `{ HTMLElment } el`
        - `{ top: number, left: number } postion`
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('scrollToElement', (el, pos) => {
          console.log(el)
          console.log(pos.left)
          console.log(pos.top)
        })
        bs.scrollToElement('.some-item', 300, true, true)
      ```

    - **beforeRefresh**
      - **触发时机**：在 behavior 计算边界之前，slide 插件监听了该钩子
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('beforeRefresh', () => {})
      ```

::: tip 提示
细心的你会发现，有部分 Scroller.hooks 与 ScrollActions.hooks 的功能一模一样，其实我们内部采用了一种 [钩子冒泡](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/core/src/utils/bubbling.ts) 的策略，将内层功能类的钩子，通过冒泡的形式一直代理到 BetterScroll Instance 来兼容 1.x 的使用方式。
:::