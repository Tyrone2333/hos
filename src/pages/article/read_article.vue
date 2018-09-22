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


        <!--评论列表-->
        <comment :commentList="commentList"
                 @updateReply="updateReply"
                 :authorId="resData.author_id"
        ></comment>
        <!--<reply :needReply="needReply"></reply>-->

    </div>
</template>
<script type="text/ecmascript-6">

    import {getAritcleList, getAritcleById, reply} from "../../api/article.js"
    import {collect} from "../../api/collect";
    import timeTransMixins from "../../utils/timeTransMixin"

    import comment from "../../components/comment"
    import {mapGetters,} from 'vuex'


    export default {
        components: {
            comment
        },
        mixins: [timeTransMixins],
        data() {
            return {
                resData: null,
                articleId: 0,
                collected: false,
                collection: "  ☆ 收藏​",
                tags: [],
                commentList: [],    // 评论列表

                countDownTime: "",  // 打脸日倒计时
            }
        },
        computed: {
            ...mapGetters(["collectList"])
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

                let url = window.location.href
                this.articleId = this.$route.params.articleId || this.getIdByURL(url)
//                log("articleId: " + this.articleId)
                getAritcleById(this.articleId).then((res) => {

                    this.resData = res.data[0]
                    console.log("文章信息: %O", this.resData)
                    this.getTagsList(this.resData.tags)
                    this.commentList = res.reply

                }).catch(error => {
                    console.error(error.message)
                    // this.$vux.toast.show({
                    //     text: "无法获取服务器数据",
                    //     type: "warn",
                    // })
                })

            },
            // 评论更新了,需要重新加载
            updateReply() {
                this.fetchData()
                this.initcollectList()
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
                let articleId = this.articleId
                let collectAction = this.collected ? 1 : 0  // 1 是执行收藏,0 是取消收藏

                collect(articleId, collectAction)
                    .then((res) => {
                        this.$vux.toast.show({
                            text: res.message,
                            type: "success",
                        })
                        // 刷新收藏列表
                        let list = res.data;
                        this.$store.commit("setcollectList", list)

                    })
                    .catch(err => {
                        console.error(err)
                    })
            },

            getTagsList(tagString) {
                if (tagString === "" || tagString === null) {
                    // this.tags = []
                    return
                }
                this.tags = tagString.split(",")
            },
            initcollectList() {
                for (let k in this.collectList) {
                    if (this.articleId === this.collectList[k].article_id) {
                        this.collected = true
                        this.collection = this.collected ? "  ★ 已收藏​" : "  ☆ 收藏​"
                    }
                }
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
        .at-someone {
            color: #3194d0;
            text-decoration: none;
            word-break: break-all;
            cursor: pointer;

        }
        a {
            text-decoration: none;
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
