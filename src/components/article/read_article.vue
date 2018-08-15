<template>
    <div class="read-article" v-if="resData">

        <h2>{{resData.title}}</h2>
        <div class="collection " @click="toggleCollect">
            {{collection}}
        </div>
        <div class="article-info">
            <span>{{resData.author}} 写于 {{commonTime(resData.dateline)}}</span>
        </div>

        <div class="article-page-split-line"></div>

        <div class="content" v-html="resData.content"></div>

        <span v-if="tags" v-for="(item,idx) in tags"
              v-bind:key="item"
              class="list-complete-item tag"
              id="tag">{{item}}</span>
        <div class="vote-wrapper">
            <div class="agree-wrapper">
                <span class="icon  icon-thumbs-up">&nbsp;{{ resData.agree}}</span>
            </div>
            <div class="disagree-wrapper">
                <span class="icon  icon-thumbs-down">&nbsp;{{ resData.disagree}}</span>
            </div>
        </div>

        <!--这是以前的打脸网！！-->
        <!--<div class="count-down">-->
        <!--距离打脸还有 : {{countDownTime}}-->
        <!--</div>-->

        <!--分界线-->
        <div class="article-page-split-line"></div>

        <!--发表评论-->
        <div class="top-title">
            <div class="left ">精彩评论</div>
            <div class="right icon  icon-quill" @click="replyDialogShow()">写评论</div>
        </div>


        <!--评论列表-->
        <div class="comments" v-if="commentList.length ">
            <div class="comment-wrapper" v-for="(val,key) in commentList">
                <div class="avatar">
                    <img :src="val.avatar" alt="">
                </div>
                <div class="comment-right">
                    <div class="nickname">{{val.from_nickname}}</div>
                    <div class="content">
                        <a href="" class="at-someone">{{!val.is_for_author ?"@" +val.to_nickname + "\t" :"" }}</a>
                        {{val.content}}
                    </div>
                    <div class="footer">
                        <span class="left">{{key + 1}}楼 {{formatMsgTime(val.timestamp * 1000)}}</span>
                        <span class="right icon icon-question_answer" @click="replyDialogShow(val)"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="comments no-comment" v-else>
            暂无评论
        </div>
        <!--<reply :needReply="needReply"></reply>-->

        <div v-transfer-dom>
            <x-dialog v-model="showReplyDialog"
                      :hide-on-blur="true">

                <div class="reply">
                    <form>
                        <textarea name="content" maxlength="10000" class="mll" id="reply_content"
                                  v-model="commentContent"
                                  :placeholder="replyPlaceholder"
                                  style="overflow: hidden; word-wrap: break-word; resize: none; height: 112px;"></textarea>
                    </form>

                    <!--<span class="icon   icon-send" @click="reply"></span>-->
                    <span class="weui-btn weui-btn_mini btn-none" @click="showReplyDialog=false">取消</span>
                    <span class="weui-btn weui-btn_mini weui-btn_primary" @click="replySend">确认</span>
                    <!--<x-button mini  type="primary">primary</x-button>-->
                    <!--<x-button mini  type="primary" @click.native="showReplyDialog=false">取消</x-button>-->

                </div>
            </x-dialog>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">

    import {getAritcleList, getAritcleById, reply} from "../../api/article.js"

    import {XDialog, XButton} from 'vux'
    import {TransferDomDirective as TransferDom} from 'vux'

    import {collect} from "../../api/collect";

    export default {
        components: {
            XDialog, XButton
        },
        directives: {
            TransferDom
        },
        data() {
            return {
                resData: null,
                articleId: 0,
                collected: false,
                collection: "  ☆ 收藏​",
                tags: [],
                commentList: [],    // 评论列表
                commentReply: {},    // 要回复的评论信息
                commentContent: "",  // 评论的内容
                replyPlaceholder: "",
                countDownTime: "",  // 打脸日倒计时
                showReplyDialog: false,
            }
        },
        beforeMount() {
            this.fetchData()
            this.initcollectList()


        },

        methods: {
            getIdByURL(url) {
                let regExp = /((read-article)\/(\d+)$)/;
//                let str = "http://192.168.1.186:10086/#read-article/66";
                return url.match(regExp)[3]
            },
            fetchData() {
                let _this = this
                let url = window.location.href
                _this.articleId = _this.$route.params.articleId || _this.getIdByURL(url)
//                log("articleId: " + _this.articleId)
                getAritcleById(_this.articleId).then((response) => {
                    let res = response.data
                    _this.resData = res.data[0]
                    console.log("文章信息: %O", _this.resData)
                    _this.getTagsList(_this.resData.tags)
                    _this.commentList = res.reply


                }).catch(err => {
                    // console.log(err)
                    _this.$vux.toast.show({
                        text: "无法获取服务器数据",
                        type: "warn",
                    })
                })

            },
            toggleCollect() {
                if (!this.$store.state.user.user.id) {
                    this.$vux.toast.show({
                        text: "请先登录",
                        type: "warn",
                    })
                    return
                }
                this.collected = !this.collected
                this.collection = this.collected
                    ? "  ★ 已收藏​"
                    : "  ☆ 收藏​"
                this.commitCollect()
            },
            commitCollect() {

                let _this = this
                let userId = _this.$store.state.user.user.id
                let username = _this.$store.state.user.user.username
                let articleId = this.articleId
                let collectAction = this.collected ? 1 : 0  // 1 是执行收藏,0 是取消收藏
                let token = _this.$store.state.user.token

                collect(userId, username, token, articleId, collectAction).then((response) => {
                    let res = response.data
                    if (res.errno === 0) {
                        _this.$vux.toast.show({
                            text: res.message,
                            type: "success",
                        })
                    } else {
                        _this.$vux.toast.show({
                            text: res.message,
                            type: "warn",
                        })
                    }
                    // 刷新收藏列表
                    let list = response.data.data;
                    _this.$store.commit("setcollectList", list)

                }).catch(err => {
                    // console.log(err)
                    _this.$vux.toast.show({
                        text: "无法获取服务器数据",
                        type: "warn",
                    })
                })
            },
            commonTime(timestamp) {
                let unixTimestamp = new Date(timestamp * 1000)
                return unixTimestamp.toLocaleString()
            },
            getTagsList(tagString) {
                if (tagString === "" || tagString === null) {
                    // this.tags = []
                    return
                }
                this.tags = tagString.split(",")
            },
            initcollectList() {
                if (!localStorage.getItem('collectList')) return
                let list = JSON.parse(localStorage.getItem('collectList'))

                for (let k in list) {
                    if (this.articleId === list[k].article_id) {
                        this.collected = true
                        this.collection = this.collected ? "  ★ 已收藏​" : "  ☆ 收藏​"
                    }
                }
            },
            replyDialogShow(commentInfo) {
                this.showReplyDialog = true
                this.commentReply = commentInfo || {}


                this.replyPlaceholder = this.commentReply.from_nickname ? "@" + this.commentReply.from_nickname : ""
                setTimeout(function () {
                    document.getElementById("reply_content").focus()
                }, 1)

                /**
                 * 有bug,放在最底部可以这样,如果reply组件底下还有东西就应该
                 *
                 * 现在换成x-dialog,不用滚动到底下
                 *
                 let offsetTop = document.querySelector('.reply').offsetTop
                 setTimeout(() => {
                    this.$parent.$parent.$parent.$refs.viewBox.scrollTo(offsetTop)
                }, 0)
                 *
                 */
            },
            replySend() {
                let _this = this
                let url = window.location.href
                _this.articleId = _this.$route.params.articleId || _this.getIdByURL(url)

                let data = {
                    // id,token,username,
                    //  from_id, to_id, content, timestamp, article_id, from_nickname, to_nickname

                    id: _this.$store.state.user.user.id,
                    token: _this.$store.state.user.token,
                    username: _this.$store.state.user.user.username,
                    from_id: _this.$store.state.user.user.id,
                    to_id:  _this.commentReply.from_id || _this.resData.author_id || 0,
                    content: _this.commentContent,
                    // timestamp: ,
                    article_id: _this.articleId,
                }
                reply({...data}).then((response) => {
                    let res = response.data
                    log(res)
                    if (res.errno === 0) {
                        _this.commentContent = ""
                        _this.showReplyDialog = false
                        _this.$vux.toast.show({
                            text: res.message,
                            type: "success",
                        })

                    } else {
                        _this.$vux.toast.show({
                            text: res.message,
                            type: "warn",
                        })
                    }
                    _this.fetchData()
                    _this.initcollectList()
                }).catch(err => {
                    console.error(err)
                })

            },
            // 格式化时间为"xx小时前"
            formatMsgTime(timespan) {
                // 传入的是 new Date().getTime() 的毫秒数时间戳
                let dateTime = new Date(timespan);

                let year = dateTime.getFullYear();
                let month = dateTime.getMonth() + 1;
                let day = dateTime.getDate();
                let hour = dateTime.getHours();
                let minute = dateTime.getMinutes();
                let second = dateTime.getSeconds();
                let now = new Date();
                // let now_new = Date.parse(now.toDateString());  //typescript转换写法
                let now_new = new Date().getTime()

                let milliseconds = 0;
                let timeSpanStr;

                milliseconds = now_new - timespan;

                if (milliseconds <= 1000 * 60 * 1) {
                    timeSpanStr = '刚刚';
                }
                else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
                    timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
                }
                else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
                    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
                }
                else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
                    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
                }
                else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
                    timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
                } else {
                    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
                }
                return timeSpanStr;
            },

            // 倒计时
            getCountDown(timestamp) {
                window.clearInterval(this.$store.state.clock)
                let clo = setInterval(() => {
                    let nowTime = new Date();
                    let endTime = new Date(timestamp * 1000);
                    let t = endTime.getTime() - nowTime.getTime();
                    if (t <= 0) {
                        this.countDownTime = "已过期"
                        return
                    }
                    let d = Math.floor(t / 1000 / 60 / 60 / 24);
                    let hour = Math.floor(t / 1000 / 60 / 60 % 24);
                    let min = Math.floor(t / 1000 / 60 % 60);
                    let sec = Math.floor(t / 1000 % 60);

                    this.countDownTime = d + " 天 " + hour + " 时 " + min + " 分 " + sec + " 秒 ";

                }, 1000);

            }


        },
        computed: {},
        watch: {
            /**
             * 同一个地址只变化id，页面不重载的问题 https://github.com/vuejs/vue-router/issues/296
             * 由于这个问题的解决，通过URL来获取id变得无用，而且由于组件是复用的，并不会触发 beforeMount 钩子
             * @param curVal
             * @param oldVal
             */
            $route(curVal, oldVal) {
                this.fetchData()
            },
            resData(curVal, oldVal) {
                this.getCountDown(curVal.fuck_date)
            }
        },
        beforeRouteUpdate(to, from, next) {
            next()
            // 在当前路由改变，但是该组件被复用时调用
            // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
            // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
            // 可以访问组件实例 `this`
        },

    }
</script>

<style lang="less" type="less">
    @import "article_markdown.css";

    .read-article {
        .count-down {
            margin: 3px auto 3px 0;
            font-size: 1em;
            color: #606060;
            padding-left: 10px;
        }

        .comments {
            & :first-child .comment-right {
                border: none !important;
            }
            .comment-wrapper {
                display: flex;
                .comment-right {
                    flex: 4;
                    flex-direction: column;
                    border-top: 1px solid #e8e8e8;
                    margin-right: 1em;
                    & > div {
                        margin: 5px 0;
                    }
                    .nickname {
                        font-size: .8rem;
                        line-height: 1.2rem;
                        color: #303030;
                    }
                    .content {
                        color: #606060;
                        font-size: .9rem;
                        line-height: 1.2rem;
                        word-wrap: break-word;
                        text-align: left;
                        padding-top: .4rem;
                        padding-bottom: .35rem;
                        font-weight: 400;
                    }
                    .footer {
                        color: silver;
                        line-height: 1.05rem;
                        font-size: .8rem;
                        padding-bottom: .6rem;
                        overflow: hidden;
                        display: flex;
                        justify-content: space-between;
                    }
                }
                .avatar {
                    flex: 1;
                    img {
                        margin: 10px;
                        height: 50px;
                        width: 50px;
                    }
                }

            }

            &.no-comment {
                text-align: center;
            }
        }

        .icon {
            font-size: 18px;
            color: #000;
        }
        #tag {
            background-color: #ececec;
            margin-left: 10px;
            margin-top: 5px;
            padding: 10px;
            border-radius: 3px;
        }
        .vote-wrapper {
            margin: 25px auto 0;
            padding: 0 0 25px;
            text-align: center;
            .agree-wrapper {
                display: inline-block;
                vertical-align: middle;
            }
            .disagree-wrapper {
                display: inline-block;
                vertical-align: middle;
                margin-left: 50px;
            }
        }

        .article-page-split-line {
            height: 10px;
            background-color: #f4f4f4;
            width: 100%;
            margin: 10px 0;
        }
        .at-someone{
            color: #3194d0;
            text-decoration: none;
            word-break: break-all;
            cursor: pointer;

        }
        a{
            text-decoration: none;
        }
        .top-title{
            display: flex;
            justify-content: space-between;
            margin: 10px 10px;
            .left{

            }
            .right{
                float: right;
                color: #3194d0;
                line-height: 22px;
            }

        }
    }

    .article-info {
        color: #999;
    }

    .collection {
        color: #8590a6;
        float: right;
        margin-right: 10px;
        margin-left: 10px;
        transition: all 1s;
    }

    // 评论css
    .reply {
        .btn-none {
            border: none !important;
            background: transparent !important;
            color: black;
            &.btn-none:after {
                content: none;
            }
        }
    }

    .mll {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
        border-radius: 3px;
        font-size: 14px;
        border: 1px solid #ccc;
        display: block;
        height: 8em;
        overflow-y: auto;
        font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
        resize: vertical;
    }

    // END 评论css

</style>
