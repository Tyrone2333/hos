<template>
    <div class="read_article" v-if="resData">
        <!--<div v-for="item in resData.data">-->
        <h1>{{resData.data.title}}</h1>
        <div class="article-info">
            <span>{{resData.data.author}} 写于 {{resData.data.dateline}}</span>
        </div>

        <div class="content" v-html="resData.data.content"></div>
        <!--</div>-->

    </div>
</template>
<script type="text/ecmascript-6">
    import "./article_markdown.css"

    export default {
        data() {
            return {
                resData: null,
                articleId: 8,
            }
        },
        beforeMount() {
            this.fetchData()
        },
        methods: {
            getIdByURL(url) {
                var regExp = /((read_article)\/(\d+)$)/;
//                var str = "http://192.168.1.186:10086/#read_article/66";
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
                        var res = JSON.parse(data)
                        _this.resData = res
                        log(_this.resData)
                    },
                    error() {
                        alert("无法获取服务器数据")
                    }
                })
            }
        },
        watch: {
            /**
             * 同一个地址只变化id，页面不重载的问题 https://github.com/vuejs/vue-router/issues/296
             * 由于这个问题的解决，通过URL来获取id变得无用，而且由于组件是复用的，并不会触发 beforeMount 钩子
             * @param curVal
             * @param oldVal
             */
            $route(curVal,oldVal) {
                this.fetchData()
            },
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

<style lang="less">
    .article-info {
        color: #999;
    }

    /*.read_article{*/
    /*h1 {*/
    /*border-bottom: 1px solid #eaecef;*/

    /*}*/
    /*img {*/
    /*min-width: 100%;*/
    /*max-width: 100%;*/
    /*}*/
    /*li{*/
    /*list-style: circle;*/
    /*}*/
    /*}*/

</style>
