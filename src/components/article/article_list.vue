<template>
    <div class="about">
        <!--v-if="resData" v-for="item in resData"-->

        <!--用子路由，盖住父路由页面，返回时刷新滚动条啥的都不用判断了 ：)-->
        <router-view></router-view>

        <div class="father-router" v-show="showFather">

            <div >
                <panel :header="'最新文章'" :list="articleList" :type="type"
                       @on-click-item="readArticle"></panel>

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
                showFather : true,
                resData: "",
                articleList: [],
                type: '1',
                footer: {           // panel的footer Props
                    title: 'more',
                    url: "http://yangzq.top/console/show_list_test.php?n=" + Math.random(),
                },
                page: 1, // 文章的页数
                articleId: 0,
                showLoading: false,
                showLoadingSymbol: true,
                loadMoreText: "正在加载",
                item: {
                    articleId: "67",
                    desc:
                        " 手动list",
                    src:
                        "http://placeholder.qiniudn.com/60x60/3cc51f/ffffff",
                    title:
                        "手动list",
                }
            }
        },
        beforeMount() {
            log("beforeMount!!!!")
            this.getAritcleList()
//            log(this.$refs)

        },
        mounted() {
//            log(this.$emit)
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
            $route(to,from) {
                if( to.name == "article" && from.name == "read_article"){
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
                    url: "//yangzq.top/console/show_list_test.php?page=" + _this.page + "&n=" + Math.random(),
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
                let arr = []
                if (resData !== null) {
                    for (let i = 0; i < resData.data.length; i++) {
                        let articleList = {
                            src: "http://placeholder.qiniudn.com/60x60/3cc51f/ffffff",
                            title: resData.data[i].title,
                            desc: resData.data[i].description,
                            articleId: resData.data[i].id,
//                            url : "http://yangzq.top/console/get_article.php?pageid=" + resData.data[i].id + "&n=" + Math.random(),
//                            url: "/home",
                        }
                        arr.push(articleList)
                    }
                }
                return arr
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
</style>
