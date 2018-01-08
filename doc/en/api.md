# API

better-scroll supports lots of flexible API. It's really useful when implementing advanced features.

## refresh()
  - Parameters: none.
  - Return: none.
  - Usage: recalculate better-scroll to ensure scroll work properly when the structure of DOM changes.

## scrollTo(x, y, time, easing)
   - Parameters:
     - `{Number} x`, horizontal axis coordinate. (unit: px)
     - `{Number} y`, vertical axis coordinate. (unit: px)
     - `{Number} time`, animation duration. (unit: ms)
     - `{Object} easing`, easing function, usually don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code.
   - Return: none.
   - Usage: scroll to target position. See [Demo](https://ustbhuangyi.github.io/better-scroll/demo/#/vertical-scroll) .

## scrollBy(x, y, time, easing)
   - Parameters:
     - `{Number} x`, horizontal axis distance. (unit: px)
     - `{Number} y`, vertical axis distance. (unit: px)
     - `{Number} time`, animation duration. (unit: ms)
     - `{Object} easing`, easing function, usually don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code.
   - Return: none.
   - Usage: Refer to current position, scroll the distance of (x, y).

## scrollToElement(el, time, offsetX, offsetY, easing)
   - Parameters:
     - `{DOM | String} el`, target element. If the value is a string, we will try to use querySelector get the DOM element.
     - `{Number} time`, animation duration. (unit ms)
     - `{Number | Boolean}` offsetX, the x offset to target element，If the value is true, scroll to the center of target element.
     - `{Number | Boolean}` offsetY, the y offset to target element，If the value is true, scroll to the center of target element.
     - `{Object} easing`, easing function, usually don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code.
   - Return: none.
   - Usage: scroll to target element.

## stop()
   - Parameters: none.
   - Return: none.
   - Usage: stop the scroll animation immediately.

## enable()
   - Parameters: none.
   - Return: none.
   - Usage: enable better-scroll. It's enabled by default.

## disable()
   - Parameters: none.
   - Return: none.
   - Usage: disable better-scroll. And it will make the callbacks of DOM events don't response.

## destroy()
   - Parameters: none.
   - Return: none.
   - Usage: destroy better-scroll，remove events and free some memory when the scroll is not needed anymore.

## on(type, fn, context)
   - Parameters:
     - `{String} type`, event 
     - `{Function} fn`, callback
     - `{Fnctuon} context`, context,default is this.
   - Return: none
   - Usage: Listen for a [custom event](/events.html) on the current BScroll, such as "scroll", "scrollEnd", "pullingUp", "pullingDown" and so on.
   - Example:
   ```javascript
   import BScroll from 'better-scroll'
   let scroll = new BScroll('.wrapper')
   function onScroll(pos) {
       console.log(`Now position is x: ${pos.x}, y: ${pos.y}`)
   }
   scroll.on('scroll', onScroll)
   ```
   
## once(type, fn, context)
   - Parameters:
     - `{String} type`, event 
     - `{Function} fn`, callback
     - `{Fnctuon} context`, context,default is this.
   - Return: none
   - Usage: Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

## off(type, fn)
   - Parameters:
     - `{String} type`, event 
     - `{Function} fn`, callback
   - Return: none
   - Usage: Remove custom event listener. Only remove the listener for that specific callback.
   - Example：
   ```javascript
   import BScroll from 'better-scroll'
   let scroll = new BScroll('.wrapper', {
       pullUpLoad: true
   })
   function onPullingUp() {
       console.log('pullingup success!')
   }
   scroll.on('pullingUp', onPullingUp) // add pullingup event callback
   ...
   scroll.off('pullingUp', onPullingUp) // remove pullingup event callback
   ...
   ```