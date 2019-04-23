# zoom

Add zoom functionality for better scroll.

# Usage

It is required for zoom functionality than importing zoom plugin and calling the global function `BScroll.use()`.

```js
import BScroll from 'BScroll'
import Zoom from 'zoom'

BScroll.use(Zoom)
```

The zoom functionality has been added into Better Scroll after the above steps are completed. But if you want the zoom functionality to take effect, you need to pass in the correct configuration in `options`, for example:

```js
new BScroll('.bs-wrap', {
  freeScroll: true,
  scrollX: true,
  scrollY: true,
  disableMouse: true,
  useTransition: true,
  zoom: {
    start: 1,
    min: 0.5,
    max: 2
  }
})
```
The following are the configuration related to the zoom:

- zoom

  Enable zoom functionality. That is to say, the zoom plugin won't work without the zoom option. This option is also be used to set the zoom feature. Refer to [zoom options](./zoom.html#zoom-options)] for more details.

- freeScroll
  If you want to scroll in x and y axies after zooming in, the freeScroll value should be set to true. In addtional, scrollX and scrollY are also need to be true.

- scrollX
  `true` is be required if you want to scroll in x axies after zooming in.

- scrollY
  `true` is be required if you want to scroll in y axies after zooming in.

<demo>
  <template slot="code-template">
    <<< @/example/vue/demo/zoom/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/example/vue/demo/zoom/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/example/vue/demo/zoom/default.vue?style
  </template>
  <zoom-default slot="demo"></zoom-default>
</demo>

# options

|name|type|description|default|example|
|----------|:-----:|:-----------|:--------:|:-------|
|start|number|the benchmark ratio of scalling begin to zoom|-|start:1|
|min|number|the smallest scaling|-|min:0.5|
|max|number|the maximum scaling|-|max:2|

# api

## zoomTo(scale, x, y)

zoom the scroller to the specified size.

**Arguments**:

|name|type|description|
|----------|:-----:|:-----------|
|scale|number|zoom size|
|x|number|X coordinate of the zoom origin, relative to the left edge of the entire document|
|y|number|Y coordinate of the zoom origin, relative to the top edge of the entire document|

**Return**: void

