<template>
    <div class="about">
        <!--v-if="resData" v-for="item in resData"-->
        <div v-if="resData">
            <panel :header="'最新文章'" :footer="footer" :list="list" :type="type"
                   @on-click-item="readArticle"></panel>

            <!--<panel :header="item.title" :footer="item.description" :list="list" :type="type" @on-img-error="onImgError"></panel>-->
        </div>

    </div>
</template>

<script>
    import {Panel, Group, Radio} from 'vux'

    export default {
        components: {
            Panel,
            Group,
            Radio
        },
        data() {
            return {
                resData: null,
                type: '1',
                footer: {
                    title: 'more',
                    url: "http://yangzq.top/console/show_list_test.php?n=" + Math.random(),
                },
                articleId: 0,
            }
        },
        mounted() {
            let _this = this
            ajax({
                type: "get",
                url: "//yangzq.top/console/show_list_test.php?n=" + Math.random(),
                data: {},
                success: function (data) {
                    var res = JSON.parse(data)
                    _this.resData = res
                },
                error() {
                    alert("无法获取服务器数据")
                }
            })
        },
        computed: {
            list() {
                let _this = this
                let arr = []
                if (this.resData !== null) {
                    for (let i = 0; i < _this.resData.data.length; i++) {
                        let obj = {
                            src: "http://placeholder.qiniudn.com/60x60/3cc51f/ffffff",
                            title: _this.resData.data[i].title,
                            desc: _this.resData.data[i].description,
                            articleId: _this.resData.data[i].id,
//                            url : "http://yangzq.top/console/get_article.php?pageid=" + _this.resData.data[i].id + "&n=" + Math.random(),
//                            url: "/home",
                        }
                        arr.push(obj)
                    }
                }
                return arr
            }
        },
        methods: {
            readArticle(item) {
                this.articleId = item.articleId
//                在 this.$router.push() 方法中path不能和params一起使用，否则params将无效。需要用name来指定页面
                this.$router.push({name: 'read_article', params: {articleId: this.articleId}})
            },

        }
    }
</script>

<style>

</style>
