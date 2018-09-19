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

    import {getAritcleList, getAritcleById} from "@/api/article.js"
    import * as utils from "../../utils/common"

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

                getAritcleList(this.page).then((response) => {
                    let res = response.data;
                    if (res.errno === 0) {
                        this.resData = res.data
                        this.page++
                    } else if (res.errno === 2) {
                        let moreBtn = document.getElementById("get-more-article")

                        moreBtn.style.display = "none"
                        this.showLoading = true
                        this.showLoadingSymbol = false
                        this.loadMoreText = "没有更多了"
                    }
                }).catch(err => {
                    console.error(err)
                    this.$vux.toast.show({
                        text: "无法获取服务器数据",
                        type: "warn",
                    })
                })
            },
            getMoreArticle() {
//                this.showLoading = true
                this.getAritcleList()
            },
            //  把后台传入的数据转化为 panel 组件需要的数据形式
            transformList(resData) {
                return resData.map((item) => {
                    return {
                        src: item.banner_img,
                        title: item.title,
                        articleId: item.id,
                        meta: {
                            source: this.formatSource(item.tags),
                            date: utils.formatMsgTime(item.dateline * 1000),
                            other: item.author
                        }
                    }
                })
            },

            // 用于列表的标签分割,最多显示3个
            formatSource(tags) {
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
