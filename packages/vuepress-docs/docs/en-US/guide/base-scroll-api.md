# API

If you want to understand BetterScroll thoroughly, you need to understand the common properties of its instances, the flexible methods, and the hooks provided.

## properties

Sometimes we want to do some extensions based on BetterScroll, we need to understand some of the properties of BetterScroll. Here are a few common properties.

### x
  - Type: `Number`.
  - Usage: scroll horizontal axis coordinate.

### y
  - Type: `Number`.
  - Usage: scroll vertical axis coordinate.

### maxScrollX
  - Type: `Number`
  - Usage: max scrollable horizontal coordinate.
  - Note: horizontal scroll range is [minScrollX, maxScrollX], and maxScrollX is negative value.

### maxScrollY
  - Type: `Number`
  - Usage: max scrollable vertical coordinate
  - Note: vertical scroll range is [minScrollY, maxScrollY], and maxScrollY is negative value.

### movingDirectionX
  - Type: `Number`
  - Usage: estimate the moving direction on horizontal is left or right.
  - Note: -1 means finger moves from left to right, 1 means moving from right to left, 0 means haven't moved.

### movingDirectionY
  - Type: `Number`
  - Usage: estimate the moving direction on vertical is up or down during scrolling.
  - Note: -1 means finger moves from up to down, 1 means from down to up, 0 means haven't moved.

### directionX
  - Type: `Number`
  - Usage: estimate the moving direction on horizontal between start position and end position is left or right.
  - Note: -1 means finger moves from up to down, 1 means from down to up, 0 means haven't moved.

### directionY
  - Type: `Number`
  - Usage: estimate the moving direction on vertical between start position and end position is up or down.
  - Note: -1 means finger moves from up to down, 1 means from down to up, 0 means haven't moved.

### enabled
  - Type: `Boolean`,
  - Usage: estimate whether the current scroll is enabled.

### pending
  - Type: `Boolean`,
  - Usage: estimate whether the current scroll is animating.

## methods

BetterScroll provides a lot of flexible APIs, which are used when we implement some features based on BetterScroll, and understanding them will help to meet more complex requirements.

### refresh()
  - Parameters: none.
  - Return: none.
  - Usage: recalculate BetterScroll to ensure scroll work properly when the structure of DOM changes.

### scrollTo(x, y, time, easing, extraTransform, isSilent)
   - Parameters:
     - `{Number} x`, horizontal axis distance. (unit: px)
     - `{Number} y`, vertical axis distance. (unit: px)
     - `{Number} time`, animation duration. (unit: ms)
     - {Object} easing function, usually don't suggest modifying. If you really need to modify, please consult the format in `packages/shared-utils/src/ease.ts`'s of source code
     - You only need to pass in this parameter if you want to modify some other properties of the CSS transform. The structure is as follows:
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
     ```
   - {Boolean} isSilent, whether to dispatch scroll and scrollEnd events when time is 0. isSilent is true and is not dispatched.
   - Return: none.
   - Usage: scroll to target position.

### scrollBy(x, y, time, easing)
   - Parameters:
     - `{Number} x`, horizontal axis changed distance. (unit: px)
     - `{Number} y`, vertical axis changed distance. (unit: px)
     - `{Number} time`, animation duration. (unit: ms)
     - `{Object} easing`, easing function, usually don't suggest modifying. If you really need to modify, please consult the format in `packages/shared-utils/src/ease.ts`s of source code.
   - Return: none.
   - Usage: Refer to current position, scroll the distance of (x, y).

### scrollToElement(el, time, offsetX, offsetY, easing)
   - Parameters:
     - `{DOM | String} el`, target element. If the value is a string, we will try to use querySelector get the DOM element.
     - `{Number} time`, animation duration. (unit ms)
     - `{Number | Boolean}` offsetX, the x offset to target element，If the value is true, scroll to the center of target element.
     - `{Number | Boolean}` offsetY, the y offset to target element，If the value is true, scroll to the center of target element.
     - `{Object} easing`, easing function, usually don't suggest modifying. If you really need to modify, please consult the format in `packages/shared-utils/src/ease.ts`'s of source code.
   - Return: none.
   - Usage: scroll to target element.

### stop()
   - Parameters: none.
   - Return: none.
   - Usage: stop the scroll animation immediately.

### enable()
   - Parameters: none.
   - Return: none.
   - Usage: enable BetterScroll. It's enabled by default.

### disable()
   - Parameters: none.
   - Return: none.
   - Usage: disable BetterScroll. And it will make the callbacks of DOM events don't response.

### destroy()
   - Parameters: none.
   - Return: none.
   - Usage: destroy BetterScroll，remove events and free some memory when the scroll is not needed anymore.

### on(type, fn, context)
   - Parameters:
     - `{String} type`, event
     - `{Function} fn`, callback
     - `{Fnctuon} context`, context,default is this.
   - Return: none
   - Usage: Listen for a hook on the current BScroll, such as "scroll", "scrollEnd" and so on.
   - Example:
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
   - Parameters:
     - `{String} type`, event
     - `{Function} fn`, callback
     - `{Fnctuon} context`, context,default is this.
   - Return: none
   - Usage: Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

### off(type, fn)
   - Parameters:
     - `{String} type`, event
     - `{Function} fn`, callback
   - Return: none
   - Usage: Remove custom event listener. Only remove the listener for that specific callback.
   - Example:
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

## hooks

In addition to providing rich API calls, BetterScroll also provides events to facilitate interaction with the outside world. You can use them to implement some of the more advanced features.

```js
const bs = new BScroll('.wrapper', {
  probeType: 3
})

bs.on('beforeScrollStart', () => {
  console.log('scrolling is ready to bootstrap')
})
```

### beforeScrollStart
   - Parameters: none.
   - Trigger timing: before scroll starts.

### scrollStart
   - Parameters: none.
   - Trigger timing: when scroll starts.

### scroll
   - Parameters: `{Object} {x, y}` real time coordinates during scroll.
   - Trigger timing: During scroll.

### scrollCancel
   - Parameters: none.
   - Trigger timing: when scroll is canceled.

### scrollEnd
   - Parameters: `{Object} {x, y}` coordinates.
   - Trigger timing: when scroll ends.

### touchEnd
   - Parameters: `{Object} {x, y}` coordinates.
   - Trigger timing: when finger touch or mouse leaves.

### flick
   - Parameters: none.
   - Trigger timing: flick.

### refresh
   - Parameters: none.
   - Trigger timing: after executing the method of refresh.

### disable
   - Parameters: none.
   - Trigger timing: `bs` is disbaled, not response to DOM Events(touchstart、touchmove、touchend...).

### enable
   - Parameters: none.
   - Trigger timing: `bs` is enabled, response to DOM Events(touchstart、touchmove、touchend...) again.

### destroy
   - Parameters: none.
   - Trigger timing: after executing the method of destroy.
