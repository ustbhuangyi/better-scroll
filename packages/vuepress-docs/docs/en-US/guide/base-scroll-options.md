# Options

BetterScroll supports rich options configuration, you can pass them in the second parameter when initializing, for example:

```js
import BScroll from '@better-scroll/core'
let scroll = new BScroll('.wrapper',{
    scrollY: true,
    click: true
})
```

This implements a list of vertical clickable scrolling effects. so let's list the parameters supported by BetterScroll.

## startX
  - **Type**: `number`
  - **Default**:  `0`
  - **Details**: Initialize the postion in the horizontal axis direction.

## startY
  - **Type**: `number`
  - **Default**:  `0`
  - **Details**: Initialize the postion in the vertical axis direction.

## scrollX
  - **Type**: `boolean`
  - **Default**: `false`
  - **Usage**: When set to true, horizontal scrolling would be enabled
  - **Note**: This configuration is invalid when setting [eventPassthrough](./base-scroll-options.html#eventpassthrough) to 'horizontal'.

## scrollY
  - **Type**: `boolean`
  - **Default**: `true`
  - **Usage**: When set to true, vertical scrolling would be enabled
  - **Note**: This configuration is invalid when setting [eventPassthrough](./base-scroll-options.html#eventpassthrough) to 'vertical'.

## freeScroll
  - **Type**: `boolean`
  - **Default**: `false`
  - **Usage**: By default, because human fingers cannot perform absolute vertical or horizontal movement, there will be horizontal and vertical offsets during a finger operation. The internal default will abandon the smaller offset direction , Keep scrolling in the other direction. But in some scenes, we need to calculate the horizontal and vertical finger offset distances at the same time, instead of only calculating the direction with a larger offset. At this time, we only need to set `freeScroll` to true.
  - **Note**:  This configuration is invalid when [eventPassthrough](./base-scroll-options.html#eventpassthrough) isn't set to empty.
  - **Examples**
  ```js
  // finger startpoint -> e1: { pageX: 120, pageY: 120 }
  // finger endpoint -> e2: { pageX: 121, pageY: 140 }
  // offsetX:  e2.pageX - e1.pageX = 1
  // offsetY:  e2.pageY - e1.pageY = 20
  // if freeScroll is false,  due to offsetY > offsetX + directionLockThreshold
  // offsetX is fixed to be 0, only calculate offsetY, thus do a vertical scroll!
  ```

## directionLockThreshold
  - **Type**: `number`
  - **Default**: `5`
  - **Usage**: when `freeScroll` is false, we need to lock the scrolling only in one direction,  we calculate the numerical difference between the absolute values of horizontal axis and vertical axis' scrolling distance at the initialization time of scrolling. When the value of the numerical difference is greater than `directionLockThreshold`, the lock direction can be determined.
  - **Note**: If [eventPassthrough](./base-scroll-options.html#eventpassthrough) is set, `directionLockThreshold` is invalid and will always be 0.

## eventPassthrough
  - **Type**: `string`
  - **Default**: `''`
  - Optional value: `vertical | horizontal`
  - **Usage**: Sometimes we want to preserve native vertical scroll but being able to add an horizontal BetterScroll (maybe a carousel). Set this to 'vertical' and the BetterScroll area will react to horizontal swipes only. Vertical swipes will naturally scroll the whole page. Contrarily, set this to 'horizontal' when you want to keep natural horizontal scroll.
  - **Note**: The setting of  `eventPassthrough` will cause some other settings to be invalid, be careful when using it.

## click
  - **Type**: `boolean`
  - **Default**: `false`
  - **Usage**: To override the native scrolling BetterScroll has to inhibit some default browser behaviors, such as mouse clicks. If you want your application to respond to the click event you have to explicitly set this option to `true`. And then BetterScroll will add a private attribute called `_constructed` to the dispatched event whose value is true.


## dblclick
  - **Type**: `boolean | Object`
  - **Default**: `false`
  - **Usage**: Send dblclick event. When configured to true, by default the two times click delay is 300 ms. If configured to an object, the `delay` can be modified.
  ```js
	dblclick: {
		delay: 300
	}
  ```

## tap
  - **Type**: `string`
  - **Default**: `''`
  - **Details**: Since BetterScroll will block the native click event, we can set tap to 'tap', which will dispatch a tap event when the region is clicked. You can listen to it as if it were listening to native events.

## bounce
   - **Type**: `boolean | Object`
   - **Default**: `true`
   - **Details**: When the content element meets the boundary it performs a small bounce animation. Setting this to true will enable the animation.
   ```js
		bounce: {
			top: true,
			bottom: true,
			left: true,
			right: true
		}
   ```
   `bounce` can support the effect of closing the back of some edges. You can set the `key` of the corresponding side to `false`.

  :::tip
  If you want to conveniently set all edges to **true** or **false**, you only need to set `bounce` to **true** or **false**.
  :::


## bounceTime
   - **Type**: `number`
   - **Default**: Default: `800` (ms, modification is not recommended)
   - **Details**: Set the duration in millisecond of the bounce animation.

## momentum
   - **Type**: `boolean`
   - **Default**: `true`
   - **Usage**: If setted to true, you can turn on the momentum animation when the user quickly flicks on screen.

## momentumLimitTime
   - **Type**: `number`
   - **Default**: `300` (ms)
   - **Usage**: Only when the time of the user's flicking on screen is lower than `momentumLimitTime` resulting in the momentum animation.

## momentumLimitDistance
   - **Type**: `number`
   - **Default**: `15` (px)
   - **Usage**: Only when the distance of the user's flicking on screen is greater than `momentumLimitTime` resulting in the momentum animation.

## swipeTime
   - **Type**: `number`
   - **Default**: `2500` (ms)
   - **Usage**: Set the duration in millisecond of the momentum animation.

## swipeBounceTime
   - **Type**: `number`
   - **Default**: `500` (ms)
   - **Usage**: Set the entire bounce animation time when the content element meets the boundary in the case of running a momentum animation.

## deceleration
   - **Type**: `number`
   - **Default**: `0.0015`
   - **Usage**: Represent the deceleration of the momentum animation.

## flickLimitTime
   - **Type**: `number`
   - **Default**: `200`
   - **Usage**: Sometimes we want to cpture the user's flick action (slide a short distance in a short time). Only when the time of the user slide on screen is shorter than `flickLimitTime`, it is considered as a flick action.

## flickLimitDistance
   - **Type**: `number`
   - **Default**: `100`
   - **Usage**: Only when the distance of the user slide on screen is shorter than `flickLimitDistance`, it is considered as a flick action

## resizePolling
   - **Type**: `number`
   - **Default**: `60` (ms)
   - **Usage**: When you resize the window BetterScroll has to recalculate elements position and dimension. This might be a pretty daunting task for the poor little fella. To give it some rest the polling is set to 60 milliseconds and it is reasonable value.

## probeType
   - **Type**: `number`
   - **Default**: `0`
   - **Optional Value**: `1 | 2 | 3`
   - **Usage**: Deciding whether to dispatch the scroll event, this has an impact on the performance of the page, especially in the mode where `useTransition` is true.

   ```js
   // There are two scenarios for dispatching scroll:
   // 1. The finger acts on the scrolling area (content DOM),
   // 2. Invoke the scrollTo method or trigger the momentum scroll animation (in fact, the implementation is still Invoking the scrollTo method)

   // For the v2.1.0, the probeType has been unified

   // The probeType is:
   // 0, scroll event will not be dispatched at any time，
   // 1, and only when the finger is moving on the scroll area, a scroll event is dispatched every momentumLimitTime milliseconds.
   // 2, and only when the finger is moving on the scroll area, a scroll event is dispatched all the time.
   // 3, scroll events are dispatched at any time, including invoking scrollTo or triggering momentum
   ```

## preventDefault
   - **Type**: `boolean`
   - **Default**: `true`
   - **Usage**: Whether or not to `preventDefault()` when events are fired. This should be left `true` unless you really know what you are doing.

## preventDefaultException
   - **Type**: Object
   - **Default**: `{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/ }`
   - **Usage**: BetterScroll will inhibit the native scrolling and meanwhile inhibit some native components' default behaviours. In this situation, we can't 'preventDefault' on these elements, so we can configure 'preventDefaultException'. Default `{tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/}` represents that default behaviours of elements with tagnames like 'input', 'textarea', 'button', 'select', 'audio' will not be inhibited
   - **Note**: This is a pretty powerful option. Its key is the attribute value of DOM elements, the corresponding value can be a regular expression. For example, if we want to configure the element whose class name is 'test', then the configuration is `{className:/(^|\s)test(\s|$)/}`.

## tagException
   - **Type**: `Object`
   - **Default**: `{ tagName: /^TEXTAREA$/ }`
   - **Usage**: If BetterScroll nests form elements such as `textarea`, the user's expectation should be that sliding textarea should not cause bs scrolling. If the manipulated DOM (eg:textarea tag) hits the configured rule, `bs` won't scroll.
   - **Note**: This is a pretty powerful option. Its key is the attribute value of DOM elements, the corresponding value can be a regular expression. For example, if we want to configure the element whose class name is 'test', then the configuration is `{className:/(^|\s)test(\s|$)/}`.

## HWCompositing
   - **Type**: `boolean`
   - **Default**: `true`
   - **Usage**: This option tries to put the content element on the hardware layer by appending `translateZ(1px)` to the transform CSS property. This greatly increases performance especially on mobile and achieve a good scrolling effect.
   - **Note**: Only browsers that support enabling hardware acceleration has the effect.

## useTransition
   - **Type**: `boolean`
   - **Default**: `true`
   - **Usage**: Whether to use CSS3 transition animation. If setted to false, the engine will use `requestAnimationFrame` to do animation.

## bindToWrapper
   - **Type**: `boolean`
   - **Default**: `false`
   - **Usage**: The `touchmove` event is normally bound to the document and not the scroll wrapper. When you move the cursor out of the wrapper the scrolling keeps going(only works in PC). This is usually what you want, but you can also bind the move event to wrapper itself. Doing so as soon as the cursor leaves the wrapper the scroll stops.
   - **Note**: For the mobile, even if the touchmove event is bound to the wrapper, the wrapper can still be moved if the finger leaves the wrapper.

## disableMouse
   - **Type**: `boolean`
   - **Default**: get the result by current browser environment
   - **Usage**: When in mobile environment (supporting touch event),  disableMouse will be `true` and mouse event will not be listened. While in PC environment, disableMouse will be `false` and mouse event will be listened.

## disableTouch
   - **Type**: `boolean`
   - **Default**: get the result by current browser environment
   - **Usage**: When in mobile environment (supporting touch event),  `disableTouch` will be `false` and touch event will be listened. While in PC environment, `disableMouse` will be `true` and touch event will not be listened. We suggest not modifying this unless you konw what you are doing.

  ::: warning
  Considering some specific scenarios of the user, such as **the tablet needs to support the touch event, the tablet with mouse has to support the mouse event**, In other words, if you need to listen to the touch and mouse events at the same time, then the instantiation of BetterScroll needs to be configured as follows:

  ```js
  let bs = new BScroll('.wrapper', {
    disableMouse: false,
    disableTouch: false
  })
  ```

  Due to the different bottom-level implementation logic of different devices and different browser environments, BetterScroll's internal calculations of whether to listen to `touch` or `mouse` events may make wrong judgment, so you can solve this type of problem according to the above option configuration.
  :::

## autoBlur
   - **Type**: `boolean`
   - **Default**: `true`
   - **Usage**: It will auto blur the active element(input、textarea) before scroll start.

## stopPropagation
   - **Type**: `boolean`
   - **Default**: `false`
   - **Usage**: Whether stop event propagation. It is often used in nested scroll scenes.

## bindToTarget
   - **Type**: `boolean`
   - **Default**: `false`
   - **Usage**: Bind touch or mouse events to the `content` element instead of the container `wrapper`, which is mostly used in [movable](../plugins/movable.html).

## autoEndDistance
   - **Type**: `number`
   - **Default**: `5`
   - **Usage**: When the finger operation is crazy, the `touchend` event may not be triggered when sliding out of the viewport, so the function of autoEndDistance is to automatically call the touchend event when the finger is about to leave the current viewport. When the default distance is 5px from the boundary, the scrolling ends.

## outOfBoundaryDampingFactor
   - **Type**: `number`
   - **Default**: `1 / 3`
   - **Usage**: When out of boundary, the damping behavior is performed. The smaller the damping factor, the greater the resistance. Value range: [0, 1].

## specifiedIndexAsContent <Badge text='2.0.4' />
   - **Type**: `number`
   - **Default**: `0`
   - **Usage**: Specify the child element corresponding to the index of the `wrapper` as the `content`. By default, BetterScroll uses the first child element of the `wrapper` as the content.

   ```html
   <div class="wrapper">
      <div class="content1">
         <div class="conten1-item">1.1</div>
         <div class="conten1-item">1.2</div>
      </div>
      <div class="content2">
         <div class="conten2-item">2.1</div>
         <div class="conten2-item">2.2</div>
      </div>
   </div>
   ```

   ```js
   // For the above DOM structure, when BetterScroll version <= 2.0.3, only div.content1 is used as content
   // When the version is >= 2.0.4, content can be specified through 'specifiedIndexAsContent'

   let bs = new BScroll('.wrapper', {
      specifiedIndexAsContent: 1 // use div.content2 as BetterScroll's content
   })
   ```

## quadrant <Badge text='2.3.0' />
   - **Type**: `1 | 2 | 3 | 4`
   - **Default**: `1`
   - **Usage**: When the ancestor elements of BetterScroll's wrapper DOM are forced to rotate by CSS, the original displacements in the x and y directions need to perform a certain transformation to ensure a reasonable interaction.

   ```html
   <style>
   /* wrapper's parent DOM rotated*/
   .container {
      transform: rotate(90deg);
   }
   </style>
   <div class="container">
      <div class="wrapper">
         <div class="content">
            <div class="content-item">1.1</div>
            <div class="content-item">1.2</div>
         </div>
      </div>
   </div>
   ```

   ```js
   let bs = new BScroll('.wrapper', {
      quadrant: 2
   })
   ```

   1. When the rotation angle of the parent element or ancestor element of the `wrapper` is (315, 45], the quadrant can keep the default value;
   2. When the rotation angle of the parent element or ancestor element of the `wrapper` is (45, 135],Especially **90 degrees**,  the quadrant **must** be `2`;
   3. When the rotation angle of the parent element or ancestor element of the `wrapper` is (135, 225],Especially **180 degrees**,  the quadrant **must** be `3`;
   4. When the rotation angle of the parent element or ancestor element of the `wrapper` is (225, 315],Especially **270 degrees**,  the quadrant **must** be `4`;
   5. When the rotation angle is special, such as 30 degrees or 200 degrees, you may not be satisfied with the built-in transformation logic. You can customize your own transformation logic through the `coordinateTransformation` hook.

   ```js
   let bs = new BScroll('.wrapper', {
      quadrant: 1 // default value
   })
   bs.scroller.actions.hooks.on(
      bs.scroller.actions.hooks.eventTypes.coordinateTransformation,
      (transformateDeltaData) => {
         // get user finger moved distance
         const originDeltaX = transformateDeltaData.deltaX
         const originDeltaY = transformateDeltaData.deltaY

         // apply transformation
         transformateDeltaData.deltaX = originDeltaY
         transformateDeltaData.deltaY = originDeltaX

         // transformateDeltaData.deltaX will be used as content DOM style's translateX
         // transformateDeltaData.deltaY will be used as content DOM style's translateY
      }
   )
   ```

   For example: Use CSS to flip the horizontal scrolling BetterScroll.

   <demo qrcode-url="core/horizontal-rotated">
      <template slot="code-template">
         <<< @/examples/vue/components/core/horizontal-rotated.vue?template
      </template>
      <template slot="code-script">
         <<< @/examples/vue/components/core/horizontal-rotated.vue?script
      </template>
      <template slot="code-style">
         <<< @/examples/vue/components/core/horizontal-rotated.vue?style
      </template>
      <core-horizontal-rotated slot="demo"></core-horizontal-rotated>
   </demo>