<template>
    <div class="chatRoom">
        <input type="text" v-model="message">

        <button @click="sendMessage"> btn sendMessage</button>

        <button @click="test"> btn test</button>

        <div class="chat-wrapper" v-if="chatList">
            <!--单条消息-->
            <div class="chat-item clearfix" v-for="(item,idx) in chatList">

                <!--时间,昵称,头像-->
                <div class="head-wrapper">
                    {{item.nickname}} : {{commonTime(item.timeStamp)}} :
                </div>

                <!--消息本体-->
                <div class="message-wrapper" :class="item.self ? 'right' : 'left'">
                    {{item.message}}
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex"

    export default {
        name: "chatRoom",
        data() {
            return {
                message: "ws chat room message",
                chatList: [], // 消息数组,存放所有聊天消息
                maxChatSize: 20,  // 能保存的最大消息数,DOM太多会严重影响性能
                chatPosition: "left",
            }
        },
        computed: {
            ...mapGetters(["chatWSServer"]),
        },
        created() {
            this.wsConnecting = false

        },
        mounted() {

            // 防止热加载调试建立多个ws连接
            if (this.chatWSServer.status) return

            this.creatw3cSocket()

        },
        methods: {
            ...mapMutations(["setchatWSServerStatus",]),
            test() {
                console.log("this.chatWSServer.status:", this.chatWSServer.status)
                
            },
            creatw3cSocket() {
                if (!window.WebSocket) return
                if (this.wsConnecting) return
                let _this = this
                let ws = new WebSocket(this.chatWSServer.wsUrl, "echo-protocol");

                this.ws = ws

                ws.onopen = function () {
                    _this.wsConnecting = true
                    console.log("WebSocket 已连接")
                    _this.setchatWSServerStatus(true)

                    let obj = {
                        action: "register",
                        UserKey: "eoi15e34o3i15oe4i1egidhytmd",
                        UserName: "enzo",
                        UserType: "1",
                        data: this.message,
                    }
                    ws.send(JSON.stringify(obj))
                }

                ws.onmessage = function (e) {
                    if (typeof e.data === "string") {
                        let res = JSON.parse(e.data)

                        if (res.type === "registed") {
                            console.info("注册成功")
                            _this.wsConnecting = false
                        } else if (res.type === "message") {
                            // 把收到的消息放到列表
                            // _this.chatList.unshift( res)
                            _this.chatList.splice(0, 0, res)
                        }

                        // console.log("【" + _this.commonTime(res.timeStamp) + "】" + " 收到消息: ", res)
                    }
                }
                ws.onclose = function () {
                    let nullAct = () => {
                    };
                    ws.onopen = nullAct;
                    ws.onmessage = nullAct;
                    ws.onerror = nullAct;
                    ws.onclose = nullAct;
                    ws = nullAct

                    _this.wsConnecting = false
                    _this.setchatWSServerStatus(false)


                    console.log("echo-protocol ws Closed")
                    _this.creatw3cSocket()
                }
                ws.onerror = function () {
                    console.log("ws 出现连接错误")
                }
            },

            addToChatList(msg) {
                this.chatList.unshift(msg)
            },
            sendMessage() {
                let obj = {
                    nickname: "test",
                    avatar: "https://upload-images.jianshu.io/upload_images/13417663-ba3041d5bd8209cf.png",
                    timeStamp: Math.round(new Date().getTime() / 1000),
                    message: "long long message" + Math.round(Math.random() * 10000),
                    type: "message",
                    self: true,  // 自己发送的,作为消息排列的标识
                }

                let msg = JSON.stringify(obj)
                this.ws.send(msg)
                this.addToChatList(obj) // 注意要添加的是 obj 不是 string
                // this.ws.send(this.message)
            },
            commonTime(timestamp) {
                let unixTimestamp = new Date(timestamp)
                return unixTimestamp.toLocaleString()
            },

            // methods
        },
        watch: {
            chatList(curVal, oldVal) {
                if (curVal.length > this.maxChatSize) {
                    curVal.pop()
                }
            },
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .clearfix {
        content: " ";
        display: block;
        clear: both;
    }

    .chat-wrapper {
        position: relative;
        .chat-item {
            /*display: flex;*/
            /*flex-flow: column;*/
            .left {
                float: left;
            }
            .right {
                float: right;
            }
            .head-wrapper {
                padding: 14px 15px 10px;
                color: #999999;
                font-size: 13px;
                position: relative;
            }
            .message-wrapper {
                display: inline-block;
                max-width: 100%;
                margin: 0 20px 0 40px;
                padding: 14px 15px 10px;
                /*color: #999999;*/
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 16px;
                position: relative;
            }
        }
    }
</style>
