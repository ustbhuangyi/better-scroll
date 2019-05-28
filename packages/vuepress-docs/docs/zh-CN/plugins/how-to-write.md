# 如何写一个插件

BetterScroll 的插件需要是一个类，并且具有以下特性：

- 静态的 pluginName 属性。
- constructor 中会将 bs 传入。因此你可以在插件中控制 bs。

一个最简单的插件结构如下：

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(public scroll: BScroll){
      // this.scroll 就是 BetterScroll 实例
    }
  }
```

:::warning
  插件类上面的 pluginName 属性对应的值，必须有初始化 BetterScroll 传入的 options 的顶级根属性名称对应，要不然在实例化 BetterScroll 的时候，并不会执行插件的初始化。

  ```js
  // myplugin.js
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(public scroll: BScroll){}
  }

  // main.js
  import BetterScroll from '@better-scroll/core'
  import MyPlugin from 'myplugin.js'
  BetterScroll.use(MyPlugin)

  // 传入顶级属性叫 'myPlugin' 的 options。
  // 因为 MyPlugin.pluginName 的 value 值是 'myPlugin'
  let bs = new BetterScroll('.wrapper', {
    myPlugin: {}
  })
  let myPluginInstance = bs.plugins.myPlugin
  ```
:::

## 暴露方法

bs 提供了 `proxy` 方法把插件中的方法或者属性代理到 bs 上。

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(private scroll: BScroll){
      // 注册方法和属性
      this.scroll.proxy([
        {
          key: 'newFunction',
          sourceKey: 'plugins.myPlugin.newFunction'
        },
        {
          key: 'newProperty',
          sourceKey: 'plugins.myPlugin.newProperty'
        }
      ])
    }
  }
```

## 注册钩子

调用 `registerType` 方法来给 bs 增加新的 hook，这样 bs 校验 hook 是合法的，因此你就可以触发这个钩子。

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(private scroll: BScroll){
      // 注册 hook
      this.scroll.registerType(['yourHook'])
    }
    someFunction() {
      this.scroll.trigger(this.scroll.eventTypes.yourHook) // 触发 hook
    }
  }
```
