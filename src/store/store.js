import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

import collect from './modules/collect'
import article from './modules/article'
import user from './modules/user'

export const store = new Vuex.Store({
    state: {
        clock: 0,  //打脸倒计时的Interval ID
    },
    getters: {

    },
    mutations: {
        //写法与getters相类似
        //组件想要对于vuex 中的数据进行的处理
        //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
        //内部操作必须在此刻完成(同步)

    },
    actions: {

    },
    modules: {
        //引入某一个state的以上集合的模块，会自动分别填充到上面，使得结构更加清晰
        collect,article,user
    },
});