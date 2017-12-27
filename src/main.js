// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import { store } from './store/store'
import VueRouter from 'vue-router'
import App from './App'
import VueRouterIndex from './router/index.js'
import  { ToastPlugin } from 'vux'
// import Vuex from 'vuex'

// Vue.use(Vuex)
Vue.use(ToastPlugin)
Vue.use(VueRouter)

import "./common/style.css"


FastClick.attach(document.body)

Vue.config.productionTip = false




/* eslint-disable no-new */
new Vue({
    store,
    router: VueRouterIndex,
    render: h => h(App),

}).$mount('#app')

