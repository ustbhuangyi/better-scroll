<template>
  <div class="feature">
    <ul class="feature-list">
      <li class="feature-item">
        <div class="title">体验优化</div>
        <p>为了让滚动体验更加流畅，我们提供了惯性滚动、边界回弹、滚动条淡入淡出等效果的灵活配置，能够明显地优化 Web 滚动体验。</p>
      </li>
      <li class="feature-item">
        <div class="title">应用丰富</div>
        <p>其应用场景包括了滚动列表、选择器、轮播图、索引列表、开屏引导，并且能够轻松实现下拉刷新、上拉加载等功能</p>
      </li>
      <li class="feature-item">
        <div class="title">零依赖</div>
        <p>不依赖任何框架，既可以原生 JS 引用，也可以与任意前端 MVVM 框架结合使用，比如官方 DEMO 就是与 Vue 的结合示例。</p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .feature
    .feature-list
      display: flex
      justify-content: space-between
      flex-wrap: wrap
      @media screen and (min-width: 42rem)
        margin: 2rem 0 2rem 0
      @media screen and (max-width: 42rem)
        margin: 1rem 0
      .feature-item
        text-align: left
        padding: 0.8rem
        margin-bottom: 1rem
        @media screen and (min-width: 64rem)
          flex: 0 1 27%
        @media screen and (max-width: 64rem)
          flex: 0 1 100%

        .title
          margin-bottom: 15px
          color: #333
          font-size: $fontsize-large-xxx
          line-height: 28px
          font-weight: normal
        p
          text-align: justify
          line-height: 180%;

</style>