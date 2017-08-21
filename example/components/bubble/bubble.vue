<template>
  <canvas ref="bubble" :width="width" :height="height"></canvas>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      y: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        width: 50,
        height: 80,
        initRadius: 20,
        minHeadRadius: 12,
        minTailRadius: 5,
        initArrowRadius: 10,
        minArrowRadius: 6,
        arrowWidth: 4,
        maxDistance: 40,
        initCenterX: 25,
        initCenterY: 25
      }
    },
    computed: {
      distance() {
        return Math.max(0, Math.min(this.y, this.maxDistance))
      }
    },
    created() {
      this.headCenter = {
        x: this.initCenterX,
        y: this.initCenterY
      }
    },
    mounted() {
      this._draw()
    },
    methods: {
      _draw() {
        const bubble = this.$refs.bubble
        let ctx = bubble.getContext('2d')
        ctx.clearRect(0, 0, bubble.width, bubble.height)

        this._drawBubble(ctx)

        this._drawArrow(ctx)
      },
      _drawBubble(ctx) {
        ctx.save()
        ctx.beginPath()

        const rate = this.distance / this.maxDistance
        const headRadius = this.initRadius - (this.initRadius - this.minHeadRadius) * rate

        this.headCenter.y = this.initCenterY - (this.initRadius - this.minHeadRadius) * rate

        // 画上半弧线
        ctx.arc(this.headCenter.x, this.headCenter.y, headRadius, 0, Math.PI, true)

        // 画左侧贝塞尔
        const tailRadius = this.initRadius - (this.initRadius - this.minTailRadius) * rate
        const tailCenter = {
          x: this.headCenter.x,
          y: this.headCenter.y + this.distance
        }

        const tailPointL = {
          x: tailCenter.x - tailRadius,
          y: tailCenter.y
        }
        const controlPointL = {
          x: tailPointL.x,
          y: tailPointL.y - this.distance / 2
        }

        ctx.quadraticCurveTo(controlPointL.x, controlPointL.y, tailPointL.x, tailPointL.y)

        // 画下半弧线
        ctx.arc(tailCenter.x, tailCenter.y, tailRadius, Math.PI, 0, true)

        // 画右侧贝塞尔
        const headPointR = {
          x: this.headCenter.x + headRadius,
          y: this.headCenter.y
        }
        const controlPointR = {
          x: tailCenter.x + tailRadius,
          y: headPointR.y + this.distance / 2
        }
        ctx.quadraticCurveTo(controlPointR.x, controlPointR.y, headPointR.x, headPointR.y)

        ctx.fillStyle = 'rgb(170,170,170)'
        ctx.fill()
        ctx.strokeStyle = 'rgb(153,153,153)'
        ctx.stroke()
        ctx.restore()
      },
      _drawArrow(ctx) {
        ctx.save()
        ctx.beginPath()

        const rate = this.distance / this.maxDistance
        const arrowRadius = this.initArrowRadius - (this.initArrowRadius - this.minArrowRadius) * rate

        // 画内圆
        ctx.arc(this.headCenter.x, this.headCenter.y, arrowRadius - (this.arrowWidth - rate), -Math.PI / 2, 0, true)

        // 画外圆
        ctx.arc(this.headCenter.x, this.headCenter.y, arrowRadius, 0, Math.PI * 3 / 2, false)

        ctx.lineTo(this.headCenter.x, this.headCenter.y - arrowRadius - 2 + rate)
        ctx.lineTo(this.headCenter.x + 8 - rate * 2, this.headCenter.y - arrowRadius + 2)

        ctx.lineTo(this.headCenter.x, this.headCenter.y - arrowRadius + 6 - rate)

        ctx.fillStyle = 'rgb(255,255,255)'
        ctx.fill()
        ctx.strokeStyle = 'rgb(170,170,170)'
        ctx.stroke()
      }
    },
    watch: {
      y() {
        this._draw()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>