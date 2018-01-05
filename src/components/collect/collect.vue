<template>
    <div class="collect">
        <div class="collect-title">主题收藏</div>
        <div class="collect-list" v-if="articleList">
            <div class="collect-list-item" v-for="item in articleList" @click="readMore(item.article_id)"  >
                <div class="banner" v-if="item.banner_img">
                    <img :src="item.banner_img">
                </div>
                <div class="text" >
                    <div class="title">
                        {{item.title}} <br>
                    </div>
                    <div class="info">
                        <span class="dateline">{{ commonTime(item.dateline)}}</span>
                        <span class="agree">{{ item.agree }} 赞同</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="collect-none" v-else>
            暂无收藏
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: "collect",
        data() {
            return {
                articleList: null,
                resData: null

            }
        },
        methods: {
            readMore(id) {
                this.$router.push({name: 'read_article', params: {articleId: id}})
            },
            getCollectList(user_id,) {
                let _this = this
                ajax({
                    type: "get",
                    url: "//yangzq.top/console/hos_collect.php?" + "action=" + "getlist" + "&user_id=" + user_id + "&n=" + Math.random(),
                    data: {},
                    success: function (data) {
                        let res = JSON.parse(data);
                        if (res.errno == 0) {
                            // 在vuex保存收藏列表
                            _this.$store.commit("setcollectList", res.data)
                            // 存：localStorage.setItem('weekDay',JSON.stringify(weekArray));
                            // 取： weekArray = JSON.parse(localStorage.getItem('weekDay'));
                            localStorage.setItem("collectList", JSON.stringify(res.data))
                            log("在vuex,localStorage保存收藏列表")
                            _this.articleList = res.data
                            log(_this.articleList)
                        } else if (res.errno == 1) {
                            _this.$store.commit("setcollectList", "")
                            localStorage.setItem("collectList", "")
                            log(res.msg.receiveMsg)
                        }
                        else {

                        }
                    },
                    error() {
                        log("getCollectList error")
                    }
                })
            },

            getAritcleList() {
                let _this = this
                ajax({
                    type: "get",
                    url: "//yangzq.top/console/article_list.php?page=" + _this.page + "&n=" + Math.random(),
                    data: {},
                    success: function (data) {
                        let res = JSON.parse(data);
                        if (res.errno == 0) {
                            _this.resData = res
                            _this.page++
                        } else if (res.errno == 2) {
                            let moreBtn = document.getElementById("get-more-article")

                            moreBtn.style.display = "none"
                            _this.showLoading = true
                            _this.showLoadingSymbol = false
                            _this.loadMoreText = res.data.errMsg
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

            transformList(resData) {
//                let _this = this
                log(resData)
                let arr = []
                if (resData !== null) {
                    for (let i = 0; i < resData.data.length; i++) {
                        let articleList = {
                            // "http://placeholder.qiniudn.com/60x60/3cc51f/ffffff",
                            src: resData.data[i].banner_img,
                            title: resData.data[i].title,
                            // desc: resData.data[i].description,
                            articleId: resData.data[i].id,
//                            url : "http://yangzq.top/console/get_article.php?pageid=" + resData.data[i].id + "&n=" + Math.random(),
//                            url: "/home",
                            meta: {
                                source: this.formatSource(resData.data[i].tags),
                                date: this.formatMsgTime(resData.data[i].dateline * 1000),
                                other: "" + resData.data[i].author
                            }
                        }
                        arr.push(articleList)
                    }
                }
                return arr
            },
            commonTime(timestamp) {
                let unixTimestamp = new Date(timestamp * 1000)
                return unixTimestamp.toLocaleString()
            },
        },
        beforeMount() {

            // 判断是否是在文章页，因为如果直接输入页面的URL是不会触发路由的改变

            this.getCollectList(this.$store.state.user_id)
            log(localStorage)


        },
        watch: {
            resData(curVal, oldVal) {
                let articleList = this.articleList
                let newList = this.transformList(this.resData)

//                articleList尚未赋值时
                if (isEmptyArr(this.articleList)) {
                    this.articleList = newList
                } else {
//                    log(newList)
//                    log(articleList)
                    for (let i in newList) {
                        articleList.push(newList[i])
                    }
                }
            },
        },
    }
</script>

<style lang="less">
    .collect {
        .collect-title{
            padding: 14px 15px 10px;
            color: #999999;
            font-size: 13px;
            position: relative;
        }
        .collect-list {
            .collect-list-item {
                display: flex;
                flex-direction: row;
                padding: 15px;
                position: relative;
                .text {
                    .title {
                        font-weight: 400;
                        font-size: 17px;
                        margin-bottom: 8px;
                        white-space: normal;
                        width: auto;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        word-wrap: normal;
                        word-break: break-all;
                    }
                    .info {
                        font-size: 0.8em;
                        .dateline {
                            line-height: 12px;
                            padding: 4px 4px 4px 4px;
                            border-radius: 2px;
                            text-decoration: none;
                            color: #CECECE;
                        }
                        .agree {
                            line-height: 12px;
                            padding: 4px 4px 4px 4px;
                            border-radius: 2px;
                            text-decoration: none;
                            color: #999;
                        }

                    }
                }
                .banner {
                    margin-right: .8em;
                    width: 60px;
                    height: 60px;
                    line-height: 60px;
                    text-align: center;
                    img {
                        width: 60px;
                        height: 60px;
                    }
                }
            }
        }

    }
</style>
