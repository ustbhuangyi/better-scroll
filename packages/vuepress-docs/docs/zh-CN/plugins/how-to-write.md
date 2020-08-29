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

## 事件 VS 钩子

基于 2.x 的架构设计，以及对 1.x 事件的兼容，我们延伸出两个概念 ——『**事件**』以及『**钩子**』。从本源上来说它们都是属于 `EventEmitter` 实例，只是叫法不一样。下面我们从节选的源码来讲解一下：

```typescript
  export default BScrollCore extends EventEmitter {
    hooks: EventEmitter
  }
```

  - **BScrollCore**

    本身继承了 EventEmitter。它派发出来的，我们都称之为『**事件**』。

    ```js
      let bs = new BScroll('.wrapper', {})

      // 监听 bs 的 scroll 事件
      bs.on('scroll', () => {})
      // 监听 bs 的 refresh 事件
      bs.on('refresh', () => {})
    ```

  - **BScrollCore.hooks**

    hooks 也是 EventEmitter 的实例。它派发出来的，我们都称之为『**钩子**』。

    ```js
      let bs = new BScroll('.wrapper', {})

      // 监听 bs 的 refresh 钩子
      bs.hooks.on('refresh', () => {})
      // 监听 bs 的 enable 钩子
      bs.hooks.on('enable', () => {})
    ```

相信现在大家对两者有了更好的区分吧，『**事件**』是为了 1.x 的兼容考虑，在 2.x 编写插件的时候，你应该更加关注『**钩子**』。

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
