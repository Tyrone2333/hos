<template>
    <div class="article-list">

        <!--用子路由，盖住父路由页面，返回时刷新滚动条啥的都不用判断了 ：)-->
        <router-view></router-view>

        <div class="father-router" v-show="showFather">


            <!-- 简单场景 -->
            <Scroll
                    ref="scroll"
                    :autoUpdate="true"
                    @pullingDown="loadRefresh"
                    @pullingUp="loadMore"
            >

                <!-- 滚动的内容 -->
                <panel :header="'这不是彩蛋'" :list="articleList" :type="type"
                       @on-click-item="readArticle"
                       @on-click-header="egg">
                </panel>

            </Scroll>

        </div>

    </div>


</template>

<script>
    import {Panel, Group, Radio} from 'vux'
    import {LoadMore} from "vux"

    import {getAritcleList, getAritcleById} from "@/api/article.js"
    import * as utils from "../../utils/common"
    import Scroll from 'vue-slim-better-scroll'

    export default {
        components: {
            Panel,
            Group,
            Radio, LoadMore, Scroll
        },
        data() {
            return {
                showFather: true,
                resData: "",
                articleList: [],
                type: '5',  // vux panel 的类型，第5种

                page: 1, // 文章的页数
                articleId: 0,

                loadingFooter: true,
                loadingFooterSymbol: true,
                loadingFooterText: "正在加载",

            }
        },
        beforeMount() {
            // this.loadingFooter = true
            // this.loadingFooterSymbol = true
            this.getAritcleList(1)
            // 判断是否是在文章页，因为如果直接输入页面的URL是不会触发路由的改变
            if (this.isInArticle()) {
                this.showFather = false
            }
        },
        mounted() {
            this.$nextTick(() => {
                // Scroll 组件,自己设置定高
                let vs = document.querySelector(".vue-slim-better-scroll")

                // 可以在这里动态获取 viewBox 高度,赋给 vs
                let viewBoxHeight = document.querySelector("#vux_view_box_body").offsetHeight - 45 * 2

                vs.style.height = viewBoxHeight + "px"

            })
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
            loadRefresh() {
                // 下拉重新刷新数据
                this.refreshAritcleList().then(() => {
                    log("已重新刷新数据")
                }).catch(err => {
                    console.error(err)
                })
            },
            loadMore() {
                this.getMoreArticle().then((res) => {
                    log("已加载更多")
                }).catch(err => {
                    console.error(err)
                })

            },
            readArticle(item) {
                this.articleId = item.articleId
//                在 this.$router.push() 方法中path不能和params一起使用，否则params将无效。需要用name来指定页面
                this.$router.push({name: 'read_article', params: {articleId: this.articleId}})
                this.showFather = false
            },
            async getAritcleList(page) {

                await getAritcleList(page).then((res) => {
                    if (res.data.length > 0) {
                        this.resData = res.data
                        this.page++
                    } else {
                        let moreBtn = document.getElementById("get-more-article")
                        moreBtn.style.display = "none"
                        this.loadingFooter = true
                        this.loadingFooterSymbol = false
                        this.loadingFooterText = "没有更多了"
                    }
                }).catch(err => {
                    console.error(err)
                })
            },
            async getMoreArticle() {
                // this.loadingFooter = true
                await this.getAritcleList(this.page)
            },
            refreshAritcleList() {
                return new Promise((resolve, reject) => {
                    getAritcleList(1).then((res) => {
                        if (res.data.length > 0) {
                            this.articleList = this.transformList(res.data)
                        } else {
                            let moreBtn = document.getElementById("get-more-article")
                            moreBtn.style.display = "none"
                            this.loadingFooter = true
                            this.loadingFooterSymbol = false
                            this.loadingFooterText = "没有更多了"
                        }
                        resolve()
                    }).catch(err => {
                        console.error(err)
                        reject(err)
                    })
                })

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

<style lang="less">
    .article-list .weui-media-box__title {
        white-space: normal;
    }

    .get-more-article {
        color: #586C94;
        margin: 15px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .tag {
        line-height: 12px;
        padding: 4px 4px 4px 4px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        text-decoration: none;
        color: #999;
    }
</style>
