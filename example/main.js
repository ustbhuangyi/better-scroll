import Vue from 'vue'
import router from './router'
import App from './App.vue'
import i18n from './language'

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole' // develop console

import 'common/stylus/base.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  render: h => h(App)
})
