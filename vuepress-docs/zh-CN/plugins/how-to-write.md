# 如何写一个插件

better scroll 的插件需要是一个类，并且具有以下特性：

- 静态的 pluginName 属性。
- constructor 中会将 better scroll 实例传入。因此你可以在插件中控制 better scroll。

一个最简单的插件结构如下：

```typescript
export default class MyPlugin {
  static pluginName = 'myPlugin'
  constructor(private scroll: BScroll){}
}
```

## 暴露方法

Better scroll 提供了 `proxy` 方法来将插件中的方法注册到 better scroll 实例上。

```typescript
export default class MyPlugin {
  static pluginName = 'myPlugin'
  constructor(private scroll: BScroll){
    // 注册方法和属性
    this.scroll.proxy([
      {
        key: 'newFunction',
        sourceKey: 'plugins.myPlugin.newFcuntion'
      },
      {
        key: 'newProperty',
        sourceKey: 'plugins.myPlugin.newProperty'
      }
    ])
  }
}
```

## 注册事件

调用 `registerType` 方法来给 better scroll 实例增加新的 hook，并在插件中触发它。

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