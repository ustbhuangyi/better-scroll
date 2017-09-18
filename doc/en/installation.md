# Installation

## NPM

better-scroll is hosted at Npm, you can install it by the following command:

```
npm install better-scroll --save
```

Next you can import better-scroll to your code. Building tools like [webpack](https://webpack.js.org/) all support importing code from node_modules:

``` js
import BScroll from 'better-scroll'
```

If you use the syntax of ES5, the code is as following:

``` js
var BScroll = require('better-scroll')
```

## script load

better-scroll also supports the way of loading script directly. There will be a BScroll object in window when loaded.

You can use the following address:  `https://unpkg.com/better-scroll@1.0.1/dist/bscroll.min.js`. Alternative is copying the files in the directory of dist and publishing them in your own cdn servers.