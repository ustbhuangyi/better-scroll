function Picker (options, bscroll) {
  this.options = options  // 配置项
  this.bscroll = bscroll // 实例
  this.init()
}

Picker.prototype.init = function () {

}

function install (BScroll) {
  BScroll.registerPlugin({
    optionsKey: 'pick',
    Picker (options, bscroll) {
      new Picker(options, bscroll)
    }
  })

  BScroll.plugin('picker', Picker)
}
