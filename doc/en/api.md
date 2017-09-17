# Methods / Common

BetterScroll supports lots of flexible API. It's really useful when implementing advanced feature.

## refresh()
  - parameters: none
  - return: none
  - usage: recalculate BetterScroll to ensure scroll work properly when the structure of DOM changes.

## scrollTo(x, y, time, easing)
   - parameters:
     - {Number} x, horizontal axis coordinate（unit px）
     - {Number} y, vertical axis coordinate（unit px）
     - {Number} time, animation duration（unit ms）
     - {Object} easing, easing function, generally don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code
   - return: none
   - usage: 滚动到指定的位置，见 [Demo](https://ustbhuangyi.github.io/better-scroll/demo/#/vertical-scroll) .

## scrollBy(x, y, time, easing)
   - parameters:
     - {Number} x, horizontal axis distance（unit px）
     - {Number} y, vertical axis distance（unit px）
     - {Number} time, animation duration（unit ms）
     - {Object} easing, easing function, generally don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code
   - return: none
   - usage: Refer to current position, scroll the distance of (x, y).

## scrollToElement(el, time, offsetX, offsetY, easing)
   - parameters:
     - {DOM | String} el, target element. If the value is a string, we will try to use querySelector get the DOM element.
     - {Number} time, animation duration（unit ms）
     - {Number | Boolean} offsetX, the x offset to target element，If the value is true, scroll to the center of target element
     - {Number | Boolean} offsetY, the y offset to target element，If the value is true, scroll to the center of target element
     - {Object} easing, easing function, generally don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code
   - return: none
   - usage: scroll to target element.

## stop()
   - parameters: none
   - return: none
   - usage: stop the scroll animation immediately.

## enable()
   - parameters: none
   - return: none
   - usage: enable BetterScroll, default enable.

## disable()
   - parameters: none
   - return: none
   - usage: disable BetterScroll. And it will make the callbacks of DOM events don't response.

## destroy()
   - parameters: none
   - return: none
   - usage: destroy BetterScroll，remove events.
