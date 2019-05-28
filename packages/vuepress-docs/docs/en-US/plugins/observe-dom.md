# observe-dom
Enable the ability to watch for changes of scroll DOM. With this plugin, the refresh function will be called when the scroll elements change. It has the following features:

- Debounce feature for css attributions which change frequently
- If the scroll elements change occurs during the scroll animation, refresh will not be triggered.

# Usage

  ```js
    import BScroll from '@better-scroll/core'
    import ObserveDom from '@better-scroll/observe-dom'
    BScroll.use(ObserveDom)

    new BScroll('.bs-wrap', {
      //...
      observeDom: true // set observeDom to true
    })
  ```
