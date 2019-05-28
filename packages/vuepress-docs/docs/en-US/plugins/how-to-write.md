# How to write a plugin

A BetterScroll plugin should be a class with the following feature:

- Has a static `pluginName` property.
- The first arguments of constructor is BetterScroll instance(`bs`). You can fetch or change all the properties of `bs` in your plugin.

The simplest plugin is as follow:

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(public scroll: BScroll){
      // this.scroll is BetterScroll instance
    }
  }
```

:::warning
  The value corresponding to the pluginName property on the plugin class must have the top-level root property name that initializes the options passed to BetterScroll. Otherwise, the plugin initialization will not be executed when initing BetterScroll.

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

  // Pass in the options of the top-level property called 'myPlugin'.
  // Because the value of MyPlugin.pluginName is 'myPlugin'.
  let bs = new BetterScroll('.wrapper', {
    myPlugin: {}
  })
  let myPluginInstance = bs.plugins.myPlugin
  ```
:::

## Expose functions

`proxy` function can be used to proxy properties or methods of the plugin to `bs`.

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(private scroll: BScroll){
      // register functions or properties
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

## Register hooks

You can add new hooks to `bs` by calling `registerType` function. Then you can trigger this hook in somewhere.

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
