# How to write a plugin

A better scroll plugin should be a class with the following feature:

- Has a static `pluginName` property.
- The first arguments of constructor is better scroll instance. You can fetch or change all the properties in better scroll instance in your plugin.

The simplest plugin is as follow:

```typescript
export default class MyPlugin {
  static pluginName = 'myPlugin'
  constructor(private scroll: BScroll){}
}
```

## Expose functions

`proxy` function can be used to register functions in the plugin to the better scroll instance.

```typescript
export default class MyPlugin {
  static pluginName = 'myPlugin'
  constructor(private scroll: BScroll){
    // register functions or properties
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

## Register hooks

You can add new hooks to better scroll instance by calling `registerType` function. Then you can trigger this hooks in somewhere.

```typescript
export default class MyPlugin {
  static pluginName = 'myPlugin'
  constructor(private scroll: BScroll){
    // register a hook
    this.scroll.registerType(['yourHook'])
  }
  someFunction() {
    this.scroll.trigger(this.scroll.eventTypes.yourHook) // trigger a hook
  }
}
```