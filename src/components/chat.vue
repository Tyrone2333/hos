<template>
    <div class="chat">


        <div class="chat-wrapper" v-if="chatList">

            <div class="rounded-messages reveal-messages
             messages-width-medium msg-animation-fast">


                <!--这边是用来演示的消息-->
                <div class="time msg"><strong>Yesterday</strong> 12:25 pm</div>
                <div class="left msg">Hello!</div>
                <div class="time msg"><strong>Yesterday</strong> 12:25 pm</div>
                <div class="right-msg msg">Hey, how are you?</div>

                <!--<div>-->
                <!--<div class="user-info">-->
                <!--<img :src="item.avatar" alt="">-->
                <!--<div class="nickname">{{item.nickname}}</div>-->
                <!--</div>-->
                <!--<div class="item-wrapper msg">I'm doing well</div>-->
                <!--</div>-->
                <div class=" msg">I'm doing well</div>
                <div class="msg">What about you?</div>
                <div class="right-msg msg">Hardy har har.</div>
                <div class="right-msg msg"><img
                        src="https://tse4.mm.bing.net/th?id=OIP.Ma51851cded2f1d4bf2da6ff1e98df912o0&pid=15.1">I'm
                    doing great! ;)
                </div>
                <div class="right-msg msg">LOL</div>
                <div class="time  msg"><strong>Yesterday</strong> 3:44pm</div>
                <div class="msg">Heck, yea! FOOTBALL!</div>
                <!--演示消息 END-->

                <div class="clearfix"></div>

                <!--消息体-->
                <div v-for="(item,idx) in chatList"
                     class="item-wrapper"
                     :class="userInfo.username === item.username ? 'right-item-wrapper' : 'left-item-wrapper'">

                    <!--左边的头像-->
                    <div class="avatar" @click="clickSomeOneAvatar(item)">
                        <img :src="item.avatar" alt="avatar">
                    </div>
                    <!--右边是 昵称 和 消息-->
                    <div class="right-wrapper">
                        <!--昵称-->
                        <div class="nickname">{{item.nickname}}
                            <span v-if="item.to_uid === uid">(仅你可见)</span>
                        </div>

                        <!--消息-->
                        <div class=" msg msg-visible"
                             :class="userInfo.username === item.username ? 'right-msg' : 'left'">{{item.message}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="foot-wrapper">
            <input class="chat-input" type="text" v-model="message" :placeholder="chatPlaceholder"
                   @keyup.enter="sendMessage">

            <button class="chat-send" @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex"
    import timeTransMixins from "../utils/timeTransMixin"
    import {createUid} from "../utils/common";

    /**
     *   进入组件触发 beforeCreate, created, mounted
     *
     *   触发 webpack 的热更新会先后触发 beforeCreate,created , beforeDestroy,  mounted
     *
     */
    export default {
        name: "chat",
        mixins: [timeTransMixins],
        props: {
            chatFor: {
                type: String,
                default: ""
            },
        },
        data() {
            return {
                message: "ws 随机消息:" + Math.random(),
                chatList: [], // 消息数组,存放所有聊天消息
                maxChatSize: 20,  // 能保存的最大消息数,DOM太多会严重影响性能
                chatPosition: "left",
                // 设置重试次数及重试延迟
                retry: 2,
                retryCount: 0,   //  以 _ 或 $ 开头的属性 不会 被 Vue 实例代理
                retryDelay: 2000,

                chatPlaceholder: "",
                privateFor: "",

                uid: "",
            }
        },
        computed: {
            ...mapGetters(["chatWSServer", "userInfo",]),
        },
        created() {
            // 防止热加载调试建立多个ws连接
            this.wsConnecting = false
            // this.creatw3cSocket()
            this.createSocketIOClient()
        },
        beforeDestroy() {
            // 重新显示tabbar
            let tabbar = document.getElementsByClassName("weui-tabbar")[0]
            tabbar.style.visibility = "visible"

            // 触发下线,服务器要自己设定断开与 client 的连接
            let obj = {
                action: "offline",
                nickname: this.userInfo.nickname,
                username: this.userInfo.username,
                userId: this.userInfo.id,
                timeStamp: Math.round(new Date().getTime() / 1000),
            }
            this.io.emit("offline", obj)

        },
        mounted() {
            // 隐藏底部的 tabbar
            let tabbar = document.getElementsByClassName("weui-tabbar")[0]
            tabbar.style.visibility = "hidden"

            // 临时!!! ,自动发送
            this.$nextTick((res) => {
                this.sendMessage()
            })

        },
        methods: {
            ...mapMutations(["setchatWSServerStatus",]),
            test() {
                // close 发送 code,reason 是在后台的关闭事件接收,而非本地的 onclose 事件(原生 WS)
                // this.ws.close(3333, "离开聊天室,关闭 websocket 连接")
                // this.io.close(1000, "用户离开聊天室")
            },
            clickSomeOneAvatar(msgItem) {
                this.chatPlaceholder = `与 ${msgItem.nickname} 私聊`
                this.privateFor = msgItem.from_uid
                log(`from_uid: ` + msgItem.from_uid)
            },
            sendMessage() {
                if (this.message === "") return

                let obj = {
                    action: "message",
                    from_uid: this.uid,
                    to_uid: this.privateFor,   // 私聊的对象 || ""

                    nickname: this.userInfo.nickname,
                    username: this.userInfo.username,
                    avatar: this.userInfo.avatar,
                    message: this.message,
                    message_type: "text",

                    timeStamp: Math.round(new Date().getTime() / 1000),
                }

                this.io.emit('message', obj)
                // 清空输入框
                // this.message = ""
            },

            createSocketIOClient() {
                let _this = this

                const io = require('socket.io-client');
                this.io = io(process.env.CHAT_WS_SERVER)
                this.uid = createUid(this.userInfo.username)    // 用户的 uid

                // 连接
                this.io.on('connect', () => {
                    // 这里的 socket 是 undefined
                    // let token = socket.handshake.query.token;

                    log("ws 已连接")
                    // ws 连接后就触发上线
                    let obj = {
                        action: "online",
                        nickname: this.userInfo.nickname,
                        username: this.userInfo.username,
                        userId: this.userInfo.id,
                        uid: this.uid,
                        timeStamp: Math.round(new Date().getTime() / 1000),
                    }
                    this.io.emit("online", obj)
                    console.log("ws 已触发上线")

                })
                this.io.on('registed', (data) => {

                })

                // 群聊
                this.io.on('message', (data) => {
                    _this.addMsgToChatList(data)
                    _this.scrollToChatBottom()
                })

                // 收到提醒
                this.io.on('notice', (data) => {
                    // 添加提醒
                    _this.addNoticeToChatList(data, data.type)
                    _this.scrollToChatBottom()
                })

                // 断开连接
                this.io.on('disconnect', (socket) => {
                    log("ws 断开连接")
                })


            },
            addMsgToChatList(msg) {
                this.chatList.push(msg)
            },
            addNoticeToChatList(data, type) {
                let msg
                if (type === "online") {
                    msg = `<div class="online  msg"><strong>${data.nickname}</strong> 上线了,现在有<strong>${data.userNum}</strong>人</div>`
                } else if (type === "offline") {
                    msg = `<div class="online  msg"><strong>${data.nickname}</strong> 下线了,现在有<strong>${data.userNum}</strong>人</div>`
                }
                let chat = document.getElementsByClassName("rounded-messages")[0]

                chat.append(this.parseDom(msg))
            },

            scrollToChatBottom() {
                let chat = document.getElementsByClassName("rounded-messages")[0]
                // dom 更新再滚动,否则是滚动到原来的高度
                this.$nextTick(() => {
                    chat.scrollTop = chat.scrollHeight
                })

            },
            parseDom(arg) {
                // 用于把模版字符串的 dom 转成真正的 dom (只能有一个父元素)
                var objE = document.createElement("div");

                objE.innerHTML = arg;

                return objE.childNodes[0];
            },

            // 用原生的 API 创建 socket
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
                            _this.addMsgToChatList(res)

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
                    console.log("echo-protocol ws " + closeReason)

                    let nullAct = () => {
                    }
                    ws.onopen = nullAct;
                    ws.onmessage = nullAct;
                    ws.onerror = nullAct;
                    ws.onclose = nullAct;
                    ws = nullAct

                    _this.wsConnecting = false
                    _this.setchatWSServerStatus(false)
                }
                ws.onerror = function (ev) {
                    console.log("ws 出现连接错误", ev)
                }
            },
        },
        watch: {
            chatList(curVal, oldVal) {
                if (curVal.length > this.maxChatSize) {
                    // TODO 截断列表有问题,新消息不能插进来
                    // curVal.pop()
                }
            },
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    .clearfix ::after {
        content: " ";
        display: block;
        clear: both;
    }

    .chat {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .chat-wrapper {
            flex: 1;
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            /*底部 tabbar 高度,加了之后 ff 正常,不加 chrome 正常*/
            /*padding-bottom: 48px;*/

            /*消息框公共部分*/
            .item-wrapper {
                display: flex;
                flex-wrap: nowrap;
                position: relative;
                .avatar {
                    width: 100%;
                    flex-basis: 40px;
                    img {
                        width: 36px;
                        height: 36px;
                    }
                }
                .right-wrapper {
                    /*width: 100%;*/
                    flex: 1;
                    position: relative;
                    .nickname {
                    }
                }
            }
            /*消息在左边的情况*/
            .left-item-wrapper {
                .avatar {
                    /*order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。*/
                    order: -1;
                }
                .right-wrapper {
                    .nickname {
                        padding-left: 15px;
                        font-size: 12px;
                        color: #555;
                    }
                }
            }
            /*消息在右边的情况*/
            .right-item-wrapper {
                .avatar {
                    /*order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。*/
                    order: 2;
                    align-self: flex-end;
                }
                .right-wrapper {
                    .nickname {
                        display: none;
                    }
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
            div.rounded-messages {

                width: 100%;
                height: 100%;
                /*overflow: auto;*/
                overflow-x: hidden;
                overflow-y: scroll;

                list-style: none;
                display: inline-block;
                /*overflow: hidden;*/
                font-size: 16px;
                padding: 10px;
            }

            /* Animation */
            @keyframes message-reveal-animation {
                from {
                    opacity: 0;
                    margin-bottom: 40px;
                }
                to {
                    opacity: 1;
                    margin-bottom: 10px;
                }
            }
            div.rounded-messages.reveal-messages .msg {
                /*visibility: hidden;*/
            }

            div.rounded-messages.msg-animation-superfast .msg.msg-visible,
            div.rounded-messages.msg-animation-fast .msg.msg-visible,
            div.rounded-messages.msg-animation-slow .msg.msg-visible,
            div.rounded-messages.msg-animation-normal .msg.msg-visible,
            div.rounded-messages .msg.msg-visible {
                animation: message-reveal-animation;
                animation-duration: 0.3s;
                /* Default Animation Length */
                animation-iteration-count: 1;
                visibility: visible;
            }

            div.rounded-messages.msg-animation-superfast .msg.msg-visible {
                animation-duration: 0.2s;
                /* Super Fast Animation Length */
            }

            div.rounded-messages.msg-animation-slow .msg.msg-visible {
                animation-duration: 0.5s;
                /* Slow Animation Length */
            }

            /* Message Bubbles */
            div.rounded-messages .msg {
                position: relative;
                clear: both;
                display: block;
                height: auto;
                width: auto;
                max-width: 70%;
                word-wrap: break-word;
                word-break: keep-all;
                font-family: sans-serif;
                text-align: left;
                line-height: 1.5em;
                margin: 5px 15px;
                padding: 10px;
                cursor: default;
                border-radius: 15px;

            }

            /* Left Message Bubble */
            div.rounded-messages .msg:not(.right-msg),
            div.rounded-messages .msg.left-msg {
                float: left;
                color: #292929;
                background: #E3E2DF;
            }

            div.rounded-messages .msg:not(.right-msg)::before,
            div.rounded-messages .msg.left-msg::before {
                /* Left Message Bubble Tail */
                content: "";
                position: absolute;
                top: 5px;
                left: -10px;
                border-top: 15px solid #E3E2DF;
                border-left: 15px solid transparent;
            }

            /* Right Message Bubble */
            div.rounded-messages .msg.right-msg {
                float: right;
                color: #F8F8F8;
                background: #27AE60;
            }

            div.rounded-messages .msg.right-msg::before {
                /* Right Message Bubble Tail */
                content: "";
                position: absolute;
                bottom: 5px;
                right: -10px;
                border-bottom: 15px solid #27AE60;
                border-right: 15px solid transparent;
            }

            /* Bubble with image */
            div.rounded-messages .msg img {
                display: block;
                max-width: 100%;
                border-radius: 5px;
                margin-bttom: 5px;
            }

            /* Bubble with no tail */
            div.rounded-messages .msg.no-tail::before,
            div.rounded-messages .msg.time::before,
            div.rounded-messages .msg.online::before {
                content: "";
                display: none;
            }

            /* Time Stamp */
            div.rounded-messages .msg.time,
            div.rounded-messages .msg.online {
                float: none;
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
            /*div.rounded-messages,*/
            /*.messages-width-large,*/
            /*.messages-width-medium,*/
            /*.messages-width-small {*/
            /*width: 100%;*/
            /*display: block;*/
            /*}*/
            /*}*/

        }

        .foot-wrapper {
            height: 48px;
            width: 100%;
            display: flex;
            position: absolute;
            bottom: 0;
            box-sizing: border-box;

            background: #f2f3f2;
            padding: 5px;
            .chat-input {
                flex: 90%;
                border: none;
                background: transparent;
                border-bottom: 1px solid #ccc;
            }
            .chat-input:focus {
                /*border: none;*/
                outline: none;
                cursor: pointer;
            }
            .chat-send {
                flex: 10%;
                border: none;
                background: none;
                color: #0078d7;
                &:focus {
                    border: none;
                    outline: none;
                }
            }
        }
    }

</style>
