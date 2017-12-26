<template>
    <div class="assert">
        <!--v-if="resData" v-for="item in resData"-->

        <!--用子路由，盖住父路由页面，返回时刷新滚动条啥的都不用判断了 ：)-->
        <router-view></router-view>

        <div class="father-router" v-show="showFather">

            <div  v-for="item in articleList">
                <div class="panel">
                    <div class="left-wrapper">
                        <div class="title">{{item.title}}</div>
                        <div class="dateline">{{item.dateline}}</div>
                    </div>
                    <div class="right-wrapper">
                        <img :src="item.src" alt="" width="60" height="60">
                    </div>
                </div>

                <br>
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
        name:"assert",
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
            log("article_list beforeMount!!!!")
            this.getAritcleList()
            // 判断是否是在文章页，因为如果直接输入页面的URL是不会触发路由的改变
            if(this.isInArticle()){
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
                            dateline: resData.data[i].dateline,
//                            url : "http://yangzq.top/console/get_article.php?pageid=" + resData.data[i].id + "&n=" + Math.random(),
//                            url: "/home",
                        }
                        arr.push(articleList)
                    }
                }
                return arr
            },
            isInArticle(){
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

<style lang="less">
    .get-more-article {
        color: #586C94;
        margin-left: 15px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .panel{
        padding: 15px;
        position: relative;
        display: flex;
        /*border: solid 1px #cccccc;*/
        /*border-radius: 2px;*/
        :before{
            content: " ";
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            height: 1px;
            border-top: 1px solid #E5E5E5;
            color: #E5E5E5;

            transform-origin: 0 0;

            /*transform: scaleY(0.5);*/
            left: 15px;
        }
        .right-wrapper{
            margin-right: .8em;
            width: 60px;
            height: 60px;
            line-height: 60px;
            text-align: center;
        }
        .left-wrapper{
            flex: 1;
            min-width: 0;

        }

    }
</style>
