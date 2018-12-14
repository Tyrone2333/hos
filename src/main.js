// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import {store} from './store/store'
import VueRouter from 'vue-router'
import App from './App'
import VueRouterIndex from './router/index.js'
import {ToastPlugin} from 'vux'
import {
    Panel, Group, Cell, Swiper, Badge, Tab, Sticky, Checker, Rater,Actionsheet,
    ViewBox,SwiperItem, CheckerItem, TabItem,
    XNumber, XButton, XInput, XDialog,XHeader,XSwitch
} from 'vux'

Vue.component('panel', Panel)
Vue.component('x-button', XButton)
Vue.component('x-input', XInput)
Vue.component('x-number', XNumber)
Vue.component('x-switch', XSwitch)
Vue.component('x-dialog', XDialog)
Vue.component('x-header', XHeader)
Vue.component('group', Group)
Vue.component('cell', Cell)
Vue.component('badge', Badge)
Vue.component('swiper-item', SwiperItem)
Vue.component('swiper', Swiper)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('sticky', Sticky)
Vue.component('rater', Rater)
Vue.component('checker', Checker)
Vue.component('actionsheet', Actionsheet)
Vue.component('view-box', ViewBox)
Vue.component('checker-item', CheckerItem)

Vue.use(ToastPlugin)
Vue.use(VueRouter)

// 引入 iconfont
import "./assets/style.css"

FastClick.attach(document.body)

Vue.config.productionTip = false

// 页面刷新时，重新赋值store
if (window.localStorage.getItem('token')) {
    store.commit("_initUser")
}


/* eslint-disable no-new */
new Vue({
    store,
    router: VueRouterIndex,
    render: h => h(App),

}).$mount('#app')

