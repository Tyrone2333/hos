export default {
    state: {
        // 用户登录信息
        user: {
            id: "",
            username: "",
            nickname: "",
            token: "",
            avatar: "",
            age: "",
            email: "",
            register_time: "",
        },
        token: "",

    },
// 由于分了模块，在组件里面不能直接用　...mapState 分发一个数组，要用
//              collectList: state => state.collect.collectList
// 所以使用getter
    getters: {
        userInfo: state => state.user,
    },
    mutations: {
        // 将用户数据存入store
        setUserInfo(state, payload) {
            state.user = {...payload}
            localStorage.setItem("user", JSON.stringify(payload))
        },
        setToken(state, payload) {
            state.token = payload
            localStorage.setItem("token", JSON.stringify(payload))
        },
        // 从localStorage取出数据赋给store用户信息
        _initUser(state) {
            state.user = JSON.parse(localStorage.user)
            state.token = JSON.parse(localStorage.token)
        },
    },

    actions: {},
}