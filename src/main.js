import Vue from 'vue'
import App from './app.vue'

// import '../src/assert/scss/test.css'
import '../src/assert/scss/global.scss'
// import '../src/assert/image/logo.png'

// const root = document.createElement('div')
// document.body.appendChild(root)

new Vue({
  render: (h) => h(App)
}).$mount('#app')