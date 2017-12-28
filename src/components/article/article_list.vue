<template>
    <div class="about">
        <!--v-if="resData" v-for="item in resData"-->

        <!--用子路由，盖住父路由页面，返回时刷新滚动条啥的都不用判断了 ：)-->
        <router-view></router-view>

        <div class="father-router" v-show="showFather">

            <div>
                <panel :header="'最新文章'" :list="articleList" :type="type"
                       @on-click-item="readArticle">
                </panel>

                <!--<panel :header="item.title" :footer="item.description" :list="list" :type="type" @on-img-error="onImgError"></panel>-->
            </div>
            <div id="get-more-article" class="get-more-article" @click="getMoreArticle">
                查看更多
            </div>

            <load-more v-if="showLoading" :show-loading="showLoadingSymbol" :tip="loadMoreText"
                       background-color="#fbf9fe"></load-more>

        </div>


    </div>
</template>

<script>
    import {Panel, Group, Radio} from 'vux'
    import {LoadMore} from "vux"

    export default {
        components: {
            Panel,
            Group,
            Radio, LoadMore
        },
        data() {
            return {
                showFather: true,
                resData: "",
                articleList: [],
                type: '5',
                footer: {           // panel的footer Props
                    title: 'more',
                    url: "http://yangzq.top/console/show_list_test.php?n=" + Math.random(),
                },
                page: 1, // 文章的页数
                articleId: 0,
                showLoading: false,
                showLoadingSymbol: true,
                loadMoreText: "正在加载",

            }
        },
        beforeMount() {
            log("article_list beforeMount!!!!")
            this.getAritcleList()
            // 判断是否是在文章页，因为如果直接输入页面的URL是不会触发路由的改变
            if (this.isInArticle()) {
                this.showFather = false
            }
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
            $route(to, from) {
                if (to.name == "article" && from.name == "read_article") {
                    this.showFather = true
                }
            },
        },
        methods: {
            readArticle(item) {
                this.articleId = item.articleId
//                在 this.$router.push() 方法中path不能和params一起使用，否则params将无效。需要用name来指定页面
                this.$router.push({name: 'read_article', params: {articleId: this.articleId}})
                this.showFather = false
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
                        alert("无法获取服务器数据")
                    }
                })
            },
            getMoreArticle() {
//                this.showLoading = true
                this.getAritcleList()
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
                                source: '来源 - 科技',
                                date: this.formatMsgTime(resData.data[i].dateline * 1000),
                                other: '其他信息'
                            }
                        }
                        arr.push(articleList)
                    }
                }
                return arr
            },
            formatMsgTime(timespan) {
                // 传入的是 new Date().getTime() 的毫秒数时间戳
                var dateTime = new Date(timespan);

                var year = dateTime.getFullYear();
                var month = dateTime.getMonth() + 1;
                var day = dateTime.getDate();
                var hour = dateTime.getHours();
                var minute = dateTime.getMinutes();
                var second = dateTime.getSeconds();
                var now = new Date();
                // var now_new = Date.parse(now.toDateString());  //typescript转换写法
                var now_new = new Date().getTime()

                var milliseconds = 0;
                var timeSpanStr;

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
            isInArticle() {
                let url = window.location.href
                var regExp = /((read_article)\/(\d+)$)/;
                return regExp.test(url)
            },

        },
        computed: {
//            list() {
//                let _this = this
//                let arr = []
//                if (this.resData !== null) {
//                    for (let i = 0; i < _this.resData.data.length; i++) {
//                        let articleList = {
//                            src: "http://placeholder.qiniudn.com/60x60/3cc51f/ffffff",
//                            title: _this.resData.data[i].title,
//                            desc: _this.resData.data[i].description,
//                            articleId: _this.resData.data[i].id,
////                            url : "http://yangzq.top/console/get_article.php?pageid=" + _this.resData.data[i].id + "&n=" + Math.random(),
////                            url: "/home",
//                        }
//                        arr.push(articleList)
//                    }
//                }
//                log(arr)
//                return arr
//            }
        },
    }
</script>

<style>
    .get-more-article {
        color: #586C94;
        margin-left: 15px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .weui-media-box__info__meta_extra {
        padding-left: 9em !important;
        border-left: none !important;
    }
</style>
