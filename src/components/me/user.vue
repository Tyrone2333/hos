<template>
    <div class="user">
        <div class="user-info">
            <div class="avatar">
                <router-link to="/me">

                    <img :src="userInfo.avatar">
                </router-link>
            </div>
            <div class="text">
                <div class="nickname">
                    {{userInfo.nickname}} <br>
                </div>
                <div class="home-page-edit">第 {{userInfo.id}} 号用户,加入于{{commonTime(userInfo.register_time)}}</div>
            </div>
        </div>

        <div class="user-article ">
            <sticky scroll-box="vux_view_box_body" :offset="46" :check-sticky-support="false">

                <tab :line-width=2 active-color="#fc378c" v-model="tabIndex">
                    <tab-item class="vux-center" v-for="(item, index) in swiperList"
                              :selected="selected === item"
                              @click="selected = item" :key="index">{{item}}
                    </tab-item>
                </tab>
            </sticky>

            <swiper class="swiper-wrapper w-e-clear-fix" v-model="tabIndex" :show-dots="false" height="400px">
                <!--文章-->
                <swiper-item>
                    <div class="user-article-title"> {{userInfo.nickname}} 的 所有文章</div>
                    <cell-list :articleList="userArticle"></cell-list>
                </swiper-item>
                <!--收藏-->
                <swiper-item>
                    <div class="user-article-title"> {{userInfo.nickname}} 的 所有收藏</div>
                    <cell-list :articleList="userCollection"></cell-list>
                </swiper-item>
                <!--回复-->
                <swiper-item>
                    <div class="user-article-title"> {{userInfo.nickname}} 的 所有评论</div>
                    <div class="user-article-list" v-if="userReply">
                        <div class="user-article-list-item" v-for="item in userReply.comment"
                             @click="readMore(item.article_id)">
                            <div class="text">
                                <div class="title">
                                    {{item.from_nickname}}
                                    在文章 {{item.title}}
                                    评论了 {{item.to_nickname}}
                                </div>
                                <div class="content">
                                    {{item.comment_content}}
                                </div>
                                <div class="info">
                                    <span class="dateline">{{ commonTime(item.timestamp)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </swiper-item>

            </swiper>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    import {Panel, Group, Radio, Swiper, SwiperItem, Tab, TabItem, Sticky} from 'vux'
    import {mapGetters} from 'vuex'
    import {getUserInfo} from "@/api/user"
    import cellList from "../common/cellList"


    export default {
        name: "user",
        components: {
            Panel, Group, Radio, Tab, TabItem, Swiper, SwiperItem, Sticky, cellList
        },
        data() {
            return {
                userId: "",
                userInfo: {},
                userArticle: [],
                userCollection: [],
                userReply: {},
                swiperList: ['文章', '收藏', '回复',],
                selected: '文章',
                tabIndex: 0,
            }
        },
        computed: {
            // ...mapGetters(["userInfo"]),
        },
        mounted() {
            this.fetchData()

            this.initSwiperHeight()
        },

        watch: {
            tabIndex(curVal, oldVal) {
                let swiper = document.getElementsByClassName("vux-swiper")[0]
                let swipers = document.getElementsByClassName("vux-swiper-item")

                swiper.style.height = swipers[curVal].offsetHeight + "px"
            },
        },
        methods: {
            changeMsg() {
                this.msg = "Hello world."
                this.msg1 = this.$refs.msgDiv.innerHTML
                this.$nextTick(() => {
                    this.msg2 = this.$refs.msgDiv.innerHTML
                })
                this.msg3 = this.$refs.msgDiv.innerHTML
            },

            initSwiperHeight() {
                let swiper = document.getElementsByClassName("vux-swiper")[0]
                let swipers = document.getElementsByClassName("vux-swiper-item")

                swiper.style.height = swipers[0].offsetHeight + "px"

            },
            getIdByURL(url) {
                let regExp = /((user)\/(\d+)$)/;
//                let str = "http://192.168.1.186:10086/#read-article/66";
                return url.match(regExp)[3]
            },
            fetchData() {
                this.userId = this.$route.params.id || this.getIdByURL(window.location.href)
                getUserInfo(this.userId).then((response) => {
                    let res = response.data
                    this.userInfo = res.data.userInfo
                    this.userArticle = res.data.userArticle
                    this.userCollection = res.data.userCollection
                    this.userReply = res.data.userReply
                    this.$nextTick().then(function () {
                        // DOM 更新了
                        log(" this.nextTick().then(function () {")

                    })
                    console.log("用户信息: %O", res)

                }).catch(err => {
                    // console.log(err)
                    this.$vux.toast.show({
                        text: "无法获取服务器数据",
                        type: "warn",
                    })
                })

            },
            commonTime(timestamp) {
                let unixTimestamp = new Date(timestamp * 1000)
                return unixTimestamp.toLocaleString()
            },
            readMore(id) {
                this.$router.push({name: 'read_article', params: {articleId: id}})
            },

        },

    }
</script>

<style lang="less">
    .user {
        .user-info {
            display: flex;
            padding: 5px 15px;
            .text {
                flex-direction: column;
                margin-left: 20px;
                color: #4d555d;
                .nickname {
                    font-size: 1.2em;
                }
                .home-page-edit {
                    font-size: 0.9em;
                    color: #ccc;
                }
            }
            .avatar {
                /*padding-top: 10px;*/
                text-align: center;
                img {
                    width: 60px;
                    height: 60px;
                    border-radius: 20%;
                }
            }
        }

        .user-article {
            .user-article-title {
                padding: 14px 15px 10px;
                color: #999999;
                font-size: 13px;
                position: relative;
            }
            .user-article-list {
                .user-article-list-item {
                    display: flex;
                    flex-direction: row;
                    padding: 15px;
                    position: relative;
                    .text {
                        .big-title, .content {
                            font-weight: 400;
                            font-size: 18px;
                            margin-bottom: 8px;
                            white-space: normal;
                            width: auto;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-wrap: normal;
                            word-break: break-all;
                        }
                        .title {
                            font-size: 12px;
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

    }

    .vux-slider > .vux-swiper > .vux-swiper-item {
        height: auto !important;
    }
</style>
