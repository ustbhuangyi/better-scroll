<template>
    <div ref="qrcode"></div>
</template>

<script>
export default {
  props: {
      url: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: false,
        default: 256
      },
      color: {
        type: String,
        required: false,
        default: '#000'
      },
      bgColor: {
        type: String,
        required: false,
        default: '#FFF'
      },
      errorLevel: {
          type: String, 
          validator: function (value) {
              return value === 'L' || value === 'M' || value === 'Q' || value === 'H'
          }, 
          required: false, 
          default: 'H'
      }
  },
  watch: {
      url: () => {
        this.clear()
        this.makeCode(this.url)
      }
  },
  data() {
      return{
        qrCode: null
      }
  },
  mounted() {
    import('qrcode-js-package/qrcode.js').then(res => {
      const QRCode = res.default
      this.qrCode = new QRCode(this.$refs.qrcode, {
        text: this.url,
        width: this.size,
        height: this.size,
        colorDark : this.color,
        colorLight : this.bgColor,
        correctLevel : QRCode.CorrectLevel[this.errorLevel]
      })
    })
  },
  methods: {
    clear() {
      if (!this.qrcode) {
        return
      }
      this.qrCode.clear()
    },
    makeCode(url) {
      if (!this.qrcode) {
        return
      }
      this.qrCode.makeCode(url)
    }
  }
}
</script>