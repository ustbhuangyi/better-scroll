import Vue from 'vue'
import router from './router'
import App from './App.vue'

import 'common/stylus/base.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
