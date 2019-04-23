# observe-dom
Enable the ability to watch for changes of scroll dom. With this plugin, the refresh function will be called when the scroll elements change. It has the following features:
- debounce feature for css attributions which change frequently
- If the document element change occurs during the scroll animation, refresh will not be triggered.

# Usage

```js
import BScroll from 'BScroll'
import ObserveDom from 'ObserveDom'
BScroll.use(ObserveDom)

new BScroll('.bs-wrap', {
  //...
  observeDom: true // set observeDom to true
})
```