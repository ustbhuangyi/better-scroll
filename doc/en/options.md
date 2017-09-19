# Options/Basic

better-scroll supports lots of parameters for configuration. You can pass in the second argument when initialization, like the following:

``` js
let scroll = new BScroll('.wrapper',{
    scrollY: true,
    click: true
})
```
The code results in a clickable vertical scrolling effect. better-scroll supports lots of parameters, which can be modified to achieve more features. Usually, you don't need to modify these parameters because better-scroll has achieved the best effect for you. Next let's list the parameters that better-scroll supports.

## startX
  - Type: `Number`
  - Default:  `0`
  - Function: Initialize the postion in the horizontal axis direction,

## startY
  - Type: `Number`
  - Default: `0`
  - Usage: Initialize the postion in the vertical axis direction, take a look at the [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll).

## scrollX
  - Type: `Boolean`
  - Default: `false`
  - Usage: When setted to true, horizontal scrolling would be enabled
  - Note: This configuration is invalid when setting [eventPassthrough](/options.html#eventpassthrough) to 'horizontal'.

## scrollY
  - Type: `Boolean`
  - Default: `true`
  - Usage: When setted to true, vertical scrolling would be enabled
  - Note: This configuration is invalid when setting [eventPassthrough](/options.html#eventpassthrough) to 'vertical'.

## freeScroll
  - Type: `Boolean`
  - Default: `false`
  - Usage: In some scenes we need to scroll both horizontally and vertically, we can set  `freeScroll` to true
  - Note:  This configuration is invalid when [eventPassthrough]() isn't setted to empty.

## directionLockThreshold
  - Type: `Number`
  - Default: `5` (modification is not recommended)
  - Usage: If we need to lock the scrolling only in one direction,  we calculate the numerical difference between the absolute values of horizontal axis and vertical axis' scrolling distance at the initialization time of scrolling. When the value of the numerical difference is greater than `directionLockThreshold`, the lock direction can be determined.
  - Note: If [eventPassthrough](/options.html#eventpassthrough) is setted, `directionLockThreshold` is invalid and will always be 0.

## eventPassthrough
  - Type: `String`
  - Default: `''`
  - Optional value: `vertical`, `horizontal`
  - Usage: Sometimes we want to preserve native vertical scroll but being able to add an horizontal better-scroll (maybe a carousel). Set this to 'vertical' and the better-scroll area will react to horizontal swipes only. Vertical swipes will naturally scroll the whole page. Contrarily, set this to 'horizontal' when you want to keep natural horizontal scroll.
  - Note: The setting of  `eventPassthrough` will cause some other settings to be invalid, be careful when using it.

## click
  - Type: `Boolean`
  - Default: `false`
  - Usage: To override the native scrolling better-scroll has to inhibit some default browser behaviors, such as mouse clicks. If you want your application to respond to the click event you have to explicitly set this option to `true`. And then better-scroll will add a private attribute called ·`_constructed` to the dispatched event whose value is true. But custom click event will inhibit some native behaviors like the selection of checkbox. Please note that it is suggested to use the custom `tap` event instead (see below).

## tap
  - Type: `Boolean | String`
  - Default: `false`
  - Usage: Because better-scroll will inhibit standard click event, we can set tap to true. When the area is clicked, it will dispatch a tap event, you can add an event listener as you would do for a standard event like `element.addEventListener('tap', doSomething, false);`. If tap is setted to string, then the string value is regareded as the name of the custom event, like `tap: 'myCustomTapEvent'`.

## bounce
   - Type: `Boolean`
   - Default: `true`
   - Usage: When the scroller meets the boundary it performs a small bounce animation. Setting this to true will enable the animation.

## bounceTime
   - Type: `Number`
   - Default: `700` (ms, modification is not recommended)
   - Usage: Set the duration in millisecond of the bounce animation.

## momentum
   - Type: `Boolean`
   - Default: `true`
   - Usage: If setted to true, you can turn on the momentum animation performed when the user quickly flicks on screen.

## momentumLimitTime
   - Type: `Number`
   - Default: `300` (ms, modification is not recommended)
   - Usage: Only when the time of the user's flicking on screen is lower than `momentumLimitTime` can the momentum animation be enabled.

## momentumLimitDistance
   - Type: `Number`
   - Default: `15` (px, modification is not recommended)
   - Usage: Only when the distance of the user's flicking on screen is greater than `momentumLimitTime` can the momentum animation be enabled.

## swipeTime
   - Type: `Number`
   - Default: `2500` (ms, modification is not recommended)
   - Usage: Set the duration in millisecond of the momentum animation.

## swipeBounceTime
   - Type: `Number`
   - Default: `500` (ms，modification is not recommended)
   - Usage: Set the entire bounce animation time when the scroller meets the boundary in the case of running a momentum animation.

## deceleration
   - Type: `Number`
   - Default: `0.001` (modification is not recommended)
   - Usage: Represent the deceleration of the momentum animation.

## flickLimitTime
   - Type: `Number`
   - Default: `200` (ms, modification is not recommended)
   - Usage: Sometimes we want to cpture the user's flick action (slide a short distance in a short time). Only when the time of the user slide on screen is shorter than `flickLimitTime`, it is considered as a flick action.

## flickLimitDistance
   - Type: `Number`
   - Default: `100` (px, modification is not recommended)
   - Usage: Only when the distance of the user slide on screen is shorter than `flickLimitDistance`, it is considered as a flick action

## resizePolling
   - Type: `Number`
   - Default: `60` (ms, modification is not recommended)
   - Usage: When you resize the window better-scroll has to recalculate elements position and dimension. This might be a pretty daunting task for the poor little fella. To give it some rest the polling is set to 60 milliseconds and it is reasonable value.

## probeType
   - Type: `Number`
   - Default: `0`
   - Optional Value: `1`, `2`, `3`
   - Usage: Sometimes we want to know the scrolling position. This setting regulates the probe aggressiveness or the frequency at which the `scroll` event is fired. Valid values are: `1`, `2`, `3`. When setted to 1, The scroll event is non-real time fired (after the screen scrolled for some time); When setted to 2,  the scroll event is real-time fired during the screen scrolling; When setted to 3, the scroll event is real-time fired during not only the screen scrolling but also the momentum and bounce animation.

## preventDefault
   - Type: `Boolean`
   - Default: `true`
   - Usage: Whether or not to `preventDefault()` when events are fired. This should be left `true` unless you really know what you are doing. Usually you might use [preventDefaultException](/options.html#preventdefaultexception).

## preventDefaultException  
   - Type: Object
   - Default: `{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }`
   - Usage: better-scroll will inhibit the native scrolling and menwhile inhibit some native components' default behaviours. In this situation, we can't 'preventDefault' on these elements, so we can configure 'preventDefaultException'. Default `{tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/}` represents that default behaviours of elements with tagnames like 'input', 'textarea', 'button', 'select' will not be inhibited
   - Note: This is a pretty powerful option. Its key is the attribute value of DOM elements, the corresponding value can be a regular expression. For example, if we want to configure the element whose class name is 'test', then the configuration is `{className:/(^|\s)test(\s|$)/}`.

## HWCompositing
   - Type: `Boolean`
   - Default: `true` (modification is not recommended)
   - Usage: This option tries to put the scroller on the hardware layer by appending `translateZ(0)` to the transform CSS property. This greatly increases performance especially on mobile and achieve a good scrolling effect.
   - Note: Only browsers that support enabling hardware acceleration has the effect.

## useTransition
   - Type: `Boolean`
   - Default: `true` (modification is not recommended)
   - Usage: Whether to use CSS3 transition animation. If setted to false, the engine will use `requestAnimationFrame` to do animation. 
   - Note: Only browsers that support CSS3 has the effect.

## useTransform
   - Type: `Boolean`
   - Default: `true` (modification is not recommended)
   - Usage: By default the engine uses the `transform` CSS property. If setting this to `false`,  then use the `top`/`left` (and thus the scroller needs to be absolutely positioned).
   - Note: Only browsers that support CSS3 has the effect.

## bindToWrapper
   - Type: `Boolean`
   - Default: `false`
   - Usage: The `move` event is normally bound to the document and not the scroll container. When you move the cursor/finger out of the wrapper the scrolling keeps going. This is usually what you want, but you can also bind the move event to wrapper itself. Doing so as soon as the pointer leaves the container the scroll stops.

## disableMouse
   - Type: `Boolean`
   - Default: get the result by current browser environment (modification is not recommended)
   - Usage: When in mobile environment (supporting touch event),  disableMouse will be true and mouse event will not be listened. While in PC environment, disableMouse will be false and mouse event will be listened. We suggest not modifying this unless you konw what you are doing.

## disableTouch
   - Type: `Boolean`
   - Default: get the result by current browser environment (modification is not recommended)
   - Usage: When in mobile environment (supporting touch event),  disableMouse will be false and touch event will be listened. While in PC environment, disableMouse will be true and touch event will not be listened. We suggest not modifying this unless you konw what you are doing.
