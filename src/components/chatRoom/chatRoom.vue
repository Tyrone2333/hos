<template>
    <div class="chatRoom">
        <input type="text" v-model="message">

        <button @click="sendMessage"> btn sendMessage</button>

        <button @click="test"> btn test</button>

        <div class="chat-wrapper" v-if="chatList">
            <!--单条消息-->
            <!--<div class="chat-item clearfix" v-for="(item,idx) in chatList">-->

            <!--&lt;!&ndash;时间,昵称,头像&ndash;&gt;-->
            <!--<div class="head-wrapper">-->
            <!--{{item.nickname}} : {{commonTime(item.timeStamp)}} :-->
            <!--</div>-->

            <!--&lt;!&ndash;消息本体&ndash;&gt;-->
            <!--&lt;!&ndash; 用username判断自己发的&ndash;&gt;-->
            <!--<div class="message-wrapper"-->
            <!--:class="userInfo.username === item.username ? 'right' : 'left'">-->
            <!--{{item.message}}-->
            <!--</div>-->
            <!--</div>-->

            <ul class="rounded-messages reveal-messages
             messages-width-medium msg-animation-fast">
                <!--真正的消息体-->
                <li contenteditable="true"
                    v-for="(item,idx) in chatList"
                    class="msg-visible"
                    :class="userInfo.username === item.username ? 'right-msg' : 'left'">
                    {{item.message}}
                </li>

                <!--这边是用来演示的消息-->
                <li class="time"><strong>Yesterday</strong> 12:25 pm</li>
                <li class="left">Hello!</li>
                <li class="time"><strong>Yesterday</strong> 12:25 pm</li>
                <li class="right-msg">Hey, how are you?</li>

                <li>
                    <div class="item-wrapper"></div>
                    I'm doing well
                </li>


                <li>What about you?</li>
                <li class="right-msg">Hardy har har.</li>
                <li class="right-msg"><img
                        src="https://tse4.mm.bing.net/th?id=OIP.Ma51851cded2f1d4bf2da6ff1e98df912o0&pid=15.1">I'm
                    doing great! ;)
                </li>
                <li class="right-msg">LOL</li>
                <li class="time"><strong>Yesterday</strong> 3:44pm</li>
                <li>Heck, yea! FOOTBALL!</li>
                <li>😁</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex"
    import Divider from "vux/src/components/divider/index";

    /**
     *   进入组件触发 beforeCreate, created, mounted
     *
     *   触发 webpack 的热更新会先后触发 beforeCreate,created , beforeDestroy,  mounted
     *
     */
    export default {
        name: "chatRoom",
        components: {Divider},
        data() {
            return {
                message: "ws chat room message",
                chatList: [], // 消息数组,存放所有聊天消息
                maxChatSize: 20,  // 能保存的最大消息数,DOM太多会严重影响性能
                chatPosition: "left",
                // 设置重试次数及重试延迟
                retry: 2,
                retryCount: 0,   //  以 _ 或 $ 开头的属性 不会 被 Vue 实例代理
                retryDelay: 2000
            }
        },
        computed: {
            ...mapGetters(["chatWSServer", "userInfo",]),
        },
        created() {
            log(this.chatWSServer)
            // 防止热加载调试建立多个ws连接
            this.wsConnecting = false
            this.creatw3cSocket()

        },
        beforeDestroy() {
            log("beforeDestroy")
            this.ws.close(1000, "用户离开聊天室")
        },

        methods: {
            ...mapMutations(["setchatWSServerStatus",]),
            test() {
                console.log("this.chatWSServer.status:", this.chatWSServer.status)

                // close 发送 code,reason 是在后台的关闭事件接收,而非本地的 onclose 事件
                this.ws.close(3333, "离开聊天室,关闭 websocket 连接")
                log(this.retryCount)
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
                            _this.addToChatList(res)

                        }

                        // console.log("【" + _this.commonTime(res.timeStamp) + "】" + " 收到消息: ", res)
                    }
                }
                // readyState changes to CLOSED. The listener receives a CloseEvent named "close".
                ws.onclose = function (event) {
                    let closeReason
                    if (event.code === 1000) {
                        closeReason = "正常关闭"
                    } else {
                        // 如1006等非正常关闭
                        closeReason = "异常关闭,尝试重连"

                        // 重试次数大于设置的次数，reject
                        if (_this.retryCount >= _this.retry) {
                            return
                        }
                        console.log(`断线,第 ${_this.retryCount + 1} 次重试`)
                        // 重试统计 +1
                        _this.retryCount++
                        // return new Promise(resolve => {
                        //     setTimeout(resolve, _this.retryDelay || 1)
                        // }).then(() => {
                        //     _this.creatw3cSocket()
                        // })
                        return setTimeout(() => {
                            _this.creatw3cSocket()
                        }, _this.retryDelay || 1)


                    }
                    console.log("echo-protocol ws " + closeReason, event)

                    let nullAct = () => {
                    }
                    ws.onopen = nullAct;
                    ws.onmessage = nullAct;
                    ws.onerror = nullAct;
                    ws.onclose = nullAct;
                    ws = nullAct

                    _this.wsConnecting = false
                    _this.setchatWSServerStatus(false)


                    // _this.creatw3cSocket()
                }
                ws.onerror = function (ev) {
                    console.log("ws 出现连接错误", ev)
                }
            },

            addToChatList(msg) {
                // this.chatList.unshift(msg)
                this.chatList.splice(0, 0, msg)
            },
            sendMessage() {
                let obj = {
                    action: "send",
                    nickname: this.userInfo.nickname,
                    username: this.userInfo.username,
                    avatar: this.userInfo.avatar,
                    timeStamp: Math.round(new Date().getTime() / 1000),
                    message: this.message,
                }

                let msg = JSON.stringify(obj)
                this.ws.send(msg)

                // 应该要接收到自己发的内容才添加,而不是直接加在聊天列表,否则可能出现没发成功但本地显示
                // 注意要添加的是 obj 不是 string
                // this.addToChatList(obj)
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
        /*底部 tabbar 高度,加了之后 ff 正常,不加 chrome 正常*/
        /*padding-bottom: 48px;*/

        .chat-item {
            /*display: flex;*/
            /*flex-flow: column;*/
            .left {
                float: left;
            }
            .right {
                float: right;
                color: #fff;
                background: #0188fb;
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

        /*codepen 的气泡特效*/
        .messages-width-small {
            /*width: 300px;*/
        }

        .messages-width-medium {
            /*width: 400px;*/
            width: 100%;
            box-sizing: border-box;
        }

        .messages-width-large {
            /*width: 500px;*/
        }

        .messages-width-full {
            width: 100%;
        }

        /* Basic List Styling */
        ul.rounded-messages {
            list-style: none;
            display: inline-block;
            overflow: hidden;
            font-size: 16px;
            padding: 10px;
        }

        /* Animation */
        @keyframes message-reveal-animation {
            from {
                opacity: 0;
                margin-top: 40px;
            }
            to {
                opacity: 1;
                margin-top: 10px;
            }
        }
        ul.rounded-messages.reveal-messages li {
            /*visibility: hidden;*/
        }

        ul.rounded-messages.msg-animation-superfast li.msg-visible,
        ul.rounded-messages.msg-animation-fast li.msg-visible,
        ul.rounded-messages.msg-animation-slow li.msg-visible,
        ul.rounded-messages.msg-animation-normal li.msg-visible,
        ul.rounded-messages li.msg-visible {
            animation: message-reveal-animation;
            animation-duration: 0.3s;
            /* Default Animation Length */
            animation-iteration-count: 1;
            visibility: visible;
        }

        ul.rounded-messages.msg-animation-superfast li.msg-visible {
            animation-duration: 0.2s;
            /* Super Fast Animation Length */
        }

        ul.rounded-messages.msg-animation-slow li.msg-visible {
            animation-duration: 0.5s;
            /* Slow Animation Length */
        }

        /* Message Bubbles */
        ul.rounded-messages li {
            position: relative;
            clear: both;
            display: block;
            height: auto;
            width: auto;
            max-width: 60%;
            word-wrap: break-word;
            word-break: keep-all;
            font-family: sans-serif;
            text-align: left;
            line-height: 1.5em;
            margin: 5px 50px;
            padding: 10px;
            cursor: default;
            border-radius: 15px;

        }

        /* Left Message Bubble */
        ul.rounded-messages li:not(.right-msg),
        ul.rounded-messages li.left-msg {
            float: left;
            color: #292929;
            background: #E3E2DF;
        }

        ul.rounded-messages li:not(.right-msg)::before,
        ul.rounded-messages li.left-msg::before {
            /* Left Message Bubble Tail */
            content: "";
            position: absolute;
            top: 5px;
            left: -10px;
            border-top: 15px solid #E3E2DF;
            border-left: 15px solid transparent;
        }

        /* Right Message Bubble */
        ul.rounded-messages li.right-msg {
            float: right;
            color: #F8F8F8;
            background: #27AE60;
        }

        ul.rounded-messages li.right-msg::before {
            /* Right Message Bubble Tail */
            content: "";
            position: absolute;
            bottom: 5px;
            right: -10px;
            border-bottom: 15px solid #27AE60;
            border-right: 15px solid transparent;
        }

        /* Bubble with image */
        ul.rounded-messages li img {
            display: block;
            max-width: 100%;
            border-radius: 5px;
            margin-bttom: 5px;
        }

        /* Bubble with no tail */
        ul.rounded-messages li.no-tail::before,
        ul.rounded-messages li.time::before {
            content: "";
            display: none;
        }

        /* Time Stamp */
        ul.rounded-messages li.time {
            width: 100%;
            max-width: 100%;
            background: transparent;
            margin: 0px;
            font-size: 12px;
            text-align: center;
            color: #555555;
        }

        /*@media screen and (max-width: 500px) {*/
        /*!* Fit the screen for all chats *!*/
        /*ul.rounded-messages,*/
        /*.messages-width-large,*/
        /*.messages-width-medium,*/
        /*.messages-width-small {*/
        /*width: 100%;*/
        /*display: block;*/
        /*}*/
        /*}*/

    }
</style>
