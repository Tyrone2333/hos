import {getCollectList} from "@/api/collect.js"

export default  {
    state: {
        collectList: [],
    },
     getters : {
         collectList: state => state.collectList,
    },

    mutations: {
        setcollectList(state, payload) {
            state.collectList = payload
        },
    },

    actions: {
        //使得mutations能够实现异步调用，实现例如延迟调用
        getCollectList({commit, state}, user_id) {
            getCollectList(user_id).then((response) => {
                let list = response.data.data;
                commit("setcollectList", list)
                localStorage.setItem("collectList", JSON.stringify(list))
                log("在vuex,localStorage保存收藏列表")
            })
        }

    },
}