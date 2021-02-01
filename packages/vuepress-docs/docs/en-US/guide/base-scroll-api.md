# API

If you want to understand BetterScroll thoroughly, you need to understand the common properties of its instances, the flexible methods, and the hooks provided.

## Properties

Sometimes we want to do some extensions based on BetterScroll, we need to understand some of the properties of BetterScroll. Here are a few common properties.

### x
  - **Type**: `number`.
  - **Usage**: scroll horizontal axis coordinate.

### y
  - **Type**: `number`.
  - **Usage**: scroll vertical axis coordinate.

### maxScrollX
  - **Type**: `number`
  - **Usage**: max scrollable horizontal coordinate.
  - **Note**: horizontal scroll range is [minScrollX, maxScrollX], and maxScrollX is negative value.

### minScrollX
  - **Type**: `number`
  - **Usage**: min scrollable horizontal coordinate.
  - **Note**: horizontal scroll range is [minScrollX, maxScrollX], and minScrollX is positive value.

### maxScrollY
  - **Type**: `number`
  - **Usage**: max scrollable vertical coordinate
  - **Note**: vertical scroll range is [minScrollY, maxScrollY], and maxScrollY is negative value.

### minScrollY
  - **Type**: `number`
  - **Usage**: min scrollable vertical coordinate
  - **Note**: vertical scroll range is [minScrollY, maxScrollY], and minScrollY is positive value.

### movingDirectionX
  - **Type**: `number`
  - **Usage**: estimate the moving direction on horizontal is left or right.
  - **Note**: -1 means finger moves from left to right, 1 means moving from right to left, 0 means haven't moved.

### movingDirectionY
  - **Type**: `number`
  - **Usage**: estimate the moving direction on vertical is up or down during scrolling.
  - **Note**: -1 means finger moves from up to down, 1 means from down to up, 0 means haven't moved.

### directionX
  - **Type**: `number`
  - **Usage**: estimate the moving direction on horizontal between start position and end position is left or right.
  - **Note**: -1 means finger moves from up to down, 1 means from down to up, 0 means haven't moved.

### directionY
  - **Type**: `number`
  - **Usage**: estimate the moving direction on vertical between start position and end position is up or down.
  - **Note**: -1 means finger moves from up to down, 1 means from down to up, 0 means haven't moved.

### enabled
  - **Type**: `boolean`,
  - **Usage**: estimate whether the current scroll is enabled.

### pending
  - **Type**: `boolean`,
  - **Usage**: estimate whether the current scroll is animating.

## Methods

BetterScroll provides a lot of flexible APIs, which are used when we implement some features based on BetterScroll, and understanding them will help to meet more complex requirements.

### refresh()
  - **Arguments**: none.
  - **Return**: none.
  - **Usage**: recalculate BetterScroll to ensure scroll work properly when the structure of DOM changes.

### scrollTo(x, y, time, easing, extraTransform)
   - **Arguments**:
     - `{number} x`, horizontal axis distance. (unit: px)
     - `{number} y`, vertical axis distance. (unit: px)
     - `{number} time`, animation duration. (unit: ms)
     - `{Object} easing function`, usually don't suggest modifying. If you really need to modify, please refer `packages/shared-utils/src/ease.ts`'s of source code
     - `{Object} extraTransform`, you only need to pass in this parameter if you want to modify some other properties of the CSS transform. The structure is as follows:
     ```js
     let extraTransform = {
       // start point
       start: {
         scale: 0
       },
       // end poinnt
       end: {
         scale: 1.1
       }
     }
     bs.scrollTo(0, -60, 300, undefined, extraTransform)
     ```
    - **Return**: none.
    - **Usage**: scroll to specified position.

### scrollBy(x, y, time, easing)
   - **Arguments**:
     - `{number} x`, horizontal axis changed distance. (unit: px)
     - `{number} y`, vertical axis changed distance. (unit: px)
     - `{number} time`, animation duration. (unit: ms)
     - `{Object} easing function`, usually don't suggest modifying. If you really need to modify, please refer `packages/shared-utils/src/ease.ts`.
   - **Return**: none.
   - **Usage**: scroll to specified position based on current position.

### scrollToElement(el, time, offsetX, offsetY, easing)
   - **Arguments**:
     - `{DOM | string} el`, target element. If the value is a string, we will try to use querySelector get the DOM element.
     - `{number} time`, animation duration. (unit ms)
     - `{number | boolean}` offsetX, the x offset to target element，If the value is true, scroll to the center of target element.
     - `{number | boolean}` offsetY, the y offset to target element，If the value is true, scroll to the center of target element.
     - `{Object} easing function`, usually don't suggest modifying. If you really need to modify, please refer `packages/shared-utils/src/ease.ts`.
   - **Return**: none.
   - **Usage**: scroll to target element.

### stop()
   - **Arguments**: none.
   - **Return**: none.
   - **Usage**: stop the scroll animation immediately.

### enable()
   - **Arguments**: none.
   - **Return**: none.
   - **Usage**: enable BetterScroll. It's enabled by default.

### disable()
   - **Arguments**: none.
   - **Return**: none.
   - **Usage**: disable BetterScroll. And it will make the callbacks of DOM events don't response.

### destroy()
   - **Arguments**: none.
   - **Return**: none.
   - **Usage**: destroy BetterScroll，remove events and free some memory when the scroll is not needed anymore.

### on(type, fn, context)
   - **Arguments**:
     - `{string} type`, event
     - `{Function} fn`, callback
     - `{Object} context`,default is `this`.
   - **Return**: none
   - **Usage**: listen for a hook on the current BScroll, such as "scroll", "scrollEnd" and so on.
   - **Example**:
   ```javascript
   import BScroll from '@BetterScroll/core'
   let scroll = new BScroll('.wrapper', {
     probeType: 3
   })
   function onScroll(pos) {
       console.log(`Now position is x: ${pos.x}, y: ${pos.y}`)
   }
   scroll.on('scroll', onScroll)
   ```

### once(type, fn, context)
   - **Arguments**:
     - `{string} type`, event
     - `{Function} fn`, callback
     - `{Object} context`, default is `this`.
   - **Return**: none
   - **Usage**: listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

### off(type, fn)
   - **Arguments**:
     - `{string} type`, event
     - `{Function} fn`, callback
   - **Return**: none
   - **Usage**: remove custom event listener. Only remove the listener for that specific callback.
   - **Example**:
   ```javascript
   import BScroll from '@BetterScroll/core'
   let scroll = new BScroll('.wrapper', {
     probeType: 3
   })
   function handler() {
       console.log('bs is scrolling now')
   }
   scroll.on('scroll', handler)

   scroll.off('scroll', handler)
   ```

## Events VS Hooks

Based on the 2.x architecture design and compatibility with 1.x events, we have extended two concepts-"**Events**" and "**Hooks**". Basically, they are all instances of `EventEmitter`, but they are called differently. Let's explain it from the excerpted source code below:

```typescript
  export default BScrollCore extends EventEmitter {
    hooks: EventEmitter
  }
```

  - **BScrollCore**

    It inherits EventEmitter itself. we all call it "**event**".

    ```js
      import BScroll from '@better-scroll/core'
      let bs = new BScroll('.wrapper', {})

      // listen bs scroll event
      bs.on('scroll', () => {})
      // listen bs refresh event
      bs.on('refresh', () => {})
    ```

  - **BScrollCore.hooks**

    Hooks are also instances of EventEmitter. we all call it "**hook**".

    ```js
      import BScroll from '@better-scroll/core'
      let bs = new BScroll('.wrapper', {})

      // tap bs refresh hook
      bs.hooks.on('refresh', () => {})
      // tap bs enable hook
      bs.hooks.on('enable', () => {})
    ```

I believe everyone now has a better distinction between the two. "**Event**" is for the compatibility of 1.x. Users generally pay attention to the distribution of events, but if you want to write a plugin, you should focus on "**hooks**".

## Events

In 2.0, BetterScroll events are almost same with 1.x events. Only BetterScroll will dispatch "**events**". If you need to expose events when writing plugins, you should also dispatch them through BetterScroll. [details is here](../plugins/how-to-write.html), the current events are divided into the following types:

  - **refresh**
    - **Trigger timing**: BetterScroll recalculate

    ```js
      import BetterScroll from '@better-scroll/core'

      const bs = new BetterScroll('.wrapper', {})

      bs.on('refresh', () => {})
    ```

  - **enable**
    - **Trigger timing**: BetterScroll is enabled and starts to respond to user interaction

    ```js
      bs.on('enable', () => {})
    ```

  - **disable**
    - **Trigger timing**: BetterScroll is disabled and no longer responds to user interaction

    ```js
      bs.on('disable', () => {})
    ```

  - **beforeScrollStart**
    - **Trigger timing**: When the user's finger is placed on the scroll area

    ```js
      bs.on('beforeScrollStart', () => {})
    ```

  - **scrollStart**
    - **Trigger timing**: Content element meets the scrolling conditions and will start scrolling

    ```js
      bs.on('scrollStart', () => {})
    ```

  - **scroll**
    - **Trigger timing**: It is scrolling

    ```js
      bs.on('scroll', (position) => {
        console.log(position.x, position.y)
      })
    ```

  - **scrollEnd**
    - **Trigger timing**: End of scrolling, or force a content that is scrolling to stop

    ```js
      bs.on('scrollEnd', () => {})
    ```

  - **scrollCancel**
    - **Trigger timing**: Scroll cancel

    ```js
      bs.on('scrollCancel', () => {})
    ```

  - **touchEnd**
    - **Trigger timing**: User finger leaves the scroll area

    ```js
      bs.on('touchEnd', () => {})
    ```

  - **flick**
    - **Trigger timing**: User triggered flick operation

    ```js
      bs.on('flick', () => {})
    ```

  - **destroy**
    - **Trigger timing**: BetterScroll destroyed

    ```js
      bs.on('destroy', () => {})
    ```

  - **contentChanged** <Badge text='2.0.4' />
    - **Trigger timing**: When calling `bs.refresh()`, it is detected that the content DOM has become other elements

    ```typescript
      // bs version >= 2.0.4
      bs.on('contentChanged', (newContent: HTMLElement) => {})
    ```

The following events must be registered for the **plugin** in parentheses to be dispatched:

  - **alterOptions(__mouse-wheel__)**
    - **Trigger timing**: mouse-wheel scroll starts

    ```js
      import BetterScroll from '@better-scroll/core'
      import MouseWheel from '@better-scroll/mouse-wheel'

      BetterScroll.use(MouseWheel)
      const bs = new BetterScroll('.wrapper', {
        mouseWheel: true
      })

      bs.on('alterOptions', (mouseWheelOptions) => {
        /**
         * mouseWheelOptions.speed
         * mouseWheelOptions.invert
         * mouseWheelOptions.easeTime
         * mouseWheelOptions.discreteTime
         * mouseWheelOptions.throttleTime
         * mouseWheelOptions.dampingFactor
         **/

        // please see details in mouse-wheel plugin doc
      })
    ```

  - **mousewheelStart(__mouse-wheel__)**
    - **Trigger timing**: mouse-wheel scroll starts

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
    - **Trigger timing**: mouse-wheel is scrolling

    ```js
      bs.on('mousewheelMove', () => {})
    ```

  - **mousewheelEnd(__mouse-wheel__)**
    - **Trigger timing**: mouse-wheel scrollEnd

    ```js
      bs.on('mousewheelEnd', () => {})
    ```

  - **pullingDown(__pull-down__)**
    - **Trigger timing**: When the top pull-down distance exceeds the threshold

    ```js
      import BetterScroll from '@better-scroll/core'
      import PullDown from '@better-scroll/pull-down'

      BetterScroll.use(PullDown)
      const bs = new BetterScroll('.wrapper', {
        pullDownRefresh: true
      })

      bs.on('pullingDown', () => {
        await fetchData()
        bs.finishPullDown()
      })
    ```

  - **pullingUp(__pull-up__)**
    - **Trigger timing**: When the bottom pull-up distance exceeds the threshold

    ```js
      import BetterScroll from '@better-scroll/core'
      import PullUp from '@better-scroll/pull-up'

      BetterScroll.use(PullUp)
      const bs = new BetterScroll('.wrapper', {
        pullUpLoad: true
      })

      bs.on('pullingUp', () => {
        await fetchData()
        bs.finishPullUp()
      })
    ```

  - **slideWillChange(__slide__)**
    - **Trigger timing**: The slide is about to switch page

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
        // Page about to switch
        console.log(page.pageX, page.pageY)
      })
    ```

  - **beforeZoomStart(__zoom__)**
    - **Trigger timing**: When two fingers touch the zoom element

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
    - **Trigger timing**: Two-finger zoom distance exceeds the minimum threshold

    ```js
      bs.on('zoomStart', () => {})
    ```

  - **zooming(__zoom__)**
    - **Trigger timing**: While the two-finger zoom behavior is in progress

    ```js
      bs.on('zooming', ({ scale }) => {
        // current scale
      })
    ```

  - **zoomEnd(__zoom__)**
    - **Trigger timing**: After the two-finger zoom action ends

    ```js
      bs.on('zoomEnd', ({ scale }) => {})
    ```

## Hooks

A hook is a concept extended from version 2.0. Its essence is the same as an event. It is an instance of EventEmitter, which is a typical subscription publishing model. As the smallest scroll unit, BScrollCore also has many functional classes inside. Each functional class has a property called hooks, which bridges the communication between different classes. If you want to write a complex plugin, hooks must be mastered.

  - **BScrollCore.hooks**

    - **beforeInitialScrollTo**
      - **Trigger timing**: After initial loading the plugin, you need to scroll to the specified position
      - **Arguments**: position object
        - `{ x: number, y: number }`
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('beforeInitialScrollTo', (postion) => {
          postion.x = 0
          position.y = -200 // Initialize scroll to -200
        })
      ```

    - **refresh**
      - **Trigger timing**: Recalculate BetterScroll
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('refresh', () => { console.log('refreshed') })
      ```

    - **enable**
      - **Trigger timing**: Enable BetterScroll to respond to user behavior
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('enable', () => { console.log('enabled') })
      ```

    - **disable**
      - **Trigger timing**: Disable BetterScroll and no longer respond to user behavior
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('disable', () => { console.log('disabled') })
      ```

    - **destroy**
      - **Trigger timing**: Destroy BetterScroll
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        bs.hooks.on('destroy', () => { console.log('destroyed') })
      ```

    - **contentChanged** <Badge text='2.0.4' />
      - **Trigger timing**：When calling `bs.refresh()`, it is detected that the content DOM has become other elements
      - **Usage**
      ```typescript
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        // bs version >= 2.0.4
        bs.hooks.on('contentChanged', (newContent: HTMLElement) => { console.log(newContent) })
      ```


  - **ActionsHandler.hooks**

    - **beforeStart**
      - **Trigger timing**: Just respond to the touchstart event, but the position of the finger on the screen has not been recorded
      - **Arguments**: event object
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actionsHandler.hooks
        hooks.on('beforeStart', (event) => { console.log(event.target) })
      ```

    - **start**
      - **Trigger timing**: After recording the position of the finger on the screen, touchmove will be triggered
      - **Arguments**: event object
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actionsHandler.hooks
        hooks.on('start', (event) => { console.log(event.target) })
      ```

    - **move**
      - **Trigger timing**: Responding to the touchmove event, after recording the position of the finger on the screen
      - **Arguments**: Objects with the following properties
        - `{ number } deltaX`: x offset
        - `{ number } deltaY`: y offset
        - `{ event } e`: event object
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actionsHandler.hooks
        hooks.on('move', ({ deltaX, deltaY, e }) => {})
      ```

    - **end**
      - **Trigger timing**: Responding to touchend event
      - **Arguments**: event object
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actionsHandler.hooks
        hooks.on('end', (event) => {})
      ```

    - **click**
      - **Trigger timing**: Trigger the click event
      - **Arguments**: event object

  - **ScrollerActions.hooks**

    - **start**
      - **Trigger timing**: After recording all the scrolling initial information
      - **Arguments**: event object
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('start', (event) => { console.log(event.target) })
      ```

    - **beforeMove**
      - **Trigger timing**: Before checking whether it is legal scrolling
      - **Arguments**: event object
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('beforeMove', (event) => { console.log(event.target) })
      ```

    - **scrollStart**
      - **Trigger timing**: scroll is abount to start
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('scrollStart', () => {})
      ```

    - **scroll**
      - **Trigger timing**: It is scrolling
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('scroll', () => {})
      ```

    - **beforeEnd**
      - **Trigger timing**: The touchend event callback has just been executed, but the final position has not been updated
      - **Arguments**: event object
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('beforeEnd', (event) => { console.log(event) })
      ```

    - **end**
      - **Trigger timing**: Just execute the touchend event callback and update the scroll direction
      - **Arguments**: Two Arguments, the first is the event object, the second is the current position
        - `{ event } e`: event object
        - `{ x: number, y: number } postion`: current position
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('end', (e, postion) => { console.log(e) })
      ```

    - **scrollEnd**
      - **Trigger timing**: Scrolling is about to end, but you still need to verify whether a scrolling behavior triggers flick and momentum behaviors.
      - **Arguments**: Two Arguments, the first is the current position, the second is the animation duration
        - `{ x: number, y: number } postion`: current position
        - `{ number } duration`: animation duration
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.actions.hooks
        hooks.on('beforeEnd', (pos, duration) => { console.log(pos) })
      ```

  - **Behavior.hooks**

    - **beforeComputeBoundary**
      - **Trigger timing**: About to calculate the scroll boundary
      - **Arguments**: boundary object
        - `{ minScrollPos: number, maxScrollPos: number } boundary`
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.scrollBehaviorX.hooks
        hooks.on('beforeComputeBoundary', () => {})
      ```

    - **computeBoundary**
      - **Trigger timing**: Calculate the scroll boundary
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.scrollBehaviorX.hooks
        hooks.on('computeBoundary', (boundary) => {
          // The maximum value of the upper boundary, the more positive, the greater the pull down
          console.log(boundary.minScrollPos)
          // The minimum value of the lower boundary, the more negative, the farther you roll
          console.log(boundary.maxScrollPos)
        })
      ```

    - **momentum**
      - **Trigger timing**: Meet the conditions for triggering momentum animation, and before calculating distance
      - **Arguments**: Two Arguments, the first is the momentumData object, the second is the scroll offset
        - `{ destination: number, duration: number, rate: number} momentumData`: destination is the target position, duration is the easing time, rate is the slope
        - `{ number } distance`: Scroll offset to trigger momentum
      - **Usage**
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.scrollBehaviorX.hooks
        hooks.on('momentum', (momentumData, distance) => {})
      ```

    - **end**
      - **Trigger timing**: Does not meet the conditions for triggering momentum animation
      - **Arguments**: momentumInfo object
        - `{ destination: number, duration: number} momentumInfo`: destination is the target position, duration is the easing time
      - **Usage**
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
      - **Trigger timing**: Force a scrolling bs to stop
      - **Arguments**: position object
        - `{ x: number, y: number } position`

    - **move**
      - **Trigger timing**: Scrolling
      - **Arguments**: position object
        - `{ x: number, y: number } position`

    - **end**
      - **Trigger timing**: Scroll ended
      - **Arguments**: position object
        - `{ x: number, y: number } position`

  - **Transition.hooks(useTransition: true)**

    - **forceStop**
      - **Trigger timing**: Force a bs that is doing animation to stop
      - **Arguments**: position object
        - `{ x: number, y: number } position`

    - **move**
      - **Trigger timing**: Scrolling
      - **Arguments**: position object
        - `{ x: number, y: number } position`

    - **end**
      - **Trigger timing**: Scroll ended
      - **Arguments**:position object
        - `{ x: number, y: number } position`

    - **time**
      - **Trigger timing**: Before the CSS3 transition started, the wheel plugin listened to the hook
      - **Arguments**: CSS3 transition duration
        ```js
          import BScroll from '@better-scroll/core'
          const bs = new BScroll('.wrapper', {})
          const hooks = bs.scroller.animater.hooks
          hooks.on('time', (duration) => {
            console.log(duration) // 800
          })
        ```

    - **timeFunction**
      - **Trigger timing**:  Before the CSS3 transition started, the wheel plugin listened to the hook
      - **Arguments**: CSS3 transition-timing-function
        ```js
          import BScroll from '@better-scroll/core'
          const bs = new BScroll('.wrapper', {})
          const hooks = bs.scroller.animater.hooks
          hooks.on('timeFunction', (easing) => {
            console.log(easing) // cubic-bezier(0.1, 0.7, 1.0, 0.1)
          })
        ```

  - **Translater.hooks**

    - **beforeTranslate**
      - **Trigger timing**: Before modifying the transform style of the content element, the zoom plugin listened to the hook
      - **Arguments**: The first is the transformStyle array, the second is the point object
        - `{ ['translateX(0px)'|'translateY(0px)'] } transformStyle`: The property value corresponding to the current transform
        - `{ x: number, y: number } point`: x corresponds to the value of translateX, y corresponds to the value of translateY
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
      - **Trigger timing**: After modifying the transform style of the content element, the wheel plugin listened to the hook
      - **Arguments**: point object
        - `{ x: number, y: number } point`: x corresponds to the value of translateX, y corresponds to the value of translateY
        ```js
          import BScroll from '@better-scroll/core'
          const bs = new BScroll('.wrapper', {})
          const hooks = bs.scroller.translater.hooks
          hooks.on('translate', (point) => {
            console.log(point) // { x: 0, y: 0 }
          })
        ```

  - **Scroller.hooks**

    - **beforeStart**
      same with `ScrollerActions.hooks.start`

    - **beforeMove**
      same with `ScrollerActions.hooks.beforeMove`

    - **beforeScrollStart**
      same with `ScrollerActions.hooks.start`

    - **scrollStart**
      same with `ScrollerActions.hooks.scrollStart`

    - **scroll**
      - **Trigger timing**: Scrolling
      - **Arguments**: position object
        - `{ x: number, y: number } position`

    - **beforeEnd**
      same with `ScrollerActions.hooks.beforeEnd`

    - **touchEnd**
      - **Trigger timing**: User finger leaves the scroll area
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('touchEnd', () => {
          console.log('your finger has leave')
        })
      ```

    - **end**
      - **Trigger timing**: After touchEnd, it is triggered before verifying click. The pull-down plugin is implemented based on this hook
      - **Arguments**: position object
       - `{ x: number, y: number } position`
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
      - **Trigger timing**: Scroll ended
      - **Arguments**: position object
        - `{ x: number, y: number } position`

    - **resize**
      - **Trigger timing**: window size changed
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('resize', () => {
          console.log("window's size has changed")
        })
      ```

    - **flick**
      - **Trigger timing**: Finger flicking detected
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('flick', () => {})
      ```

    - **scrollCancel**
      - **Trigger timing**: Scroll canceled or did not happen

    - **momentum**
      - **Trigger timing**: Momentum displacement is about to begin, and the slide plugin listens to the hook
      - **Arguments**: scrollMetaData object
        - `{ time: number, easing: EaseItem, newX: number, newY: number }`: time is the duration of the animation, easing is the easing function, newX and newY are the end points
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
      - **Trigger timing**: Triggered when the bs.scrollTo method is called
      - **Arguments**: endPoint object
        - `{ x: number, y: number } endPoint`
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
      - **Trigger timing**: Triggered when the bs.scrollToElement method is called, and the wheel plugin listens to the hook
      - **Arguments**: The first is the target DOM object, the second is the coordinates of the end point
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
      - **Trigger timing**: Before behavior calculates the boundary, the slide plugin listens to the hook
      ```js
        import BScroll from '@better-scroll/core'
        const bs = new BScroll('.wrapper', {})
        const hooks = bs.scroller.hooks
        hooks.on('beforeRefresh', () => {})
      ```

::: tip
If you are careful, you will find that some Scroller.hooks have exactly the same functions as ScrollActions.hooks. In fact, we internally use a [hook bubbling](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/core/src/utils/bubbling.ts) strategy to proxy the hooks of the inner function classes to the BetterScroll Instance in the form of bubbling to be compatible with the use of 1.x.
:::