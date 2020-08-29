# observe-dom
Enable the ability to watch for changes of scroll DOM. With this plugin, the refresh function will be called when the scroll elements change. It has the following features:

- Debounce feature for css attributions which change frequently
- If the scroll elements change occurs during the scroll animation, refresh will not be triggered.

## Install

```bash
npm install @better-scroll/observe-dom --save

// or

yarn add @better-scroll/observe-dom
```

# Usage

  ```js
    import BScroll from '@better-scroll/core'
    import ObserveDOM from '@better-scroll/observe-dom'
    BScroll.use(ObserveDOM)

    new BScroll('.bs-wrap', {
      //...
      observeDOM: true // init observe-dom plugin
    })
  ```
