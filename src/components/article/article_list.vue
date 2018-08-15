<template>
    <div class="article-list">

        <!--用子路由，盖住父路由页面，返回时刷新滚动条啥的都不用判断了 ：)-->
        <router-view></router-view>

        <div class="father-router" v-show="showFather">

            <div>
                <panel :header="'这不是彩蛋'" :list="articleList" :type="type"
                       @on-click-item="readArticle"
                       @on-click-header="egg">
                </panel>
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

    import {getAritcleList,getAritcleById} from "@/api/article.js"

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
                type: '5',  // vux panel 的类型，第5种

                page: 1, // 文章的页数
                articleId: 0,
                showLoading: false,
                showLoadingSymbol: true,
                loadMoreText: "正在加载",

            }
        },
        beforeMount() {
            // this.showLoading = true
            // this.showLoadingSymbol = true
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
                if (to.name === "article" && from.name === "read_article") {
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

                getAritcleList(_this.page).then((response) =>{
                    let res = response.data;
                    if (res.errno === 0) {
                        _this.resData = res
                        _this.page++
                    } else if (res.errno === 2) {
                        let moreBtn = document.getElementById("get-more-article")

                        moreBtn.style.display = "none"
                        _this.showLoading = true
                        _this.showLoadingSymbol = false
                        _this.loadMoreText = "没有更多了"
                    }
                }).catch(err => {
                    console.error(err)
                    _this.$vux.toast.show({
                        text: "无法获取服务器数据",
                        type: "warn",
                    })
                })
            },
            getMoreArticle() {
//                this.showLoading = true
                this.getAritcleList()
            },
            transformList(resData) {
//                let _this = this
//                 log(resData)
                let arr = []
                if (resData !== null) {
                    for (let i = 0; i < resData.data.length; i++) {
                        let articleList = {
                            // "http://placeholder.qiniudn.com/60x60/3cc51f/ffffff",
                            src: resData.data[i].banner_img,
                            title: resData.data[i].title,
                            // desc: resData.data[i].description,
                            articleId: resData.data[i].id,
//                            url : process.env.BASE_API + "/console/get_article.php?pageid=" + resData.data[i].id + "&n=" + Math.random(),
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
                else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
                    timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
                } else {
                    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
                }
                return timeSpanStr;
            },
            formatSource(tags) {
                // 用于列表的标签分割,最多显示3个
                if (tags === "" || tags === null) {
                    return ""
                }
                let arr = tags.split(",")
                if (arr.length > 3) {
                    arr.splice(3, arr.length - 2)
                }
                return "<span class=\"tag\">" + arr.join(" ") + "</span>\n" + " &nbsp;•&nbsp; "
            },
            isInArticle() {
                let url = window.location.href
                var regExp = /((read_article)\/(\d+)$)/;
                return regExp.test(url)
            },

            egg() {
                window.location.href = "http://t.cn/RHrvjVI";
            },


        },
        computed: {},
    }
</script>

<style>
    .article-list .weui-media-box__title {
        white-space: normal;
    }

    .get-more-article {
        color: #586C94;
        margin: 15px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .weui-media-box__info__meta_extra {
        /*padding-left: 9em !important;*/
        /*border-left: none !important;*/
    }

    .tag {
        /*background-color: #ececec;*/
        line-height: 12px;
        padding: 4px 4px 4px 4px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        text-decoration: none;
        color: #999;
    }
</style>
