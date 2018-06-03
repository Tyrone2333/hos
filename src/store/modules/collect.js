import {getCollectList} from "@/api/article.js"

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
        },
    },

    actions: {
        // 使得mutations能够实现异步调用，实现例如延迟调用
        getCollectList({commit, state}, user_id) {
            getCollectList(user_id).then((response) => {
                let list = response.data.data;
                commit("setcollectList", list)
                localStorage.setItem("collectList", JSON.stringify(list))
                log("在vuex,localStorage保存收藏列表")
            })
        },


    },
}