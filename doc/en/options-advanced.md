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
       wheelItemClass: 'wheel-item'
     }  
   ```
   - Note: it's an advanced option which doesn't need to configure in normal scene. You can see the specific application scene in [Picker Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/picker/en) and more details in the source code of [picker component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/picker/picker.vue).

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
  Notice：`loop` set to true to support slide loop，but not in vertical axis, `threshold` is the threshold of going to the next snap,`easing` is the scroll easing function.
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
 `threshold` is about the distance exceeded the border which decide the trigger of `pullingUp` event. When the data loading cause by pulling up is finished, you must call [`finshiPullUp`](/api-specific.html#finishpullup) method. You can see [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll/en) and more details in the source code of [scroll component](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue).
 
## mouseWheel(v1.8.0+)    
  - Type：Boolean | Object
  - Default：false
  - Usage：this option is used for PC mouse wheel，You can enable mouse wheel by configure it as true or an Object，like：
  ```js
    mouseWheel: {
      speed: 20,
      invert: false
    }
  ``` 
 `speed` is the speed of mouse wheel，`invert` is about whether the direction of mouse wheel and the direction of real scroll are opposite. You can see [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/free-scroll/en)。

