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

        <div class="count-down">
            距离打脸还有 : {{countDownTime}}
        </div>
        <div class="article-page-split-line"></div>

        <div class="comments">
            <div class="comment-wrapper" v-for="(val,key) in commentList">
                <div class="avatar">
                    <img :src="val.avatar" alt="">
                </div>
                <div class="comment-right">
                    <div class="nickname">{{val.nickname}}</div>
                    <div class="content">
                        {{val.content}}
                    </div>
                    <div class="footer">
                        <span class="left">{{val.time}}</span>
                        <span class="right" @click="replyText">回复</span>
                    </div>
                    <reply :needReply="needReply"></reply>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import reply from "./reply.vue"

    export default {
        components: {
            reply
        },
        data() {
            return {
                resData: null,
                articleId: 0,
                collected: false,
                collection: "  ☆ 收藏​",
                tags: [],
                commentList: [{
                    avatar: "https://static.huxiucdn.com/m/image/guide-logo.png?v=201706161525",
                    nickname: "水明",
                    content: "应该可以从另外线程 close，block 的这个可能会读到 EOF 或这异常（可能语言相关）。",
                    time: "4小时前",
                }, {
                    avatar: "http://img4.imgtn.bdimg.com/it/u=3965627844,1925735618&fm=11&gp=0.jpg",
                    nickname: "耳机",
                    content: "既不懂比特币也不懂朝鲜。且不说比特币的独特加密性，朝鲜得到的比特币对于本国经济根本杯水车薪。另外，作者说的外汇来源也不对，明面上是资源输出、和经济特区，暗地里是毒品、走私、军火。不过作者的新闻综合能力挺好，建议再去看看外媒，会有新的收获。\n",
                    time: "7小时前",
                },
                ],
                needReply: false,
                countDownTime: "",  // 打脸日倒计时
            }
        },
        beforeMount() {
            this.fetchData()
            this.initcollectList()
        },
        mounted() {

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
                ajax({
                    type: "get",
                    url: "//yangzq.top/console/get_article.php?articleId=" + this.articleId + "&n=" + Math.random(),
                    data: {},
                    success: function (data) {
                        let res = JSON.parse(data)
                        _this.resData = res.data[0]
                        log(_this.resData)
                        _this.getTagsList(_this.resData.tags)

                    },
                    error() {
                        _this.$vux.toast.show({
                            text: "无法获取服务器数据",
                            type: "warn",
                        })

                    }
                })
            },
            toggleCollect() {
                if (!this.$store.state.user_id) {
                    this.$vux.toast.show({
                        text: "请先登录",
                        type: "warn",
                    })
                    return
                }
                this.collected = !this.collected
                this.collection = this.collected ? "  ★ 已收藏​" : "  ☆ 收藏​"
                this.commitCollect()
            },
            commitCollect() {
                let collect = this.collected ? 1 : 0
                let _this = this
                ajax({
                    type: "get",
                    url: "//yangzq.top/console/hos_collect.php?" + "action=" + "commit" + "&article_id=" + this.articleId + "&user_id=" + _this.$store.state.user_id + "&collect=" + collect + "&n=" + Math.random(),
                    data: {},
                    success: function (data) {
                        let res = JSON.parse(data)
                        if (res.errno == 0) {
                            _this.$vux.toast.show({
                                text: res.msg.receiveMsg,
                                type: "success",
                            })
                        } else {
                            _this.$vux.toast.show({
                                text: res.msg.receiveMsg,
                                type: "warn",
                            })
                        }

                    },
                    error() {
                        _this.$vux.toast.show({
                            text: "无法获取服务器数据",
                            type: "warn",
                        })

                    }
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

                log(list)

                for (let k in list) {
                    if (this.articleId == list[k].article_id) {
                        this.collected = true
                        this.collection = this.collected ? "  ★ 已收藏​" : "  ☆ 收藏​"
                    }
                }
            },
            replyText() {
                this.needReply = !this.needReply
            },
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
                else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
                    timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
                } else {
                    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
                }
                return timeSpanStr;
            },
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
                this.$store.commit("setclock", clo)

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
                img {
                    margin: 10px;
                    height: 50px;
                    width: 50px;
                }
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


</style>
