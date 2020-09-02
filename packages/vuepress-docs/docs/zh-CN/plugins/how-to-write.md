# 如何写一个插件

### 构思插件的功能

```js
  import BScroll from '@better-scroll/core'
  import MyPlugin from '@better-scroll/my-plugin'

  BScroll.use(MyPlugin)

  const bs = new BScroll('.wrapper', {
    myPlugin: {
      scrollText: 'I am scrolling',
      scrollEndText: 'Scroll has ended'
    },
    // 或者
    myPlugin: true
  })

  // 使用插件暴露到 bs 的事件
  bs.on('printScrollEndText', (scrollEndText) => {
    console.log(scrollEndText) // 打印 "Scroll has ended, position is (xx, yy)"
  })

  // 使用插件代理到 bs 实例上的方法
  bs.printScrollText() // 打印 "I am scrolling"
```

### 编写插件

1. **TypeScript 声明合并以及暴露插件方法**

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
    myPlugin?: MyPluginOptions
  }

  interface CustomAPI {
    myPlugin: PluginAPI
  }
}
```

这样做的好处，就是为了在引入 `myPlugin` 插件并且实例化 BetterScroll 的时候，能够有对应的 Options 提示以及 bs 能够有对应的方法提示，以 pulldown 插件为例：

<img :src="$withBase('/assets/images/tip1.png')" alt="">

<img :src="$withBase('/assets/images/tip2.png')" alt="">

2. **编写插件主体**

    - **BetterScroll 的插件需要是一个类，并且具有以下特性：**

      - 静态的 pluginName 属性。
      - 实现 PluginAPI 接口（当且仅当需要把插件方法代理至 bs）。
      - constructor 的第一个参数就是 BetterScroll 实例 `bs`，你可以通过 bs 的**事件**或者**钩子**来注入自己的逻辑。

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

      合并用户传入的 options，收缩它的类型。

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

      代理事件以及方法至 BetterScroll 实例。

      ```typescript
        export default class MyPlugin implements PluginAPI {
          private handleBScroll() {
            const propertiesConfig = [
              {
                key: 'printScrollText',
                sourceKey: 'plugins.myPlugin.printScrollText'
              }
            ]
            // 将 myPlugin.printScrollText 代理至 bs.printScrollText
            this.scroll.proxy(propertiesConfig)
            // 注册 printScrollEndText 事件至 bs，以至于用户可以通过 bs.on('printScrollEndText', handler) 来订阅事件
            this.scroll.registerType(['printScrollEndText'])
          }

          printScrollText() {
            console.log(this.options.scrollText)
          }
        }
      ```

    - **registerHooks**

      钩入 bs 的钩子，实现插件的逻辑，并且派发插件自定义的事件。

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

恭喜你，一个简单的 BetterScroll 插件就已经完成啦，如果结合你的场景，需要更复杂的插件，可以仔细阅读 [事件与钩子大全](../guide/base-scroll-api.html#事件-vs-钩子)，它能很好的帮助你来完成一款独特的插件。

查看[完整的 repo](https://github.com/better-scroll/plugin-tutorial)，以及[线上例子](https://better-scroll.github.io/plugin-tutorial/)