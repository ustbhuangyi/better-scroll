import '@babel/polyfill'
import Vue from 'vue'
import router from './router'
import App from './App.vue'

// /* eslint-disable no-unused-vars */
// import VConsole from 'vconsole' // develop console
// /* eslint-disable no-new */
// new VConsole()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
