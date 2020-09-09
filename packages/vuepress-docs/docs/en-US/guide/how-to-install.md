# Install

## NPM

BetterScroll is hosted on NPM and executed with the following command:

```bash
npm install @better-scroll/core --save

// or

yarn add @better-scroll/core
```

The next step is to use it in the code. [webpack](https://webpack.js.org/) and other build tools support the introduction of code from `node_modules` :

``` js
import BScroll from '@better-scroll/core'
```

If it is the syntax of commonjs, as follows:

``` js
var BScroll = require('@better-scroll/scroll')
```

## Script

BetterScroll also supports direct loading with script, which loads a BScroll object on the window after loading.

```html
<script src="https://unpkg.com/@better-scroll/core@latest/dist/core.js"></script>

<!-- minify -->
<script src="https://unpkg.com/@better-scroll/core@latest/dist/core.min.js"></script>
```

```js
let wrapper = document.getElementById("wrapper")
let bs = new BScroll(wrapper, {})
```

## BetterScroll with all plugins

```bash
npm install better-scroll --save

// or

yarn add better-scroll
```

```js
  import BetterScroll from 'better-scroll'
  let bs = new BetterScroll('.wrapper', {})
```

Use script.

```html
<script src="https://unpkg.com/better-scroll@latest/dist/better-scroll.js"></script>

<!-- minify -->
<script src="https://unpkg.com/better-scroll@latest/dist/better-scroll.min.js"></script>
```

```js
  let bs = BetterScroll.createBScroll('.wrapper', {})
```