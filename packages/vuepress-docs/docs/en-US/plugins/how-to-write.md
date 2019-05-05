# How to write a plugin

A BetterScroll plugin should be a class with the following feature:

- Has a static `pluginName` property.
- The first arguments of constructor is bBetterScroll instance(bs). You can fetch or change all the properties of bs in your plugin.

The simplest plugin is as follow:

  ```typescript
    export default class MyPlugin {
      static pluginName = 'myPlugin'
      constructor(private scroll: BScroll){}
    }
  ```

## Expose functions

`proxy` function can be used to proxy properties or methods of the plugin to bs.

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

You can add new hooks to bs by calling `registerType` function. Then you can trigger this hooks in somewhere.

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
