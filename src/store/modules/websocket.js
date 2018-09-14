export default {
    state: {
        pushWSServer: {},
        chatWSServer: {
            wsUrl: "ws://localhost:8080/",
            connecting: false,
            status: false,
        }
    },
    // 由于分了模块，在组件里面不能直接用　...mapState 分发一个数组，要用
    //              collectList: state => state.collect.collectList
    // 所以使用getter
    getters: {
        chatWSServer: state => state.chatWSServer,
        pushWSServer: state => state.pushWSServer,
    },

    mutations: {
        setchatWSServerStatus(state, payload) {
            state.chatWSServer.status = payload
            console.info("websocket聊天服务器当前状态: " + state.chatWSServer.status)
        },
    },

    actions: {},
}