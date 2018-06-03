import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

import collect from './modules/collect'
import article from './modules/article'

export const store = new Vuex.Store({
    state: {
        // 用户登录信息
        user_id: "",
        username: "",
        nickname: "",
        token: "",
        avatar: "",
        clock: 0,  //打脸倒计时的Interval ID
    },
    getters: {

    },
    mutations: {
        //写法与getters相类似
        //组件想要对于vuex 中的数据进行的处理
        //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
        //内部操作必须在此刻完成(同步)

        setuser_id: (state, payload) => {
            state.user_id = payload
        },
        setUsername: (state, payload) => {
            state.username = payload
        },
        setnickname: (state, payload) => {
            state.nickname = payload
        },
        setexpire_time: (state, payload) => {
            state.expire_time = payload
        },
        settoken: (state, payload) => {
            state.token = payload
        },
        setclock: (state, payload) => {
            state.clock = payload
        },
        // 从localStorage取出数据赋给用户信息
        _flashUser(state) {
            state.user_id = localStorage.user_id
            state.username = localStorage.username
            state.nickname = localStorage.nickname
            state.token = localStorage.token
            state.avatar = localStorage.avatar
        },
        _clearToken(state) {
            state.user_id = ""
            state.username = ""
            state.nickname = ""
            state.token = ""
            state.avatar = ""

        }


    },
    actions: {
        //使得mutations能够实现异步调用，实现例如延迟调用


    },
    modules: {
        //引入某一个state的以上集合的模块，会自动分别填充到上面，使得结构更加清晰
        collect,article
    },
});