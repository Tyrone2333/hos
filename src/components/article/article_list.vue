<template>
    <div class="about">
        <!--v-if="resData" v-for="item in resData"-->

        <div v-if="articleList">
            <panel :header="'最新文章'" :list="articleList" :type="type"
                   @on-click-item="readArticle"></panel>

            <!--<panel :header="item.title" :footer="item.description" :list="list" :type="type" @on-img-error="onImgError"></panel>-->
        </div>

        <div class="get-more-article" @click="getMoreArticle">
            read more
        </div>

        <div class="load-more" v-if="isLoading">
            <load-more :show-loading="showLoading" :tip="loadMoreText" background-color="#fbf9fe"></load-more>
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
                resData: "",
                articleList: [],
                type: '1',
                footer: {           // panel的footer Props
                    title: 'more',
                    url: "http://yangzq.top/console/show_list_test.php?n=" + Math.random(),
                },
                page: 1, // 文章的页数
                articleId: 0,
                isLoading: true,
                showLoading: true,
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
            this.getAritcleList()
        },
        mounted() {
//            log(this.resData)
        },
        watch: {
            resData(curVal, oldVal) {

                let articleList = this.articleList
                let newList = this.transformList(this.resData)

//                articleList尚未赋值时
                if (this.articleList === undefined || articleList.length == 0) {
                    this.articleList = newList
                } else {
                    log(newList)
                    log(articleList)
                    for (let i in newList){
                        articleList.push(newList[i])
                    }
                }

            },
        },
        methods: {
            readArticle(item) {
                this.articleId = item.articleId
//                在 this.$router.push() 方法中path不能和params一起使用，否则params将无效。需要用name来指定页面
                this.$router.push({name: 'read_article', params: {articleId: this.articleId}})

            },
            getAritcleList() {
                let _this = this
                ajax({
                    type: "get",
                    url: "//yangzq.top/console/show_list_test.php?page=" + _this.page + "&n=" + Math.random(),
                    data: {},
                    success: function (data) {
                        var res = JSON.parse(data)
                        if (res.errno == 0) {
                            _this.resData = res
                            _this.page++
                        } else if (res.errno == 2) {
                            _this.showLoading = false
                            _this.loadMoreText = res.data.errMsg
                        }
                    },
                    error() {
                        alert("无法获取服务器数据")
                    }
                })
            },
            getMoreArticle() {
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
//                log(arr)
                return arr
            },

        },
        computed: {
            list() {
                let _this = this
                let arr = []
                if (this.resData !== null) {
                    for (let i = 0; i < _this.resData.data.length; i++) {
                        let articleList = {
                            src: "http://placeholder.qiniudn.com/60x60/3cc51f/ffffff",
                            title: _this.resData.data[i].title,
                            desc: _this.resData.data[i].description,
                            articleId: _this.resData.data[i].id,
//                            url : "http://yangzq.top/console/get_article.php?pageid=" + _this.resData.data[i].id + "&n=" + Math.random(),
//                            url: "/home",
                        }
                        arr.push(articleList)
                    }
                }
                log(arr)
                return arr
            }
        },
    }
</script>

<style>

</style>
