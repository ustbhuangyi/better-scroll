# 安装

## NPM

BetterScroll 托管在 NPM 上，执行如下命令安装：

```js
npm install @better-scroll/core --save

// or

yarn add @better-scroll/core
```

接下来就可以在代码中引入了，[webpack](https://webpack.js.org/) 等构建工具都支持从 node_modules 里引入代码：

``` js
import BScroll from '@better-scroll/core'
```

如果是 commonjs 的语法，如下：

``` js
var BScroll = require('@better-scroll/scroll')
```

## script 加载

BetterScroll 也支持直接用 script 加载的方式，加载后会在 window 上挂载一个 BScroll 的对象。
