# How To Write Plugins

BetterScroll plugins need to be a class, and have the following characteristics:

  - The static pluginName property.
  - The first argument of the constructor is the BetterScroll instance `bs`. You can inject your own logic through the **event** or **hook** of bs.

The simplest plugin skeleton is as follows:

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(public scroll: BScroll){
      // this.scroll is BetterScroll instance
    }
  }
```

But we need to understand better details in order to write a logically complete and powerful BetterScroll plugin. Please continue reading.

## Event VS Hook

Based on the 2.x architecture design and compatibility with 1.x events, we propose two concepts-"**event**" and "**hook**". Basically, they are all instances of `EventEmitter`, but they are called differently. Let's explain from the source code excerpted below:

```typescript
  export default BScrollCore extends EventEmitter {
    hooks: EventEmitter
  }
```

  - **BScrollCore**

    It inherits EventEmitter itself. we all call it "**event**".

    ```js
      let bs = new BScroll('.wrapper', {})

      // listen bs scroll event
      bs.on('scroll', () => {})
      // listen bs refresh event
      bs.on('refresh', () => {})
    ```

  - **BScrollCore.hooks**

    hooks are also instances of EventEmitter. we all call it "**hook**".

    ```js
      let bs = new BScroll('.wrapper', {})

      // tap into bs refresh hook
      bs.hooks.on('refresh', () => {})
      // tap into bs enable hook
      bs.hooks.on('enable', () => {})
    ```

I believe everyone now has a better distinction between the two. "**Event**" is for compatibility with 1.x. When writing plugins in 2.x, you should pay more attention to "**hooks**" .

## Proxy Method Or Property

If you want to expose the **methods** or **properties** of the plugin, bs provides the `proxy` method to proxy to bs.

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(private scroll: BScroll){
      // expose them to bs
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

      // Get plugin properties or methods through bs
      this.scroll.newFunction // equals myPlugin.newFunction
      this.scroll.newProperty // equals myPlugin.newFunction
    }
  }
```

## Register Events

Call the `registerType` method to add a new event to bs, otherwise it will be checked as an illegal event and an error will be reported when the event is listened or triggered.

```typescript
  export default class MyPlugin {
    static pluginName = 'myPlugin'
    constructor(private scroll: BScroll){
      // listen event
      this.scroll.registerType(['yourEventName'])
    }
    someFunction() {
      // trigger event safely
      this.scroll.trigger(this.scroll.eventTypes.yourEventName)
    }
  }
```
