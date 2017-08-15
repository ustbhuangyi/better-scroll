# 选项 / 高级

better-scroll 还支持一些高级配置，来实现一些特殊的 feature。
   
## wheel
   - 类型：Boolean | Object
   - 默认值：false
   - 作用：这个配置是为了做 picker 组件用的，默认为 false，如果开启则需要配置一个 Object，例如：`{selectedIndex: 0,
rotate: 25, adjustTime: 400}`。 
   - 备注：这是一个高级的配置，一般场景不需要配置。想了解更多的细节可以去看 example 中的 picker 组件的代码。
     
## snap
   - 类型：Boolean | Object
   - 默认值：false
   - 这个配置是为了做 slide 组件用的，默认为 false，如果开启则需要配置一个 Object，例如：` * snap: {loop: false,threshold: 0.1,stepX: 100,stepY: 100}`。
   - 备注：这是一个高级的配置，一般场景不需要配置。想了解更多的细节可以去看 example 中的 slide 组件的代码。