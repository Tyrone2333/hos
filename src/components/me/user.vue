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

        <div class="user-article">
            <tab :line-width=2 active-color='#fc378c' v-model="index">
                <tab-item class="vux-center" v-for="(item, index) in swiperList"
                          :selected="selected === item"
                          @click="selected = item" :key="index">{{item}}
                </tab-item>
            </tab>
            <swiper v-model="index" :show-dots="false" height="500px">
                <!--<swiper-item v-for="(item, index) in swiperList" :key="index">-->
                <!--<div class="tab-swiper vux-center">{{item}} Container</div>-->
                <!--</swiper-item>-->

                <swiper-item key="index">
                    <div class="user-article-title"> {{userInfo.nickname}} 的 所有文章</div>
                    <div class="user-article-list" v-if="userArticle">
                        <div class="user-article-list-item" v-for="item in userArticle"
                             @click="readMore(item.article_id)">
                            <div class="banner" v-if="item.banner_img">
                                <img :src="item.banner_img">
                            </div>
                            <div class="text">
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

                </swiper-item>
                <swiper-item key="index">
                    <div class="user-article-title"> {{userInfo.nickname}} 的 所有收藏</div>
                    <div class="user-article-list" v-if="userCollection">
                        <div class="user-article-list-item" v-for="item in userCollection"
                             @click="readMore(item.article_id)">
                            <div class="banner" v-if="item.banner_img">
                                <img :src="item.banner_img">
                            </div>
                            <div class="text">
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
                </swiper-item>

            </swiper>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    import {Panel, Group, Radio, Swiper, SwiperItem, Tab, TabItem} from 'vux'
    import {mapGetters} from 'vuex'

    import {getUserInfo} from "@/api/user"

    export default {
        name: "feedback",
        components: {
            Panel, Group, Radio, Tab, TabItem, Swiper, SwiperItem
        },
        data() {
            return {
                userId: "",
                userInfo: {},
                userArticle: [],
                userCollection: [],
                swiperList: ['文章', '收藏', '回复', '点赞', '其他'],
                selected: '文章',
                index: 0,

            }
        },
        computed: {
            // ...mapGetters(["userInfo"]),
        },
        methods: {
            getIdByURL(url) {
                let regExp = /((user)\/(\d+)$)/;
//                let str = "http://192.168.1.186:10086/#read-article/66";
                return url.match(regExp)[3]
            },
            fetchData() {
                let _this = this
                let url = window.location.href
                _this.userId = _this.$route.params.id || _this.getIdByURL(url)
//                log("articleId: " + _this.articleId)
                getUserInfo(_this.userId).then((response) => {
                    let res = response.data
                    _this.userInfo = res.data.userInfo
                    _this.userArticle = res.data.userArticle
                    _this.userCollection = res.data.userCollection
                    console.log("用户信息: %O", res)

                }).catch(err => {
                    // console.log(err)
                    _this.$vux.toast.show({
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
                log(this.userArticle)
                log(this.userCollection)
                this.$router.push({name: 'read_article', params: {articleId: id}})
            },
        },
        mounted() {
            this.fetchData()
        }
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

    }

</style>
