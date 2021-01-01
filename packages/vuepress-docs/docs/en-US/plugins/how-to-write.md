# How to write plugins

### Conceive The Function Of The Plugin

```js
  import BScroll from '@better-scroll/core'
  import MyPlugin from '@better-scroll/my-plugin'

  BScroll.use(MyPlugin)

  const bs = new BScroll('.wrapper', {
    myPlugin: {
      scrollText: 'I am scrolling',
      scrollEndText: 'Scroll has ended'
    },
    // or
    myPlugin: true
  })

  // Use the event that is proxied to bs by plugin
  bs.on('printScrollEndText', (scrollEndText) => {
    console.log(scrollEndText) // print "Scroll has ended, position is (xx, yy)"
  })

  // Use the method that is proxied to bs by plugin
  bs.printScrollText() // print "I am scrolling"
```

### Write Plugin

1. **TypeScript declare merging and expose plugin methods**

```typescript
import BScroll from '@better-scroll/core'

export type MyPluginOptions = Partial<MyPluginConfig> | true

type MyPluginConfig = {
  scrollText: string,
  scrollEndText: string
}

interface PluginAPI {
  printScrollText(): void
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    myPlugin?: myPluginOptions
  }

  interface CustomAPI {
    myPlugin: PluginAPI
  }
}
```

The advantage of this is that when the `myPlugin` plugin is imported and BetterScroll is instantiated, there can be corresponding Options prompts and bs can have corresponding method prompts. Take the pulldown plugin as an example:

<img data-zoomable :src="$withBase('/assets/images/tip1.png')" alt="">


<img data-zoomable :src="$withBase('/assets/images/tip2.png')" alt="">

2. **Write the plugin logic**

    - **BetterScroll plugins need to be a class, and have the following characteristics:**

      - The static pluginName property.
      - Implement the PluginAPI interface (only if it is necessary to proxy the plugin method to bs).
      - The first argument of the constructor is the BetterScroll instance `bs`. You can inject your own logic through the **event** or **hook** of bs.

      ```typescript
        export default class MyPlugin implements PluginAPI {
          static pluginName = 'myPlugin'
          public options: MyPluginConfig
          constructor(public scroll: BScroll){
            this.handleOptions()

            this.handleBScroll()

            this.registerHooks()
          }
        }
      ```

    - **handleOptions**

      Merge user options，narrow down it‘s type。

      ```typescript
        import { extend } from '@better-scroll/shared-utils'
        export default class MyPlugin {
          private handleOptions() {
            const userOptions = (this.scroll.options.myPlugin === true
              ? {}
              : this.scroll.options.myPlugin) as Partial<MyPluginConfig>
            const defaultOptions: MyPluginConfig = {
              scrollText: 'I am scrolling',
              scrollEndText: 'Scroll has ended'
            }
            this.options = extend(defaultOptions, userOptions)
          }
        }
      ```

    - **handleBScroll**

      Proxy events and methods to the BetterScroll instance.

      ```typescript
        export default class MyPlugin implements PluginAPI {
          private handleBScroll() {
            const propertiesConfig = [
              {
                key: 'printScrollText',
                sourceKey: 'plugins.myPluginOptions.printScrollText'
              }
            ]
            // myPlugin.printScrollText is proxied to bs.printScrollText
            this.scroll.proxy(propertiesConfig)
            // Proxy printScrollEndText event to bs
            // Users can subscribe to events via bs.on('printScrollEndText', handler)
            this.scroll.registerType(['printScrollEndText'])
          }

          printScrollText() {
            console.log(this.options.scrollText)
          }
        }
      ```

    - **registerHooks**

      Tap into the bs hook, implement the logic of the plugin, and dispatch custom events of the plugin.

      ```typescript
        export default class MyPlugin implements PluginAPI {
          private registerHooks() {
            const scroll = this.scroll
            scroll.on(scroll.eventTypes.scrollEnd, ({ x, y }) => {
              scroll.trigger(
                scroll.eventTypes.printScrollEndText,
                `${this.options.scrollEndText}, position is (${x}, ${y})`
              )
            })
          }
        }
      ```

Congratulations, a simple BetterScroll plugin has been completed. If you need more complex plugin to meet your need, you can read [Events and Hooks](../guide/base-scroll-api.html#events-vs-hooks), it can help you to complete a fantastic plugin.