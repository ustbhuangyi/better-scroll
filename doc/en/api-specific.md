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

## openPullDown(config) (v1.9.0+)
   - Parameters：
     - {Object} config，see the config of `pullDownRefresh`，default is true.
   - Return：none.
   - Usage：dynamic open the feature of `pullDownRefresh`.

## closePullDown() (v1.9.0+)
   - Parameters：none.
   - Return：none.
   - Usage：dynamic close the feature of `pullDownRefresh`.

## autoPullDownRefresh() (v1.14.0)
   - Parameters：none.
   - Return：none.
   - Usage：auto trigger pullDownRefresh.

## finishPullUp()
   - Parameters: none.
   - Return: none.
   - Usage: when the data loading cause by pulling up is finished, use this method to tell better-scroll that data is already loaded.

## openPullUp(config) (v1.9.0+)
   - Parameters：
     - {Object} config，see the config of `pullUpLoad`，default is true.
   - Return：none.
   - Usage：dynamic open the feature of `pullUpLoad`.

## closePullUp() (v1.9.0+)
   - Parameters：none.
   - Return：none.
   - Usage：dynamic close the feature of `pullUpLoad`.

## zoomTo(scale, x, y) (v1.12.0+)
   - Parameters:
     - `{Number} scale`, zoom size.
     - `{Number} x`, X coordinate of the zoom origin, relative to the left edge of the entire document.
     - `{Number} y`, Y coordinate of the zoom origin, relative to the top edge of the entire document.
   - Return: none.
   - Usage: zoom the scroller to the specified size.


