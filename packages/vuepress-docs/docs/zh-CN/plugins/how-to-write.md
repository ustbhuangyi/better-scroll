# 如何写一个插件

BetterScroll 的插件需要是一个类，并且具有以下特性：

  - 静态的 pluginName 属性。
  - constructor 的第一个参数就是 BetterScroll 实例 `bs`，你可以通过 bs 的**事件**或者**钩子**来注入自己的逻辑。

最简单的插件骨架如下：

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(public scroll: BScroll){
      // this.scroll is BetterScroll instance
    }
  }
```

但是我们需要深入了解更好的细节，才能写出一个逻辑完备、功能强大的 BetterScroll 插件。请继续往下阅读。

## 代理方法或者属性

如果你想要将插件的**方法**或者**属性**暴露出去，bs 提供了 `proxy` 方法代理至 bs。

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

      // 通过 bs 获取插件的属性或者方法
      this.scroll.newFunction // myPlugin.newFunction 方法的别名
      this.scroll.newProperty // myPlugin.newFunction 属性的别名
    }
  }
```

## 注册事件

调用 `registerType` 方法来给 bs 增加新事件，要不然在监听或者触发事件的时候会被检验为非法事件并且报错。

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(private scroll: BScroll){
      // 注册事件
      this.scroll.registerType(['yourEventName'])
    }
    someFunction() {
      // 安全触发事件
      this.scroll.trigger(this.scroll.eventTypes.yourEventName)
    }
  }
```
