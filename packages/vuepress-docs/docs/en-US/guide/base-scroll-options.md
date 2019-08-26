# Options

BetterScroll supports rich options configuration, you can pass them in the second parameter when initializing, for example:

``` js
import BScroll from '@better-scroll/core'
let scroll = new BScroll('.wrapper',{
    scrollY: true,
    click: true
})
```

This implements a list of vertical clickable scrolling effects. so let's list the parameters supported by BetterScroll.

## startX
  - Type：`Number`
  - Default:  `0`
  - Function：Initialize the postion in the horizontal axis direction.

## startY
  - Type：`Number`
  - Default:  `0`
  - Function：Initialize the postion in the vertical axis direction.

## scrollX
  - Type: `Boolean`
  - Default: `false`
  - Usage: When set to true, horizontal scrolling would be enabled
  - Note: This configuration is invalid when setting [eventPassthrough](./base-scroll-options.html#eventpassthrough) to 'horizontal'.

## scrollY
  - Type: `Boolean`
  - Default: `true`
  - Usage: When set to true, vertical scrolling would be enabled
  - Note: This configuration is invalid when setting [eventPassthrough](./base-scroll-options.html#eventpassthrough) to 'vertical'.

## freeScroll
  - Type: `Boolean`
  - Default: `false`
  - Usage: In some scenes we need to scroll both horizontally and vertically, we can set  `freeScroll` to true
  - Note:  This configuration is invalid when [eventPassthrough](./base-scroll-options.html#eventpassthrough) isn't set to empty.

## directionLockThreshold
  - Type: `Number`
  - Default: `5` (modification is not recommended)
  - Usage: If we need to lock the scrolling only in one direction,  we calculate the numerical difference between the absolute values of horizontal axis and vertical axis' scrolling distance at the initialization time of scrolling. When the value of the numerical difference is greater than `directionLockThreshold`, the lock direction can be determined.
  - Note: If [eventPassthrough](./base-scroll-options.html#eventpassthrough) is set, `directionLockThreshold` is invalid and will always be 0.

## eventPassthrough
  - Type: `String`
  - Default: `''`
  - Optional value: `vertical`, `horizontal`
  - Usage: Sometimes we want to preserve native vertical scroll but being able to add an horizontal BetterScroll (maybe a carousel). Set this to 'vertical' and the BetterScroll area will react to horizontal swipes only. Vertical swipes will naturally scroll the whole page. Contrarily, set this to 'horizontal' when you want to keep natural horizontal scroll.
  - Note: The setting of  `eventPassthrough` will cause some other settings to be invalid, be careful when using it.

## click
  - Type: `Boolean`
  - Default: `false`
  - Usage: To override the native scrolling BetterScroll has to inhibit some default browser behaviors, such as mouse clicks. If you want your application to respond to the click event you have to explicitly set this option to `true`. And then BetterScroll will add a private attribute called `_constructed` to the dispatched event whose value is true.


## dblclick
  - Type：`Boolean | Object`
  - Default：`false`
  - Usage：Send dblclick event. When configured to true, by default the two times click delay is 300 ms. If configured to an object, the `delay` can be modified.
  ```js
    dblclick: {
      delay: 300
    }
  ```

## tap
  - Type：String
  - Default：`''`
  - Function：Since BetterScroll will block the native click event, we can set tap to 'tap', which will dispatch a tap event when the region is clicked. You can listen to it as if it were listening to native events.

## bounce
   - Type：`Boolean | Object`
   - Default：true
   - Function：When the scroller meets the boundary it performs a small bounce animation. Setting this to true will enable the animation.
   ```js
     bounce: {
       top: true,
       bottom: true,
       left: true,
       right: true
     }
   ```
   `bounce` can support the effect of closing the back of some edges. You can set the `key` of the corresponding side to `false`.

## bounceTime
   - Type：`Number`
   - Default：Default: `800` (ms, modification is not recommended)
   - Function：Set the duration in millisecond of the bounce animation.

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
   - Default: `0.0015` (modification is not recommended)
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
   - Usage: When you resize the window BetterScroll has to recalculate elements position and dimension. This might be a pretty daunting task for the poor little fella. To give it some rest the polling is set to 60 milliseconds and it is reasonable value.

## probeType
   - Type: `Number`
   - Default: `0`
   - Optional Value: `1`, `2`, `3`
   - Usage: Sometimes we want to know the scrolling position. This setting regulates the probe aggressiveness or the frequency at which the `scroll` event is fired. Valid values are: `1`, `2`, `3`. When setted to 1, The scroll event is non-real time fired (after the screen scrolled for some time); When setted to 2,  the scroll event is real-time fired during the screen scrolling; When setted to 3, the scroll event is real-time fired during not only the screen scrolling but also the momentum and bounce animation. If not setted, the default value `0` means there is no scroll event is fired.

## preventDefault
   - Type: `Boolean`
   - Default: `true`
   - Usage: Whether or not to `preventDefault()` when events are fired. This should be left `true` unless you really know what you are doing.

## preventDefaultException
   - Type: Object
   - Default: `{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/ }`
   - Usage: BetterScroll will inhibit the native scrolling and meanwhile inhibit some native components' default behaviours. In this situation, we can't 'preventDefault' on these elements, so we can configure 'preventDefaultException'. Default `{tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/}` represents that default behaviours of elements with tagnames like 'input', 'textarea', 'button', 'select', 'audio' will not be inhibited
   - Note: This is a pretty powerful option. Its key is the attribute value of DOM elements, the corresponding value can be a regular expression. For example, if we want to configure the element whose class name is 'test', then the configuration is `{className:/(^|\s)test(\s|$)/}`.

## tagException
   - Type: Object
   - Default`{ tagName: /^TEXTAREA$/ }`
   - Usage: If BetterScroll nests form elements such as `textarea`, the user's expectation should be that sliding textarea should not cause bs scrolling. If the manipulated DOM (eg:textarea tag) hits the configured rule, `bs` won't scroll.
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

## bindToWrapper
   - Type: `Boolean`
   - Default: `false`
   - Usage: The `move` event is normally bound to the document and not the scroll container. When you move the cursor/finger out of the wrapper the scrolling keeps going. This is usually what you want, but you can also bind the move event to wrapper itself. Doing so as soon as the pointer leaves the container the scroll stops.

## disableMouse
   - Type: `Boolean`
   - Default: get the result by current browser environment (modification is not recommended)
   - Usage: When in mobile environment (supporting touch event),  disableMouse will be `true` and mouse event will not be listened. While in PC environment, disableMouse will be `false` and mouse event will be listened. We suggest not modifying this unless you konw what you are doing.

## disableTouch
   - Type: `Boolean`
   - Default: get the result by current browser environment (modification is not recommended)
   - Usage: When in mobile environment (supporting touch event),  `disableTouch` will be `false` and touch event will be listened. While in PC environment, `disableMouse` will be `true` and touch event will not be listened. We suggest not modifying this unless you konw what you are doing.

  ::: warning
  Considering some specific scenarios of the user, such as **the tablet needs to support the touch event, the tablet access mouse has to support the mouse event**, In other words, if you need to listen to the touch and mouse events at the same time, then the instantiation of bs needs to be configured as follows:

  ```js
  let bs = new BScroll('.wrapper', {
    disableMouse: false,
    disableTouch: false
  })
  ```
  :::

## autoBlur
   - Type：`Boolean`
   - Default：`true`
   - Usage：It will auto blur the active element(input、textarea) before scroll start.

## stopPropagation
   - Type：`Boolean`
   - Default：`false`
   - Usage：Whether stop event propagation. It is often used in nested scroll scenes.
