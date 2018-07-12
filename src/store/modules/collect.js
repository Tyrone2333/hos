import {getCollectList} from "@/api/collect.js"

export default {
    state: {
        collectList: [],
    },
    // 由于分了模块，在组件里面不能直接用　...mapState 分发一个数组，要用
    //              collectList: state => state.collect.collectList
    // 所以使用getter
    getters: {
        collectList: state => state.collectList,
    },

    mutations: {
        setcollectList(state, payload) {
            state.collectList = payload
            localStorage.setItem("collectList", JSON.stringify(payload))
            log("在vuex,localStorage保存收藏列表")
        },
    },

    actions: {


    },
}