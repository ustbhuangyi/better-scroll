import Vue from 'vue'
import router from './router'
import App from './App.vue'
import i18n from './language'
import fastclick from 'fastclick'
import 'common/stylus/base.styl'

fastclick.attach(document.body)

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole' // develop console

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  render: h => h(App)
})
