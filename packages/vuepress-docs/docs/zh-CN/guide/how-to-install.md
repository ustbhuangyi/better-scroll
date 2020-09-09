# 安装

## NPM

BetterScroll 托管在 NPM 上，执行如下命令安装：

```bash
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

```html
<script src="https://unpkg.com/@better-scroll/core@latest/dist/core.js"></script>

<!-- minify -->
<script src="https://unpkg.com/@better-scroll/core@latest/dist/core.min.js"></script>
```

```js
let wrapper = document.getElementById("wrapper")
let bs = new BScroll(wrapper, {})
```

## 具备所有插件能力的 BetterScroll

```bash
npm install better-scroll --save

// or

yarn add better-scroll
```

```js
import BetterScroll from 'better-scroll'
let bs = new BetterScroll('.wrapper', {})
```

也可以通过 CDN 加载。

```html
<script src="https://unpkg.com/better-scroll@latest/dist/better-scroll.js"></script>

<!-- minify -->
<script src="https://unpkg.com/better-scroll@latest/dist/better-scroll.min.js"></script>
```

```js
let bs = BetterScroll.createBScroll('.wrapper', {})
```