# Methods / Customized

BtterScroll also supports several customized methods, to implement some specific feature.

## goToPage(x, y, time, easing)
   - parameters
     - {Number} x, number of horizontal axis page
     - {Number} y, number of vertical axis page
     - {Number} time, animation duration
     - {Object} easing, easing function, generally don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code
   - return: none
   - usage: In slide component, slide usually has several pages. Use this method scroll to specific page.

## next(time, easing)
   - parameters:
     - {Number} time animation duration
     - {Object} easing, easing function, generally don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code
   - return: none
   - usage: scroll to next page

## prev(time, easing)
   - parameters:
     - {Number} time animation duration
     - {Object} easing, easing function, generally don't suggest modifying. If you really need to modify, please consult the format in ease.js of source code
   - return: none
   - usage: scroll to previous page

## getCurrentPage()
   - parameters: none
   - return: {Object} `{ x: posX, y: posY,pageX: x, pageY: y}` 其中，x 和 y 表示偏移的坐标值，pageX 和 pageY 表示横轴方向和纵轴方向的页面数.
   - usage: get information of current page.

## wheelTo(index)
   - parameters:
     - {Number} index 索引值
   - return: none
   - usage: In picker component, use this methods scrolling to the indexed position.

## getSelectedIndex()
   - parameters: none
   - return: {Number} current selected index.
   - usage: get current selected index.

## finishPullDown()
   - parameters: none
   - return: none
   - usage: when finish the data loading cause by pulling down is finish, use this method to tell BetterScroll that data is already loaded.

## finishPullUp()
   - parameters: none
   - return: none
   - usage: when finish the data loading cause by pulling up is finish, use this method to tell BetterScroll that data is already loaded.
