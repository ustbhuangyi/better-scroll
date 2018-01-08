# Specific API

better-scroll also have several specific API to help you implement customized features.

## goToPage(x, y, time, easing)
   - Parameters:
     - `{Number} x`, number of horizontal axis page.
     - `{Number} y`, number of vertical axis page.
     - `{Number} time`, animation duration.
     - `{Object} easing`, easing function, usually don't suggest modifying. If you really need to modify, please consult the format of ease.js in source code.
   - Return: none.
   - Usage: in slide component, slide usually has several pages. Use this method scroll to specific page.

## next(time, easing)
   - Parameters:
     - `{Number} time`, animation duration.
     - `{Object} easing`, easing function, usually don't suggest modifying. If you really need to modify, please consult the format of ease.js in source code.
   - Return: none.
   - Usage: scroll to next page.

## prev(time, easing)
   - Parameters:
     - `{Number} time`, animation duration.
     - `{Object} easing`, easing function, usually don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code.
   - Return: none.
   - Usage: scroll to previous page.

## getCurrentPage()
   - Parameters: none.
   - Return: `{Object}`, like `{ x: posX, y: posY,pageX: x, pageY: y}`
     - `x`: coordinate of current page on horizontal axis.
     - `y`: coordinate of current page on vertical axis.
     - `pageX`: page number on horizontal axis.
     - `pageY`: page number on vertical axis.
   - Usage: get information of current page.

## wheelTo(index)
   - Parameters:
     - `{Number} index`.
   - Return: none.
   - Usage: in picker component, use this methods scrolling to the indexed position.

## getSelectedIndex()
   - Parameters: none.
   - Return: `{Number}` current selected index.
   - Usage: get current selected index.

## finishPullDown()
   - Parameters: none.
   - Return: none.
   - Usage: when the data loading cause by pulling down is finished, use this method to tell better-scroll that data is already loaded.

## finishPullUp()
   - Parameters: none.
   - Return: none.
   - Usage: when the data loading cause by pulling up is finished, use this method to tell better-scroll that data is already loaded.

## on()
   - Parameters:
     - `{String} type`, event 
     - `{Function} fn`, callback
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
   
## once()
   - Parameters:
     - `{String} type`, event 
     - `{Function} fn`, callback
   - Return: none
   - Usage: Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

## off()
   - Parameters:
     - `{String} type`, event 
     - `{Function} fn`, callback
   - Return: none
   - Usage: Remove custom event listener. Only remove the listener for that specific callback.
   - Example：
   ```javascript
   import BScroll from 'better-scroll'
   let scroll = new BScroll('.wrapper')
   function onPullingUp() {
       console.log('pullingup success!')
   }
   scroll.on('pullingUp', onPullingUp) // add pullingup event callback
   ...
   scroll.off('pullingUp', onPullingUp) // remove pullingup event callback
   ...s
   ```