# FAQ

### Why can't BetterScroll scroll is failed when initialization?

BetterScroll scrolling principle is that the height/width of the `content` element exceeds the height/width of the `wrapper` element. Also, if your content element contains images of a non-fixed size, you must call the `refresh()` method to ensure that the height is calculated correctly after the image has been loaded. There is also a situation where the form element exists on the page. After the keyboard is popped up, the palatable height of the page is compressed, causing `bs` to not work properly, and the `refresh()` method is still need to be called.

### Why can't the click event in the BetterScroll area be triggered?

By default, BetterScroll blocks the browser's native click event. If you want the click event to take effect, BetterScroll dispatches a click event and the `_constructed` of the event parameter is true. The configuration items are as follows:

```js
import BScroll from '@better-scroll/core'

let bs = new BScroll('./div', {
  click: true
})
```

### Why does my BetterScroll listen for the `scroll` hook and the listener doesn't execute?

BetterScroll uses the `probeType` configuration item to decide whether to dispatch the `scroll` hook because there is some performance penalty. When the `probeType` is `2`, the event will be dispatched in real time. When the `probeType` is `3`, the event will be dispatched during the `momentum` animation. The recommended setting is `3`.

```js
import BScroll from '@better-scroll/core'

let bs = new BScroll('./div', {
  probeType: 3
})
```

### Slide used horizontal scrolling, found that vertical scrolling in the slide area is invalid?

If you want to keep your browser's native vertical scrolling, you need the following configuration items:

```js
import BScroll from '@better-scroll/core'

let bs = new BScroll('./div', {
  eventPassthrough: 'vertical'
})
```
