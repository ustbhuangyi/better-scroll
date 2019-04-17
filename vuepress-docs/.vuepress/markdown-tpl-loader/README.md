# markdown-tpl-loader

> markdown-loader for vue template

## Usage

```js
const rule = config.module
    .rule('markdown')
      .test(/\.code$/)

rule
  .use('markdown-tpl-loader')
    .loader(require.resolve('markdown-tpl-loader'))
    .options({
       markdown: /* instance created by @vuepress/markdown */,
       sourceDir: /* root source directory of your docs */,
    })
```
