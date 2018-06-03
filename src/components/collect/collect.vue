<template>
    <div class="collect">
        <div class="collect-title">主题收藏</div>
        <div class="collect-list" v-if="collectList">
            <div class="collect-list-item" v-for="item in collectList" @click="readMore(item.article_id)"  >
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
        <div class="collect-none" @click="test" v-else>
            暂无收藏
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex'
    export default {
        name: "collect",
        data() {
            return {
                // articleList: null,
                resData: null

            }
        },
        computed: {
            ...mapGetters(['collectList']),
        },
        methods: {
            readMore(id) {
                this.$router.push({name: 'read_article', params: {articleId: id}})
            },
            test(){
                log(this.$store.state)
                log(this.collectList)

            },
            // getCollectList(user_id,) {
            //     let _this = this
            //     ajax({
            //         type: "get",
            //         url: process.env.BASE_API + "/console/hos_collect.php?" + "action=" + "getlist" + "&user_id=" + user_id + "&n=" + Math.random(),
            //         data: {},
            //         success: function (data) {
            //             let res = JSON.parse(data);
            //             if (res.errno === 0) {
            //                 // 在vuex保存收藏列表
            //                 _this.$store.commit("setcollectList", res.data)
            //                 // 存：localStorage.setItem('weekDay',JSON.stringify(weekArray));
            //                 // 取： weekArray = JSON.parse(localStorage.getItem('weekDay'));
            //                 localStorage.setItem("collectList", JSON.stringify(res.data))
            //                 log("在vuex,localStorage保存收藏列表")
            //                 _this.articleList = res.data
            //                 console.warn(_this.articleList)
            //             } else if (res.errno === 1) {
            //                 _this.$store.commit("setcollectList", "")
            //                 localStorage.setItem("collectList", "")
            //                 log(res.msg.receiveMsg)
            //             }
            //             else {
            //
            //             }
            //         },
            //         error() {
            //             log("getCollectList error")
            //         }
            //     })
            // },

            commonTime(timestamp) {
                let unixTimestamp = new Date(timestamp * 1000)
                return unixTimestamp.toLocaleString()
            },
        },
        mounted() {
            // 判断是否是在文章页，因为如果直接输入页面的URL是不会触发路由的改变

            // this.getCollectList(this.$store.state.user_id)
            this.$store.dispatch("getCollectList",this.$store.state.user_id)

        },
        watch: {

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
