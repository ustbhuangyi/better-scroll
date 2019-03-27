# Advanced Options

better-scroll also supports several advanced options to implement some special features.

## wheel
   - Type: `Boolean | Object`
   - Default: `false`
   - Usage: this option is used to configure Picker component. You can enable picker by configure it as an Object, like:
   ```js
     wheel:{
       selectedIndex: 0,
       rotate: 25,
       adjustTime: 400,
       wheelWrapperClass: 'wheel-scroll',
       wheelItemClass: 'wheel-item',
       wheelDisabledItemClass: 'wheel-disabled-item' // version 1.15.0
     }
   ```
   - Note: it's an advanced option which doesn't need to configure in normal scene. You can see the specific application scene in [Picker Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/picker/en) and more details in the source code of [picker component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/picker/picker.vue).

   1.If configured as an Object , `wheelWrapperClass` and `wheelItemClass` must correspond to the `wrapper` class name of your instance `better-scroll` and the subclass name within `wrapper`. The default value of both is "`wheel-scroll`"/"`wheel-item`". If you don't configure or the name of the configuration is inconsistent with the class name of your corresponding DOM node, it will cause a problem: click when scrolling up. Terminating scrolling does not trigger the `scrollEnd` event, which in turn affects the results of such components such as city selector linkage data.

   2.`wheelDisabledItemClass` is a style class name used to configure the option to disable an option. The attribute `selectedIndex` on the better-scroll instance is the index of the currently selected item. If you configure the option to disable the selected state, then `selectedIndex` will remain at -1. We implemented this with reference to the interaction of [Web select tag](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select).

## snap
   - Type: `Boolean | Object`
   - Default: `false`
   - Usage: this option is used to configure Slide component. You can enable slide by configure it as an Object, like:

   ```js
     snap: {
       loop: false,
       threshold: 0.1,
       stepX: 100,
       stepY: 100,
       easing: {
         style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
         fn: function(t) {
             return t * (2 - t)
         }
       }
     }
   ```
  Notice：`loop` set to true to support slide loop，but when there is only one element, `loop` is invalid for true, and it won't clone nodes. `threshold` is the threshold of going to the next snap,`easing` is the scroll easing function.
   - Note: it's an advanced option which doesn't need to configure in normal scene. You can see the specific application scene in [Slide Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/slide/en) and more details in the source code of [slide component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/slide/slide.vue).

## scrollbar
   - Type: `Boolean | Object`
   - Default: `false`
   - Usage: this option is used to configure scroll bar. You can enable scroll bar by configure it as true or an Object, like:
   ```js
     scrollbar: {
       fade: true,
       interactive: false // new in 1.8.0
     }
   ```
 `fade` is about whether the scroll bar fade when scroll stop, and it's true by default.`interactive` is about whether the scroll bar could be interactive.You can see [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll/en) and more details in the source code of [scroll component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

## pullDownRefresh
   - Type: `Boolean | Object`
   - Default: `false
   - Usage: this option is used to configure pulling down refresh. You can enable pulling down refresh by configure it as true or an Object, like:
    ```js
      pullDownRefresh: {
        threshold: 50,
        stop: 20
      }
    ```
 `threshold` is about the distance exceeded the border which decide the trigger of `pullingDown` event. Stop is the position where rebound stop at. When the data loading cause by pulling down is finished, you must call [`finishPullDown`](/api-specific.html#finishpulldown) method. You can see [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll/en) and more details in the source code of [scroll component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

## pullUpLoad
   - Type: `Boolean | Object`
   - Default: `false`
   - Usage: this option is used to configure pulling up load. You can enable pulling up load by configure it as true or an Object, like:
  ```js
    pullUpLoad: {
      threshold: 50
    }
  ```
 `threshold` is about the distance exceeded the border which decide the trigger of `pullingUp` event. When the data loading cause by pulling up is finished, you must call [`finishPullUp`](/api-specific.html#finishpullup) method. You can see [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll/en) and more details in the source code of [scroll component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).

## mouseWheel(v1.8.0+)
  - Type：Boolean | Object
  - Default：false
  - Usage：this option is used for PC mouse wheel. You can enable mouse wheel by configure it as true or an Object，like：
  ```js
    mouseWheel: {
      speed: 20,
      invert: false
    }
  ```
 `speed` is the speed of mouse wheel, `invert` is about whether the direction of mouse wheel and the direction of real scroll are opposite, `easeTime` is the ease time of the rolling animation. You can see [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/free-scroll/en)。

## zoom(v1.11.0+)
   - Type：Boolean | Object
   - Default：false
   - Usage：this option is used to zoom in scroll content，default to false。When you set it to true or a Object, you can zoom in，like：
  ```js
    zoom: {
      start: 1,
      min: 1,
      max: 4
    }
  ```
  `start` represents the initial scaling, `min` represents the smallest scaling, and `max` represents the maximum scaling.


## infinity(v1.12.0+)
   - Type: Boolean | Object
   - Default：false
   - Usage：The configuration scenario is long list scroll or infinity scroll, and the default is false. If the configuration is turned on, it needs to be configured as an object to implement 3 functions, like：
   ```js
     infinity: {
       fetch(count) {
          // Fetch data that is larger than count, the function is asynchronous, and it needs to return a Promise.。
          // After you have successfully fetch the data, you need resolve an array of data (or resolve Promise).
          // Each element of the array is list data, which will be rendered when the render method executes。
          // If there is no data, you can resolve (false) to tell the infinite scroll list that there is no more data。
       }
       render(item, div) {
          // Rendering each element node, item is data, and div is a container for wrapping element nodes.
          // The function needs to return to the rendered DOM node.
       },
       createTombstone() {
         // Returns a tombstone DOM node.。
       }
     }
   ```
   The specific sample code can [refer to here](https://github.com/ustbhuangyi/better-scroll/blob/master/example/pages/infinity.vue)，The corresponding [demo](https://ustbhuangyi.github.io/better-scroll/#/examples/infinity/en)。
   The implementation of infinity is a reference to [this article](https://developers.google.com/web/updates/2016/07/infinite-scroller)，on the basis of this, the ability of rolling end is added.
   Note: unless you have a lot of data rendering requirements, you can use normal scrolling.


