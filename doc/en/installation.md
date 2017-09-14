# 安装

## NPM

better-scroll 托管在 Npm 上，执行如下命令安装：

```
npm install better-scroll --save
```

接下来就可以在代码中引入了，[webpack](https://webpack.js.org/) 等构建工具都支持从 node_modules 里引入代码：

``` js
import BScroll from 'better-scroll'
```

如果是 ES5 的语法，如下：
``` js
var BScroll = require('better-scroll')

```

## script 加载

better-scroll 也支持直接用 script 加载的方式，加载后会在 window 上挂载一个 BScroll 的对象。 

你可以直接用：`https://unpkg.com/better-scroll@1.0.1/dist/bscroll.min.js` 这个地址。也可以把 dist 目录下的文件拷贝出去发布到自己的 cdn 服务器。
